const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'ricardo@kinetik.care',
    subject: 'Welcome to Task Manager!',
    text: `Hey, ${name}! Thanks for registering to the Task Manager app!`
  });
};

const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'ricardo@kinetik.care',
    subject: `We're sad to see you go!`,
    text: `Hey, ${name}! Sorry to see you're not sticking around, hope the app was to your liking!`
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail
};
