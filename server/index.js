require('dotenv').config();

const PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
const APIAI_TOKEN       = process.env.APIAI_TOKEN;
const APP_VERIFY_TOKEN  = process.env.APP_VERIFY_TOKEN;
const ENV               = process.env.ENV  || 'development';
const PORT              = process.env.PORT || 8080;
const api_key           = process.env.MAILGUN_API_KEY;
const domain            = process.env.DOMAIN;
const express           = require('express');
const bodyParser        = require('body-parser');
const request           = require('request');
const apiai             = require('apiai');
const app               = express();
const apiaiApp          = apiai(APIAI_TOKEN);
const orientation       = require('./orientation'); // Functions for Orientation Tests
const questions         = require('./dictionary'); // Object containing HYDF Questions
const memoryRecall      = require('./memory-recall'); // Function to match string for recall tests
const mailgun           = require('mailgun-js')({apiKey: api_key, domain: domain});

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
const identifyQuestion = (params, userResponse) => {
  if (questions[params]) {
    console.log(`Parameter Matched to Question ${questions[params]}`);
    debugger;
  }
  if (orientation[params]) {
    const orientationFunction = orientation[params]
    console.log(`
      Parameter Matched to Orientation Function
      ===> Making Function Call with Function : ${orientationFunction}
      ===> Function Parameter : ${userResponse}
      ===> ${orientationFunction(userResponse)}
      -------------------------------------------------------------------------------------------
      `);
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

  // if (req.body.entry[0].messaging[0].message) {
  //   messageContent  = req.body.entry[0].messaging[0].message.text;
  // }
  // if (req.body.entry[0].messaging[0].postback) {
  //   payload = req.body.entry[0].messaging[0].postback;
  //   console.log(`req.body.entry[0].messaging[0].postback`);
  //   printData(payload);
  // }
  // userDiagnosis.conversationID = senderID
  // userDiagnosis.howDoYouFeel.push(messageContent)
  // console.log(`USER REPORT ID: ${userDiagnosis.conversationID}`);
  // console.log(`USER REPORT HOWDOYOUFEEL: ${userDiagnosis.howDoYouFeel}`);

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

// app.get('/report', (req, res) => {
//   res.body.render('report')
// });
//
// const data = {
//   from: 'Dylan Toyne <dylantoyne@gmail.com>',
//   to: 'dylantoyne@gmail.com',
//   subject: 'Test Email',
// html: '<html lang="en">' +
//
// '<head>' +
// '<meta name="viewport" content="width=device-width" />' +
// '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />' +
// '<title> SCAT3 Results</title>' +
// '<style type="text/css">' +
// /* -------------------------------------
//     Global:
//     A very basic CSS reset
// ------------------------------------- */
//
// '* {' +
//   'margin: 0;' +
//   'font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;' +
//   'box-sizing: border-box;' +
//   'font-size: 14px;' +
// '}' +
//
// 'img {' +
//   'max-width: 35%;' +
// '}' +
//
// 'body {' +
//   '-webkit-font-smoothing: antialiased;' +
//   '-webkit-text-size-adjust: none;' +
//   'width: 100% !important;' +
//   'height: 100%;' +
//   'line-height: 1.6em;' +
// '}' +
//
// 'table td {' +
//   'vertical-align: top;' +
// '}' +
//
// /* -------------------------------------
//     Body & Container:
// ------------------------------------- */
//
// 'body {' +
//   'background-color: #7b7b7b;' +
// '}' +
//
// '.body-wrap {' +
//   'background-color: #7b7b7b;' +
//   'width: 100%;' +
// '}' +
//
// '.container {' +
//   'display: block !important;' +
//   'max-width: 600px !important;' +
//   'margin: 0 auto !important;' +
//   /* makes it centered */
//   'clear: both !important;' +
// '}' +
//
// '.content {' +
//   'max-width: 600px;' +
//   'margin: 0 auto;' +
//   'display: block;' +
//   'padding: 20px;' +
// '}' +
//
// /* -------------------------------------
//     Header & Main:
// ------------------------------------- */
//
// '.main {' +
//   'background-color: #e5e5e5;' +
//   'border: 1px solid #e9e9e9;' +
//   'border-radius: 3px;' +
// '}' +
//
// '.content-wrap {' +
//   'padding: 20px;' +
// '}' +
//
// '.content-block {' +
//   'padding: 0 0 20px;' +
// '}' +
//
// '.header {' +
//   'width: 100%;' +
//   'margin-bottom: 20px;' +
// '}' +
//
// /* -------------------------------------
//     Typography:
// ------------------------------------- */
//
// 'h1, h2, h3 {' +
//   'font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;' +
//   'color: #000;' +
//   'margin: 40px 0 0;' +
//   'line-height: 1.2em;' +
//   'font-weight: 400;' +
// '}' +
//
// 'h1 {' +
//   'font-size: 32px;' +
//   'font-weight: 500;' +
// '}' +
//
// 'h2 {' +
//   'font-size: 24px;' +
// '}' +
//
// 'h3 {' +
//   'font-size: 18px;' +
// '}' +
//
// 'h4 {' +
//   'font-size: 14px;' +
//   'font-weight: 600;' +
// '}' +
//
// 'p, ul, ol {' +
//   'margin-bottom: 10px;' +
//   'font-weight: normal;' +
// '}' +
//
// 'p li, ul li, ol li {' +
//   'margin-left: 5px;' +
//   'list-style-position: inside;' +
// '}' +
//
// /* -------------------------------------
//     Email Button:
// ------------------------------------- */
//
// 'a {' +
//   'color: #348eda;' +
//   'text-decoration: underline;' +
// '}' +
//
// '.btn-primary {' +
//   'text-decoration: none;' +
//   'color: #FFF;' +
//   'background-color: #348eda;' +
//   'border: solid #348eda;' +
//   'border-width: 10px 20px;' +
//   'line-height: 2em;' +
//   'font-weight: bold;' +
//   'text-align: center;' +
//   'cursor: pointer;' +
//   'display: inline-block;' +
//   'border-radius: 5px;' +
//   'text-transform: capitalize;' +
// '}' +
//
// /* -------------------------------------
//     Styles:
// ------------------------------------- */
//
// '.last {' +
//   'margin-bottom: 0;' +
// '}' +
//
// '.first {' +
//   'margin-top: 0;' +
// '}' +
//
// '.aligncenter {' +
//   'text-align: center;' +
// '}' +
//
// '.alignright {' +
//   'text-align: right;' +
// '}' +
//
// '.alignleft {' +
//   'text-align: left;' +
// '}' +
//
// '.clear {' +
//   'clear: both;' +
// '}' +
//
// /* -------------------------------------
//     Styles for the Results Table:
// ------------------------------------- */
//
// '.results {' +
//   'margin: 40px auto;' +
//   'text-align: center;' +
//   'width: 80%;' +
// '}' +
// '.results td {' +
//   'padding: 10px 0;' +
// '}' +
// '.results .results-items {' +
//   'width: 100%;' +
// '}' +
// '.results .results-items td {' +
//   'border-top: #eee 1px solid;' +
//   'padding-bottom: 20px;' +
//   'padding-top: 20px;' +
// '}' +
// '.results .results-items .sendOff td {' +
//   'margin-top: auto;' +
//   'border-top: 2px solid #333;' +
//   'border-bottom: 2px solid #333;' +
//   'font-weight: 700;' +
// '}' +
//
// /* -------------------------------------
//     RESPONSIVE AND MOBILE FRIENDLY STYLES
// ------------------------------------- */
//
// '@media only screen and (max-width: 640px) {' +
//   'body {' +
//     'padding: 0 !important;' +
//   '}' +
//
//   'h1, h2, h3, h4 {' +
//     'font-weight: 800 !important;' +
//     'margin: 20px 0 5px !important;' +
//   '}' +
//
//   'h1 {' +
//     'font-size: 22px !important;' +
//   '}' +
//
//   'h2 {' +
//     'font-size: 18px !important;' +
//   '}' +
//
//   'h3 {' +
//     'font-size: 16px !important;' +
//   '}' +
//
//   '.container {' +
//     'padding: 0 !important;' +
//     'width: 100% !important;' +
//   '}' +
//
//   '.content {' +
//     'padding: 0 !important;' +
//   '}' +
//
//   '.content-wrap {' +
//     'padding: 10px !important;' +
//   '}' +
//
//   '.results {' +
//     'width: 100% !important;' +
//   '}' +
// '}' +
// '</style>' +
// '</head>' +
//
// '<body>' +
//
// '<table class="body-wrap">' +
//   '<tr>' +
//   	'<td> </td>' +
//   	'<td class="container" width="600">' +
//   		'<div class="content">' +
//   			'<table class="main" width="100%" cellpadding="0" cellspacing="0">' +
//   				'<tr>' +
//   					'<td class="content-wrap aligncenter">' +
//   						'<table width="100%" cellpadding="0" cellspacing="0">' +
//   							'<tr>' +
//   								'<td class="content-block">' +
//   									'<h1 class="aligncenter"> SCAT3 Results</h1>' +
//   								'</td>' +
//   							'</tr>' +
//   							'<tr>' +
//   								'<td class="content-block">' +
//   									'<h3 class="aligncenter">' +
//                     '<img src="http://sunnybrook.ca/uploads/1/programs/brain-sciences/concussion/head-icon.png">' +
//                     '</h3>' +
//   								'</td>' +
//   							'</tr>' +
//   							'<tr>' +
//   								'<td class="content-block aligncenter">' +
//   									'<table class="results">' +
//   										'<tr>' +
//   											'<td> <strong> Dylan Toyne <!--FacebookUser--> <br> Assessment #12345<!-- Id --> <br> March 3, 2017 <!-- Data --> </strong> </td>' +
//   										'</tr>' +
//   										'<tr>' +
//   											'<td>' +
//   												'<table class="results-items" cellpadding="0" cellspacing="0">' +
//   													'<tr>' +
//   														'<td class="alignright"> <strong> Scoring Summary:</td>' +
//                                 '<table class="results-items" cellpadding="0" cellspacing="0">' +
//                                     '<tr> Number of Symptoms of 22:  </tr> <br>' +
//                                     '<tr> Symptom Severity Score of 132:  </tr> <br>' +
//                                     '<tr> Orientation of 5: </tr> <br>' +
//                                     '<tr> Immediate Memory of 15: </tr> <br>' +
//                                     '<tr> Concentration of 5: </tr> <br>' +
//                                     '<tr> Delayed Recall of 5: </tr> <br> <br>' +
//                                     '<tr> <strong> SAC Total: </tr> <br> <br> <br>' +
//                                 '</table>' +
//                               '</td>' +
//   													'</tr>' +
//   													'<tr class="sendOff">' +
//   														'<td class="aligncenter" width="100%"> <strong> Thanks For Taking Care Of Yourself!</td>' +
//   													'</tr>' +
//   												'</table>' +
//   											'</td>' +
//   										'</tr>' +
//   									'</table>' +
//                     '<table width="100%">' +
//             					'<tr>' +
//             						'<td class="aligncenter content-block"> <strong> Questions?<br> <br> <a href="mailto:"> concussionapp@example.com</a> </strong> </td>' +
//             					'</tr>' +
//             				'</table>' +
//   								'</td>' +
//   							'</tr>' +
//   						'</table>' +
//   					'</td>' +
//   				'</tr>' +
//   			'</table>' +
//   		'</td>' +
//   	'</tr>' +
//   '</table>' +
//
//   '</body>' +
//   '</html>'
// };
//
// mailgun.messages().send(data, function (error, body) {
//   console.log(body);
// });

app.use((req, res) => res.status(404).send(`Error 404. This path does not exist.`));

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
