// Mocks the @sendgrid/mail library with whatever functionality we define so that
// we're not using resources on testing like limited emails per month or rationed API calls

module.exports = {
  setApiKey() {
    return;
  },
  send() {
    return;
  }
};
