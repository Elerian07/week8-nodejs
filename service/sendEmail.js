import nodeoutlook from "nodejs-nodemailer-outlook";



export function sendEmail(dest, message) {
    nodeoutlook.sendEmail({
        auth: {
            user: "elerian07@outlook.com",
            pass: "Ahlawy_ana1907"
        },
        from: 'elerian07@outlook.com',
        to: dest,
        subject: 'Hey you, awesome!',
        html: message,



        onError: (e) => console.log(e),
        onSuccess: (i) => console.log(i)
    }


    );
}