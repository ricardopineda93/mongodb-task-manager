const sgMail = require('@sendgrid/mail');
const sendgridAPIKey =
  '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';

sgMail.setApiKey(sendgridAPIKey);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'ricardo@kinetik.care',
    subject: 'Welcome to Task Manager!',
    text: `Hey, ${name}! Thanks for registering to the Task Manager app!`
  });
};

module.exports = {
  sendWelcomeEmail
};
