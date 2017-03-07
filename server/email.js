require('dotenv').config({path: '../.env'});

const api_key = process.env.MAILGUN_API_KEY;
const domain = process.env.DOMAIN;
const mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

const data = {
  from: 'Dylan Toyne <dylantoyne@gmail.com>',
  to: 'dylantoyne@gmail.com',
  subject: 'Test Email',
  html: '<a href="/report">Click me faggot</a>'
};

mailgun.messages().send(data, function (error, body) {
  console.log(body);
});
