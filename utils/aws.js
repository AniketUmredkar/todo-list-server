const AWS = require("aws-sdk");

AWS.config.update({
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
    region: process.env.MY_AWS_REGION,
});

const ses = new AWS.SES();

const sendEmail = (subject, userEmail, body) => {
    const params = {
        Source: process.env.SENDER_EMAIL,
        Destination: {
            ToAddresses: [userEmail],
        },
        Message: {
            Subject: {
                Data: subject,
            },
            Body: {
                Html: {
                    Data: body,
                },
            },
        },
    };

    ses.sendEmail(params, (err, data) => {
        if (err) {
            console.error("Error sending email:", err);
        } else {
            console.log("Email sent:", data);
        }
    });
};

exports.sendWelcomeEmail = (userEmail, firstName, lastName) => {
    const body = `Welcome ${firstName} ${lastName}`;
    sendEmail("Welcome to Our App", userEmail, body);
};

exports.sendResetPasswordEmail = (userEmail, resetToken) => {
    const body = `<p>Click on <a href="${process.env.CLIENT_DOMAIN}/reset-password/${resetToken}">this</a> this link to reset password</p>`;
    sendEmail("Reset password", userEmail, body);
};
