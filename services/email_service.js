
const nodeMailer = require('nodemailer');
if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config();


const status = {
    success: 'success',
    fail: 'fail',
}

function setupTransporter() {
    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        }
    });
    return transporter;
}

/**
 * formatMessage is a function responsible for combining client email address to message they want to sent. 
 * Will throw error if either parameter is blank
 */

function formatMessage(emailAddress, message) {
    if (emailAddress === '' || message === '') {
        throw new Error('Inputs should have values')
    }

    return 'Email from\n' + `\t${emailAddress}\n\n` + 'With message\n' + `\t${message}`;
}

/**
 * sendMail is a function responsible for sendEmail to hardcoded address with clientEmailAddress as part of the 
 * message
 */
async function sendMail(toEmail = '', clientEmail = '', subject = '', message = '') {

    const transporter = setupTransporter();

    try {
        const messageToSend = formatMessage(clientEmail, message);

        const email = {
            from: 'joefahing.smtp@outlook.com',
            to: toEmail,
            subject: subject,
            text: messageToSend
        }

        const mailResponse = await transporter.sendMail(email);

        if (mailResponse.messageId !== null) {
            const response = {
                status: status.success,
                sendTo: toEmail,
                subject: subject,
                messageSent: messageToSend
            }
            return response;
        } else {
            throw new Error('Something when wrong, missing messageId from response');
        }

    } catch (error) {

        if (error.message === 'Inputs should have values') {
            throw new Error('Email format error');
        } else {
            throw new Error('Email failed to send');
        }
    }
}

module.exports = {
    status,
    formatMessage,
    sendMail,
}




