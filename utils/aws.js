const AWS = require("aws-sdk");

AWS.config.update({
    accessKeyId: "AKIAT5Q3FKCGUMKMJ7UQ",
    secretAccessKey: "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",
    region: "ap-south-1",
});

const ses = new AWS.SES();

const sendEmail = (subject, userEmail, body) => {
    const params = {
        Source: "todolist.aniket@gmail.com",
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
    const body = `<p>Click on <a href="http://localhost:3000/reset-password/${resetToken}">this</a> this link to reset password</p>`;
    sendEmail("Reset password", userEmail, body);
};
