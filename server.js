require('dotenv').config();

const PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
const APIAI_TOKEN       = process.env.APIAI_TOKEN;
// const WEATHER_API_KEY   = process.env.WEATHER_API_KEY
const APP_VERIFY_TOKEN  = process.env.APP_VERIFY_TOKEN
const ENV               = process.env.ENV || "development";
const PORT              = process.env.PORT || 8080
const express           = require('express');
const bodyParser        = require('body-parser');
const request           = require('request');
const apiai             = require('apiai');
const app               = express();
const apiaiApp          = apiai(APIAI_TOKEN)

const sendMessage = (event) => {

  let message = { id: event.sender.id, message: event.message.text}
  console.log("NEW MESSAGE OBJECT");

  console.log("this is the event", event);
  console.log('==========================================');
  console.log("this is the sender", event.sender);
  console.log('==========================================');
  console.log("this is the message", event.message);
  console.log('==========================================');

  let sender = event.sender.id;
  let text   = event.message.text;

  let apiai = apiaiApp.textRequest(text, {
    sessionId: 'tabby_cat'
  });



  apiai.on('response', (response) => {
    console.log('RESPONSE', response)
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
    console.log('ERROR', error);
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
  console.log(req.query);
  if (req.query['hub.mode'] && req.query['hub.verify_token'] === APP_VERIFY_TOKEN) {
    return res.status(200).send(req.query['hub.challenge']);
  }
    // otherwise, not authorized
    return res.status(403).end();
});

/* Handling all messenges */
app.post('/webhook', (req, res) => {
  console.log('THIS IS THE INCOMING MESSAGE BODY', req.body);
  console.log("This is the entry: ", req.body.entry)
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

// curl -X GET "https://graph.facebook.com/v2.6/1369056796499940?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=EAAD0XCDx7EgBAFReJz05AaNkNW7aJDDD98ykE62tgDpqDGGfbbUAI1XXFlAhRo4ZBCvKcMQC8r4N2m4neweBOPGZBhdx2lSSd0YyKzqX8LhmmPODhwZCMe7o9c97uFEmZCi3S6k60qZBzZCGUytmPyZCpwyfFkFsF73hQlo2A44rQZDZD"

app.use((req, res) => res.status(404).send('Error 404. This path does not exist.'));

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
