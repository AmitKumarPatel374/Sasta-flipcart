const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "amitpatel9302352967@gmail.com",
        pass: "wuksyswkhhqzgszi"
    }
})

const sendMail = async (to, subject, html) => {
    let newMail = {
        to,
        subject,
        html
    }

    return await transporter.sendMail(newMail);
}

module.exports = sendMail;