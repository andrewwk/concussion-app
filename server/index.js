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
const orientation       = require('./orientation'); // Functions for Orientation Tests
const questions         = require('./dictionary'); // Object containing HYDF Questions
const memoryRecall      = require('./memory-recall'); // Function to match string for recall tests

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

// Andrew - print error and data objects
const printData = (data) => {
  if (data.constructor === Object) {
    for (log in data) {
      console.log(`Printing Data Object : ${log} => ${data[log]}`);
    }
  }
  if (data.constructor === Array) {
    data.map((log) => {
      console.log(`Printing Data Array : ${log}`);
    })
  }
  if (data.constructor === String) {
    console.log(`Printing Data String : ${data}`);
  }
  if (data.constructor === Number) {
    console.log(`Printing Data Number : ${data}`);
  }
  console.log(`Data type match not found. Sheeiitttt....${data}`);
}

const userQA = (params) => {
  for (question in params) {
    if (!question.includes('original')) {

      console.log(`Question: ${question} Answer: ${params[question]}`);
    }
  }
}

const identifyQuestion = (params, userResponse) => {
  if (questions[params]) {
    let question = questions[params]
    let answer = userResponse
    console.log(`
      Parameter Matched to Question : ${question}
      User Answer : ${answer}
      `);
  }
  if (orientation[params]) {
    const orientationFunction = orientation[params]
    let question = question[params]
    let answer = userResponse
    let score = orientationFunction(answer)
    console.log(`
      Parameter Matched to Orientation Function
      ===> Question : ${question}
      ===> Answer : ${answer}
      ===> Score : ${score}
      -------------------------------------------------------------------------------------------
      `);
    // console.log(`
    //   Parameter Matched to Orientation Function
    //   ===> Making Function Call with Function : ${orientationFunction}
    //   ===> Function Parameter AKA User Response : ${userResponse}
    //   ===> ${orientationFunction(userResponse)}
    //   -------------------------------------------------------------------------------------------
    //   `);
  }
}
const printContexts = (message) => {
  const contextsArray = []
  message.map((elm) => {
    console.log(`Here Are The Mother Fucking Contexts`);
    contextsArray.push({
      testName: elm.name,
    })
    if (elm.parameters) {
      userQA(elm.parameters)
      debugger;
      for (val in elm.parameters) {
        identifyQuestion(val, elm.parameters[val])
        // User Response
        console.log(`
          Here's some more shit => It's the FUCKING user answers ${elm.parameters[val]}
          `);
        contextsArray.push({
          val : elm.parameters[val]
        })
      }
    }
    printData(elm)
    console.log(`
      Here is the fucking contexts array : ${contextsArray}
      Let's try to print this fucker : ${printData(contextsArray)}
      `);
      debugger;
  })
}
const sendMessage = (event) => {
  const message = { id: event.sender.id, message: event.message.text}
  const senderID    = event.sender.id;
  const userMessage = event.message.text;
  const apiai = apiaiApp.textRequest(userMessage, {
    sessionId: 'doctor_concussion'
  });
  apiai.on('response', (response) => {
    console.log(`Response Result =>|| ${printData(response.result)} ||<=`);
    if (response.result.contexts && response.result.contexts.length > 0) {
      console.log(`
        CONTEXTS EXISTS || HERE'S THE FUCKING CONTEXT
        =====================================================================================
        PRINT DATA FUNCTION ${printData(response.result.contexts)}
        =====================================================================================
        PRINT CONTEXTS FUNCTION ${printContexts(response.result.contexts)}
        =====================================================================================
        `);
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
        // console.log(`Response Body Errors: ${printData(response.body.error)}`);
        console.log(`Response Body Error`);
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
    console.log(`Facebook Web Hook Validation Succeeded`);
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
  // userDiagnosis.conversationID = senderID
  // userDiagnosis.howDoYouFeel.push(messageContent)
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message && event.message.text) {
          // TODO: Create User Object Here
          console.log(`
            Return Message from Server to Facebook : ${event}
             `);
          sendMessage(event);
        }
      });
    });
    res.status(200).end();
  }
});

app.use((req, res) => res.status(404).send(`Error 404. This path does not exist.`));

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
