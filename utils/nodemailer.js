const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service:'gmail',
    auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD
    }
})

const sendMail = async (email, secretToken, mode, id) => {
    try {
        if (mode == 'OTP') {
            
            return await transport.sendMail({
                from: process.env.GMAIL_USERNAME,
                to: email,
                subject: "OTP Submission",
                html: `
        <h1>Reset Password</h1>
        <p> Here is your otp to change the password ${secretToken} </p>
      `
            })
        }
        else if (mode == 'SignUp') {
            
            return await transport.sendMail({
                from: process.env.GMAIL_USERNAME,
                to: email,
                subject: "OTP Submission",
                html: `
        <h1>Registration Successfull</h1>
        <p> Here is your Registration number- ${id} and Password- ${secretToken} </p>
      `
            })
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports = sendMail  