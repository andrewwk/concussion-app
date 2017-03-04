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
const apiaiApp          = apiai(APIAI_TOKEN);
const orientation       = require('./orientation');

// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const userDiagnosis = {
  conversationID: '',
  howDoYouFeel: [],
  cognitiveAssessment: []
}
const printArray = (arr) => {
  arr.map((elm, index) => {
    console.log(`${index} : ${elm}`);
  })
}
// Mongo DB Connection
// const mongo = ...
//
// const fetchDiagnosisById = () => {
//   return new Promise((resolve, reject) => {
//     mongo
//       .collection('assessments')
//       .find(..., (err, results) => {
//         if (err) {
//           return reject(err);
//         }
//         resolve(results);
//       })
//   })
// }
//
// fetchDiagnosisById(...)
//   .then()
//   .catch();

// Andrew - print error object
const printData = (data) => {
  if (data.constructor === Object) {
    for (err in data) {
      console.log(`${err} => ${data[err]}`);
    }
  }
  if (data.constructor === Array) {
    data.map((err) => {
      console.log(`${err}`);
    })
  }
  console.log(`${data}`);
}

// const checkIncomingMessage = (message) => {
//   if (message) {
//   }
// }

const sendMessage = (event) => {
  const message = { id: event.sender.id, message: event.message.text}
  console.log(`
            SEND MESSAGE FUNCTION - EVENT
    ===================================================
      THIS IS THE SENDER ID    : ${event.sender.id}
      THIS IS THE RECIPIENT ID : ${event.recipient.id}
      THIS IS THE MESSAGE TEXT : ${event.message.text}
    ==============================================================
    `);
  const senderID    = event.sender.id;
  const userMessage = event.message.text;

  const apiai = apiaiApp.textRequest(userMessage, {
    sessionId: 'doctor_concussion'
  });

  apiai.on('response', (response) => {
    console.log(`Response Result => ${response.result}`);
    if (response.result.contexts) {
      if (response.result.contexts.length > 0 && response.result.contexts[0].parameters.validMonth) {
        const testName     = response.result.contexts[1].name
        const testQuestion = response.result.contexts[0].parameters
        const userResponse = response.result.contexts[0].parameters.validMonth.original
        console.log(`
          TEST NAME     : ${testName}
          QUESTION      : ${testQuestion}
          USER RESPONSE : ${userResponse}
          `);
        }
    }

    // if (response.result.contexts[0].name) {
    //   console.log(`RESPONSE CONTEXTS NAME ${response.result.contexts[0].name}`);
    // }
    // if (response.result.contexts[0].parameters) {
    //   console.log(`RESPONSE CONTEXTS PARAMETERS ${response.result.contexts[0].parameters}`);
    // }
    // Contexts
    // Question Name
    // Entity to track test section
    let aiText = response.result.fulfillment.speech;

    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token: PAGE_ACCESS_TOKEN},
      method: 'POST',
      json: {
        recipient: {id: senderID},
        message: {text: aiText}
      }
    }, (error, response) => {
      if (error) {
        console.log(`Error sending message: ${error}`);
      } else if (response.body.error) {
        console.log(`Response Body Errors: ${printData(response.body.error)}`);
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

  let incomingMessage = req.body.entry[0].messaging
  let sender          = req.body.entry[0].messaging[0].sender
  let senderID        = req.body.entry[0].messaging[0].sender.id
  let messageContent;
  let payload;

  if (req.body.entry[0].messaging[0].message) {
    messageContent  = req.body.entry[0].messaging[0].message.text;
  }
  if (req.body.entry[0].messaging[0].postback) {
    payload = req.body.entry[0].messaging[0].postback;
    printData(payload);
  }
  console.log(`
    INCOMING MESSAGE : ${incomingMessage}
    MESSAGE CONTENT  : ${messageContent}
    SENDER           : ${sender}
    SENDERID         : ${senderID}
    `);
  userDiagnosis.conversationID = senderID
  userDiagnosis.howDoYouFeel.push(messageContent)
  console.log(`USER REPORT ID: ${userDiagnosis.conversationID}`);
  console.log(`USER REPORT HOWDOYOUFEEL: ${userDiagnosis.howDoYouFeel}`);

  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message && event.message.text) {
          debugger;
          sendMessage(event);
        }
      });
    });
    res.status(200).end();
  }
});

app.use((req, res) => res.status(404).send(`Error 404. This path does not exist.`));

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
