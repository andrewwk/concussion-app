require('dotenv').config();

const PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
const APIAI_TOKEN       = process.env.APIAI_TOKEN;
const WEATHER_API_KEY   = process.env.WEATHER_API_KEY
const APP_VERIFY_TOKEN  = process.env.APP_VERIFY_TOKEN
const api_key           = process.env.MAILGUN_API_KEY
const ENV               = process.env.ENV || "development";
const PORT              = process.env.PORT || 8080
const express           = require('express');
const bodyParser        = require('body-parser');
const request           = require('request');
const apiai             = require('apiai');
const domain            = 'https://https://api.mailgun.net/v3/sandboxb978490e20af4e2e9defb15387d1b91d.mailgun.org';
const mailgun           = require('mailgun-js') ({apiKey: api_key, domain: domain});
const app               = express();
const apiaiApp          = apiai(APIAI_TOKEN)
const emailSender       = 'dylantoyne@gmail.com';
// The file to be attached to the email:
const filename          = 'mailgun_logo.png';

const sendMessage = (event) => {

  let message = { id: event.sender.id, message: event.message.text}
  let sender = event.sender.id;
  let text   = event.message.text;

  let apiai = apiaiApp.textRequest(text, {
    sessionId: 'tabby_cat'
  });

  apiai.on('response', (response) => {
    console.log('Response:', response)
    console.log('Response.result.contexts:', response.result.contexts)
    let aiText = response.result.fulfillment.speech;

    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token: PAGE_ACCESS_TOKEN},
      method: 'POST',
      json: {
        recipient: {id: sender},
        message: {text: aiText}
      }
    }, (error, response) => {
      if (error) {
          console.log('Error sending message: ', error);
      } else if (response.body.error) {
          console.log('Error: ', response.body.error);
      }
    });
  });

  apiai.on('error', (error) => {
    console.log('Error!', error);
  });

  apiai.end();
};


// parse application/json
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => res.status(200).send('app connected and made get request to root.'));

/* For Facebook Validation */
app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] && req.query['hub.verify_token'] === APP_VERIFY_TOKEN) {
    return res.status(200).send(req.query['hub.challenge']);
  }
  return res.status(403).end();
});

/* Handling all messages */
app.post('/webhook', (req, res) => {
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message && event.message.text) {
          sendMessage(event);
        }
      });
    });
    res.status(200).end();
  }
});

// Mailgun Email Configuration:

let userId; //Email address that is asked for at the beginning of the conversation.

const email = {
  from: 'dylantoyne@gmail.com',
  to: 'userId',
  subject: 'Concussion Assessment Report',
  text: 'Thanks again for taking the assessment test, but more importantly, for taking care of yourself!'
  // attachment: file // (need to configure this)
};

mailgun.messages().send(email, function (error, body) {
  // console.log(body);
});

// curl -s --user 'api:key-288e5d867c9b2fc0696a132528015530' \
//     https://api.mailgun.net/v3/sandboxb978490e20af4e2e9defb15387d1b91d.mailgun.org/messages \
//     -F from='Mailgun Sandbox <postmaster@sandboxb978490e20af4e2e9defb15387d1b91d.mailgun.org>' \
//     -F to='Dylan <dylantoyne@gmail.com>' \
//     -F subject='Hello Dylan' \
//     -F text='Congratulations Dylan, you just sent an email with Mailgun!  You are truly awesome!'



app.use((req, res) => res.status(404).send('Error 404. This path does not exist.'));

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
