require('dotenv').config();

const PAGE_ACCESS_TOKEN  = process.env.FB_PAGE_ACCESS_TOKEN;
const APIAI_TOKEN        = process.env.APIAI_TOKEN;
const APP_VERIFY_TOKEN   = process.env.APP_VERIFY_TOKEN;
const ENV                = process.env.ENV  || 'development';
const PORT               = process.env.PORT || 8080;
const express            = require('express');
const bodyParser         = require('body-parser');
const request            = require('request');
const apiai              = require('apiai');
const app                = express();
const apiaiApp           = apiai(APIAI_TOKEN);
const orientation        = require('./orientation'); // Functions for Orientation Tests
const questions          = require('./dictionary'); // Object containing Test Questions
const hydf               = questions.hydf;
const psocYes            = questions.psocYes;
const psocNo             = questions.psocNo;
const sacOrientation     = questions.sacOrientation;
const sacImmediateMemory = questions.sacImmediateMemory;
const sacConcentration   = questions.sacConcentration;
const sacDelayedRecall   = questions.sacDelayedRecall;
const memoryRecall       = require('./memory-recall'); // Function to match string for recall tests
const printData          = require('./print-data'); // Function to print data objects
const userReport         = require('./user-report');  //User Report Object going into DB.
const concentration      = require('./concentration');

// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// Andrew - Email Report Object. Different from object going into DB.
const emailReport = {
  testDate             : new Date(),
  numberOfSymptoms     : 0, //  Out of 22
  symptomSeverityScore : 0, // Out of 132
  orientation          : 0, //  Out of 5
  immediateMemory      : 0, // Out of 15
  concentration        : 0, // Out of 5
  delayedRecall        : 0, // Out of 5
  sacTotal             : 0 // Sum Scores
}

const answeredQuestions = [];

const filterQuestions = (question) => {
  return answeredQuestions.includes(question)
}
const pushQuestion = (question) => {
  if (!filterQuestions(question)) {
    answeredQuestions.push(question)
  }
}
const updateSACTotalScore = (score) => {
  if (score > 0) {
    emailReport.sacTotal += score
  }
}
const updateHYDFScores = (score) => {
  if (score > 0 && score.constructor === Number) {
    emailReport.numberOfSymptoms += 1
    emailReport.symptomSeverityScore += score
  }
}
const printQandA = (question, answer) => {
  console.log(`
    Parameter Matched to Question : ${question}
    User Answer : ${answer}
    `);
};

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
// Andrew - Function to parse user response and parameters. Then matches them to certain portions
// of the test.
const questionAnswerScore = (params, userResponse) => {
  let answer = userResponse

  if (psocYes[params]) {
    let question = psocYes[params];
    printQandA(question, answer)
    userReport.potentialSignsOfConcussion.push({ question : answer })
  }
  if (psocNo[params]) {
    let question = psocNo[params];
    printQandA(question, answer)
    userReport.potentialSignsOfConcussion.push({ question : answer })
  }
  if (hydf[params]) {
    let question = hydf[params]
    let score = parseInt(answer)
    if (!filterQuestions(params)) {
      pushQuestion(params);
      updateHYDFScores(score);
      console.log(`HYDF Matched
        EMAIL REPORT NUMBER OF SYMPTOMS ==> ${emailReport.numberOfSymptoms}
        EMAIL REPORT SYMPTOM SEVERITY SCORE ==> ${emailReport.symptomSeverityScore}
      `);
      printQandA(question, answer);
      userReport.howDoYouFeel.push({ question : answer });
      if (score > 0) {
        updateSACTotalScore(score);
        emailReport.sacTotal += 1;
        userReport.numberOfSymptoms += 1;
        userReport.symptomSeverityScore += score;
      }
    }
  }
  if (orientation[params]) {
    const orientationFunction = orientation[params];
    let question = sacOrientation[params];
    // Andrew - Unary Operator Used to Convert Boolean to Number
    let result = orientationFunction(answer);
    let score = +result;
    if (!filterQuestions(params)) {
      pushQuestion(params);
      emailReport.orientation += score;
      updateSACTotalScore(score);
      userReport.sacOrientation.push({ question : result });
      userReport.sacConcentrationScore += score;
      console.log(`
        Parameter Matched to Orientation Function
        ===> Question                       : ${question}
        ===> Answer                         : ${answer}
        ===> Unary Operator Converted Score : ${score}
        -------------------------------------------------------------------------------------------
        EMAIL REPORT ORIENTATION SCORE ==> ${emailReport.orientation}
        USER REPORT ORIENTATION SCORE ==> ${userReport.sacOrientationScore}
      `);
    }
  }
  if (sacImmediateMemory[params]) {
    let question = sacImmediateMemory[params];
    let score = memoryRecall(answer);
    if (!filterQuestions(params)) {
      pushQuestion(params);
      updateSACTotalScore(score);
      emailReport.immediateMemory += score;
      emailReport.sacTotalScore += score;
      userReport.sacMemory.push({ question : answer });
      userReport.sacMemoryScore += score;
      console.log(`
        Parameter Matched To Immediate Memory Function
        ====> Question : ${question}
        ====> Answer : ${answer}
        ====> Score : ${score}
        -------------------------------------------------------------------------------------------
        EMAIL REPORT IMMEDIATE MEMORY SCORE ==> ${emailReport.immediateMemory}
        USER REPORT MEMORY SCORE ==> ${userReport.sacMemoryScore}
      `);
    }
  }
  if (sacConcentration[params]) {
    let question = sacConcentration[params];
    if (!filterQuestions(params)) {
      pushQuestion(params);
      let score = +concentration(params, answer);
      console.log(`
        Concentration Test Score : ${score}
      `);
      emailReport.concentration += score;
      updateSACTotalScore(score);
      userReport.sacConcentration.push({ question : answer });
      userReport.sacMemoryScore += score;
      console.log(`
        Parameter Matched To Concentration Memory Function
        ====> Question : ${question}
        ====> Answer : ${answer}
        ====> Score : ${score}
        -------------------------------------------------------------------------------------------
        EMAIL REPORT CONCENTRATION SCORE ==> ${emailReport.concentration}
        USER REPORT CONCENTRATION SCORE ==> ${userReport.sacConcentrationScore}
      `);
    }
  }
}

const printContexts = (message) => {
  const contextsArray = []
  message.map((elm) => {
    contextsArray.push({
      testName: elm.name,
    })
    if (elm.parameters) {
      for (val in elm.parameters) {
        questionAnswerScore(val, elm.parameters[val])
      }
    }
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
    // console.log(`Response Result =>|| ${printData(response.result)} ||<=`);
    if (response.result.contexts && response.result.contexts.length > 0) {
      console.log(`
        PRINT CONTEXTS FUNCTION ${printContexts(response.result.contexts)}
        `);
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
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message && event.message.text) {
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
