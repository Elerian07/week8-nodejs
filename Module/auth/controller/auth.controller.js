import userModel from "../../../DB/model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { nanoid } from 'nanoid';
import { sendEmail } from "../../../service/sendEmail.js";

const signUp = async (req, res) => {
    try {
        let { userName, email, password, cPassword, age, phone } = req.body;
        if (password == cPassword) {
            const user = await userModel.findOne({ email });
            if (user) {
                res.json({ message: "Already register" });
            } else {
                const hash = await bcrypt.hashSync(password, parseInt(process.env.saltRound));

                const signUp = new userModel({
                    userName,
                    email,
                    password: hash,
                    age,
                    phone,
                });
                const signedUp = await signUp.save();
                let token = jwt.sign({ id: signedUp._id }, process.env.tokenEmailKey, { expiresIn: 60 })
                const refreshToken = jwt.sign({ id: signedUp._id }, process.env.tokenKey);
                let message = `<a href = "http://localhost:3000/api/v1/auth/confirmEmail/${token}"> please click here to confirm your email </a> 
                <br>
                <br>
                <a href = "http://localhost:3000/api/v1/auth/refresh/${refreshToken}"> click here to get new one </a>
                `
                sendEmail(email, message)
                res.json({ message: "signedUp", signUp });
            }
        } else {
            res.json({ message: "password dose not match cPassword" });
        }
    } catch (error) {
        res.json({ message: "error", error })
    }
};

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (user) {
            const matched = await bcrypt.compareSync(password, user.password);
            if (matched) {
                if (user.isConfirmed) {

                    const token = jwt.sign({ id: user._id }, process.env.tokenKey,);


                    res.json({ message: "welcome, you are signed in", token });
                } else {
                    res.json({ message: "please confirm your email first" });
                }
            } else {
                res.json({ message: "incorrect password" });
            }
        } else {
            res.json({ message: "you have to register first" });
        }
    } catch (error) {
        res.json({ message: "error", error })
    }
};

const confirmEmail = async (req, res) => {
    try {
        let { token } = req.params;
        let decoded = jwt.verify(token, process.env.tokenEmailKey)
        if (decoded) {
            let user = await userModel.findById({ _id: decoded.id, isConfirmed: false })
            if (user) {
                let updated = await userModel.findByIdAndUpdate(decoded.id, { isConfirmed: true }, { new: true })
                res.json({ message: "confirmed", updated })
            } else {
                res.json({ message: "your email is already confirmed or invalid token " })
            }
        } else {
            res.json({ message: "invalid token " })

        }
    } catch (error) {
        res.json({ message: "error", error })
    }
}

const forgetPassword = async (req, res) => {
    try {
        let { email, newPassword, newCPassword, OTP } = req.body;
        if (newPassword == newCPassword) {
            let user = await userModel.findOne({ email, OTP })
            if (!OTP) {
                res.json({ message: "invalid  OTP" })
            }
            if (user) {
                let hash = await bcrypt.hashSync(newPassword, parseInt(process.env.saltRound));
                let updatedPassword = await userModel.findByIdAndUpdate(user._id, { password: hash, OTP: null })
                res.json({ message: "password updated" })
            } else {
                res.json({ message: "invalid email" })
            }
        } else {
            res.json({ message: "password and cPassword isn't matched" })

        }

    } catch (error) {
        res.json({ message: "error", error })
    }
}

const sendCode = async (req, res) => {
    try {
        let { email } = req.body;
        let user = await userModel.findOne({ email })
        if (!user) {
            res.json({ message: "user didn't register" })
        } else {
            let OTPCode = nanoid();
            await userModel.findByIdAndUpdate(user._id, { OTP: OTPCode })
            let message = `your OTP is ${OTPCode}`;
            sendEmail(user.email, message);
            res.json({ message: "please check your email to get your OTP" });
        }
    } catch (error) {
        res.json({ message: "error", error })
    }
}

const refresh = async (req, res) => {
    try {
        let { token } = req.params;
        let decoded = jwt.verify(token, process.env.tokenEmailKey)
        if (!decoded || !decoded.id) {
            res.json({ message: "invalid token or id" })
        } else {
            let user = await userModel.findById(decoded.id)
            if (!user) {
                res.json({ message: "user didn't register" })
            } else {
                if (user.isConfirmed) {
                    res.json({ message: "email is confirmed" })
                } else {
                    let token = jwt.sign(user._id, process.env.tokenEmailKey)
                    let message = `<a href = "http://localhost:3000/api/v1/auth/confirmEmail/${token}"> please click here to confirm your email again</a>`
                    sendEmail(user.email, message)
                    res.json({ message: "please check your email" });
                }
            }

        }
    } catch (error) {
        res.json({ message: "error", error })
    }
}



export { signUp, signIn, confirmEmail, forgetPassword, refresh, sendCode };
