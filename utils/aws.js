const AWS = require("aws-sdk");

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
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
    const body = `<p>Click on <a href="${process.env.CLIENT_DOMAIN_S3}/reset-password/${resetToken}">this</a> this link to reset password</p>`;
    sendEmail("Reset password", userEmail, body);
};

exports.fetchSecretFromSecretsManager = async (env) => {
    if (env !== "production") {
        return;
    }
    const secretsManager = new AWS.SecretsManager({ region: process.env.AWS_REGION });

    try {
        const data = await secretsManager.getSecretValue({ SecretId: "to-do-app-secret" }).promise();
        const secrets = JSON.parse(data.SecretString);
        console.log("secrets:", secrets);

        process.env.AWS_ACCESS_KEY_ID = secrets.AWS_ACCESS_KEY_ID;
        process.env.AWS_SECRET_ACCESS_KEY = secrets.AWS_SECRET_ACCESS_KEY;
        process.env.DATABASE_USER = secrets.DATABASE_USER;
        process.env.DATABASE_PASSWORD = secrets.DATABASE_PASSWORD;
        process.env.JWT_SECRET = secrets.JWT_SECRET;
    } catch (error) {
        console.error("Error fetching secret:", error);
        throw error;
    }
};
