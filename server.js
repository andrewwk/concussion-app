require('dotenv').config();

const PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
const APIAI_TOKEN       = process.env.APIAI_TOKEN;
const APP_VERIFY_TOKEN  = process.env.APP_VERIFY_TOKEN;
const ENV               = process.env.ENV  || 'development';
const PORT              = process.env.PORT || 8080;
const express           = require('express');
const bodyParser        = require('body-parser');
const request           = require('request');
const apiai             = require('apiai');
const app               = express();
const apiaiApp          = apiai(APIAI_TOKEN)

// parse application/json
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

const userReport = {
  howDoYouFeel: [],
  cognitiveAssessment: {}
}

const sendMessage = (event) => {
  debugger;
  let message = { id: event.sender.id, message: event.message.text}
  console.log(`
    ===================================================
      THIS IS THE EVENT: ${event}
      THIS IS THE SENDER: ${event.sender}
      THIS IS THE MESSAGE: ${event.message}
    ==============================================================
    `);

  let sender = event.sender.id;
  let text   = event.message.text;

  let apiai = apiaiApp.textRequest(text, {
    sessionId: 'tabby_cat'
  });

  apiai.on('response', (response) => {
    // console.log('RESPONSE.result.contexts', response.result.contexts)
    // Question Name
    // console.log(`RESPONSE CONTEXTS NAME ${response.result.contexts[0].name}`);
    // Entity to track test section
    // console.log(`RESPONSE CONTEXTS PARAMETERS ${response.result.contexts[0].parameters}`);
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
          console.log(`Error sending message: ${error}`);
      } else if (response.body.error) {
          console.log(`Error - Response Body Error: ${response.body.error}`);
      }
    });
  });

  apiai.on('error', (error) => {
    console.log(`APIDI.ON ERROR ${error}`);
  });

  apiai.end();
};

app.get('/', (req, res) => res.status(200).send(`Application Successfully Running`));

/* For Facebook Validation */
app.get('/webhook', (req, res) => {
  console.log(`Facebook Validation - Request Query: ${req.query}`);
  if (req.query['hub.mode'] && req.query['hub.verify_token'] === APP_VERIFY_TOKEN) {
    return res.status(200).send(req.query['hub.challenge']);
  }
  // otherwise, not authorized
  return res.status(403).end();
});

/* Handling all messenges */
app.post('/webhook', (req, res) => {
  const body            = req.body
  const incomingMessage = req.body.entry[0].messaging
  const messageContent  = req.body.entry[0].messaging[0].message.text
  const sender          = req.body.entry[0].messaging[0].sender
  const senderID        = req.body.entry[0].messaging[0].sender.id

  console.log(`
    BODY             : ${body}
    INCOMING MESSAGE : ${incomingMessage}
    MESSAGE CONTENT  : ${messageContent}
    SENDER           : ${sender}
    SENDERID         : ${senderID}
    `);

  userReport.id = senderID
  userReport.howDoYouFeel.push(messageContent)
  console.log(`USER REPORT ID: ${userReport.id}`);
  console.log(`USER REPORT HOWDOYOUFEEL: ${userReport.howDoYouFeel}`);

  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        console.log(`NESTED FOR EACH LOOP EVENT: ${event}`);
        if (event.message && event.message.text) {
          sendMessage(event);
        }
      });
    });
    res.status(200).end();
  }
});

app.use((req, res) => res.status(404).send(`Error 404. This path does not exist.`));

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
