const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendMail = async (id, email) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        logger: true,
        secure: true,
        debug: true,
        secureConnection: false,
        auth: {
            user: "gokulsubashwydnov@gmail.com",
            pass: process.env.PASSCODE,
        },
    });

    await transporter.sendMail({
        from: '"Gokul Subhash" <gokulsubashwydnov@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Please Verify Your Email✔", // Subject line
        text: "Verify Email", // plain text body
        html: `<div style="font-size: 16px;">
                <b style="font-size: 18px;">Please Verify your Email</b> <br> 
                <span style="font-size: 16px;">Visit the Link and verify your Email
                <a href="http://localhost:3000/verify-email/${id}" style="font-size: 16px;">Click here</a></span>
              </div>`,
    });


}

module.exports = sendMail