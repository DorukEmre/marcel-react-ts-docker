const nodemailer = require('nodemailer')

const senderEmail = process.env.MAIL_USER
const senderPassword = process.env.MAIL_PASSWORD
const adminEmail = process.env.MAIL_ADMIN

// SMTP transporter
const transport = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: senderEmail,
    pass: senderPassword,
  },
})

module.exports.sendReportEmail = async (
  subject,
  recipientEmail = adminEmail,
) => {
  try {
    await transport.sendMail({
      from: senderEmail,
      to: recipientEmail,
      subject: `${subject}`,
      html: `<h2>${subject}</h2>
        <p>New report</p>`,
    })
  } catch (err) {
    console.log(err)
  }
}
