import userModel from "../../../DB/model/user.model.js"
import notesModel from "../../../DB/model/notes.model.js"
import trashCanModel from "../../../DB/model/trashCan.model.js";
import bcrypt from "bcryptjs";

export const getAllUsers = async (req, res) => {
    try {
        const getUser = await userModel.find({})
        res.json({ message: "Done", getUser })
    } catch (error) {

        res.json({ message: "error", error })
    }

}

export const changePassword = async (req, res) => {

    try {
        let { currentPassword, newPassword, newCPassword } = req.body;
        if (newPassword == newCPassword) {
            let user = await userModel.findById(req.userId);
            const matched = await bcrypt.compare(currentPassword, user.password);
            if (matched) {
                const hash = await bcrypt.hashSync(newPassword, parseInt(process.env.saltRound));
                let updatedUser = await userModel.findByIdAndUpdate(user._id, { password: hash }, { new: true })
                res.json({ message: "Updated", updatedUser })
            } else {
                res.json({ message: "current password invalid" })
            }

        } else {
            res.json({ message: "new Password and new cPassword didn't match" })
        }
    } catch (error) {
        res.json({ message: "error", error })
    }
}


export const deleteById = async (req, res) => {
    try {
        const deleteUser = await userModel.findByIdAndDelete(req.userId);
        const notes = await notesModel.deleteMany({ createdBy: req.userId })
        if (deleteUser) {
            res.json({ message: "deleted", deleteUser });
        } else {
            res.json({ message: "id not found" });
        }
    } catch (error) {
        res.json({ message: "error", error })
    }
}


export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const getUser = await userModel.findById({ _id: id })
        const getNots = await notesModel.findOne({ createdBy: id })
        res.json({ message: "done", getUser, getNots })
    } catch (error) {
        res.json({ message: "id not found", error })

    }
}

export const softDelete = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);


        if (user) {
            const user = await userModel.findByIdAndUpdate(req.userId,
                { isDeleted: true },
                { new: true })
            const trashUser = await trashCanModel.insertMany(user);
            const deletedUser = await userModel.findByIdAndDelete(req.userId);
            const notes = await notesModel.find({}).populate('createdBy')
            if (notes) {
                const notes = await notesModel.updateMany({ createdBy: req.userId },
                    { isDeleted: true },
                    { new: true });
                const trashNote = await trashCanModel.insertMany(notes);
                const deletedNote = await notesModel.deleteMany({ createdBy: req.userId });
            }
            res.json({ message: "user is deleted", deletedUser })

        } else {
            res.json({ message: "id not found" })
        }
    } catch (error) {
        res.json({ message: "error", error })
        console.log(error);
    }

}