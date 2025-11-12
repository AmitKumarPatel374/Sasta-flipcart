const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    },
    logger: true, // logs to console
  debug: true,
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