const AWS = require("aws-sdk");

AWS.config.update({
    accessKeyId: "AKIAT5Q3FKCGUMKMJ7UQ",
    secretAccessKey: "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",
    region: "ap-south-1",
});

const ses = new AWS.SES();

exports.sendWelcomeEmail = (userEmail, firstName, lastName) => {
    const params = {
        Source: "todolist.aniket@gmail.com",
        Destination: {
            ToAddresses: [userEmail],
        },
        Message: {
            Subject: {
                Data: "Welcome to Our App",
            },
            Body: {
                Text: {
                    Data: `Welcome ${firstName} ${lastName}`,
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
