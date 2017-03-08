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
const MongoClient        = require('mongodb').MongoClient;
const MONGODB_URI        = process.env.MONGODB_URI;
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
const dbReport           = require('./user-report');  //User Report Object going into DB.
const userReports        = dbReport.userReports;
const userReportInit     = dbReport.userReportInit;
const concentration      = require('./concentration');

// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// Andrew - Email Report Object. Different from object going into DB.
// Andrew - Object that holds all conversations/conversation objects
const conversations = {};
// Andrew - Function to create new conversation object.
const conversationInit = (id) => {
  conversations[id] =
    {
      conversationID       : id,
      testDate             : new Date(),
      numberOfSymptoms     : 0, //  Out of 22
      symptomSeverityScore : 0, // Out of 132
      orientation          : 0, //  Out of 5
      immediateMemory      : 0, // Out of 15
      concentration        : 0, // Out of 5
      delayedRecall        : 0, // Out of 5
      sacTotal             : 0, // Sum Scores
      answeredQuestions    : []
    }
}

const filterQuestions = (question, id) => {
  return conversations[id].answeredQuestions.includes(question)
}
const pushQuestion = (question, id) => {
  if (!filterQuestions(question, id)) {
    conversations[id].answeredQuestions.push(question)
  }
}
const updateSACTotalScore = (score, id) => {
  if (score > 0) {
    conversations[id].sacTotal += score;
    userReports[id].sacTotalScore += score;
  }
}
const updateHYDFScores = (score, id) => {
  if (score > 0 && score.constructor === Number) {
    conversations[id].numberOfSymptoms += 1
    conversations[id].symptomSeverityScore += score
  }
}
const printQandA = (question, answer) => {
  console.log(`
    Parameter Matched to Question : ${question}
    User Answer : ${answer}
    `);
};

const showTotalScores = (id) => {
  console.log(`
    SAC TOTAL SCORE EMAIL : ${conversations[id].sacTotal}
    SAC TOTAL SCORE REPORT : ${userReports[id].sacTotalScore}
    `);
};

const clearQuestionsArray = () => {
  answeredQuestions.length = 0;
  console.log(`Array Cleared : Length = ${answeredQuestions.length}`);
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
// Andrew - Function to parse user response and parameters. Then matches them to certain portions
// of the test.
const questionAnswerScore = (params, userResponse, conversationID) => {
  let answer = userResponse;
  let id     = conversationID;

  if (hydf[params]) {
    let question = hydf[params];
    let score    = parseInt(answer);
    if (!filterQuestions(params, id) && !isNaN(score)) {
      pushQuestion(params, id);
      userReports[id].howDoYouFeel.push({ question : answer });
      updateHYDFScores(score, id);
      updateSACTotalScore(score, id);
      console.log(`HYDF Matched
        ===> Question                       : ${question}
        ===> Answer                         : ${answer}
        ===> Score                          : ${score}
        -------------------------------------------------------------------------------------------
        EMAIL REPORT NUMBER OF SYMPTOMS ==> ${conversations[id].numberOfSymptoms}
        EMAIL REPORT SYMPTOM SEVERITY SCORE ==> ${conversations[id].symptomSeverityScore}
      `);
      showTotalScores(id);
    } else if (!filterQuestions(params, id) && isNaN(score)) {
      pushQuestion(params, id);
      userReports[id].howDoYouFeel.push({ question : answer });
    }
  }
  if (orientation[params]) {
    const orientationFunction = orientation[params];
    let question = sacOrientation[params];
    let result = orientationFunction(answer);
    let score = +result;

    if (!filterQuestions(params, id) && !isNaN(score)) {
      pushQuestion(params, id);
      userReports[id].sacOrientation.push({ question : result });

      conversations[id].orientation += score;
      userReports[id].sacOrientationScore += score;
      updateSACTotalScore(score, id);
      console.log(`
        Parameter Matched to Orientation Function
        ===> Question                       : ${question}
        ===> Answer                         : ${answer}
        ===> Unary Operator Converted Score : ${score}
        -------------------------------------------------------------------------------------------
        EMAIL REPORT ORIENTATION SCORE ==> ${conversations[id].orientation}
        USER REPORT ORIENTATION SCORE ==> ${userReports[id].sacOrientationScore}
      `);
      showTotalScores(id);
    }
  }
  if (sacImmediateMemory[params]) {
    let question = sacImmediateMemory[params];
    let score = memoryRecall(answer);

    if (!filterQuestions(params, id) && !isNaN(score)) {
      pushQuestion(params, id);
      userReports[id].sacMemory.push({ question : answer });

      updateSACTotalScore(score, id);
      conversations[id].immediateMemory += score;
      userReports[id].sacMemoryScore    += score;
      userReports[id].sacTotalScore     += score;
      console.log(`
        Parameter Matched To Immediate Memory Function
        ====> Question : ${question}
        ====> Answer : ${answer}
        ====> Score : ${score}
        -------------------------------------------------------------------------------------------
        EMAIL REPORT IMMEDIATE MEMORY SCORE ==> ${conversations[id].immediateMemory}
        USER REPORT MEMORY SCORE ==> ${userReports[id].sacMemoryScore}
      `);
      showTotalScores(id);
    }
  }
  if (sacConcentration[params]) {
    let question = sacConcentration[params];
    let score    = +concentration(params, answer);

    if (!filterQuestions(params, id) && !isNaN(score)) {
      pushQuestion(params, id);
      userReports[id].sacConcentration.push({ question : answer });

      updateSACTotalScore(score, id);
      conversations[id].concentration  += score;
      userReports[id].sacConcentrationScore += score;
      userReports[id].sacTotalScore         += score;
      console.log(`
        Parameter Matched To Concentration Memory Function
        ====> Question : ${question}
        ====> Answer   : ${answer}
        ====> Score    : ${score}
        -------------------------------------------------------------------------------------------
        EMAIL REPORT CONCENTRATION SCORE ==> ${conversations[id].concentration}
        USER REPORT CONCENTRATION SCORE ==> ${userReports[id].sacConcentrationScore}
      `);
      showTotalScores(id);
    }
  }
  if (sacDelayedRecall[params]) {
    let question = sacDelayedRecall[params];
    let score = memoryRecall(answer);

    if (!filterQuestions(params, id) && !isNaN(score)) {
      pushQuestion(params, id);
      userReports[id].sacDelayedRecall.push({ question : answer });

      updateSACTotalScore(score, id);
      conversations[id].delayedRecall += score;
      userReports[id].sacDelayedRecallScore += score;
      userReports[id].sacTotalScore += score;
      console.log(`
        Parameter Matched To Concentration Memory Function
        ====> Question : ${question}
        ====> Answer : ${answer}
        ====> Score : ${score}
        -------------------------------------------------------------------------------------------
        EMAIL REPORT DELAYED RECALL SCORE ==> ${conversations[id].delayedRecall}
        USER REPORT DELAYED RECALL SCORE ==> ${userReports[id].sacDelayedRecallScore}
      `)
      showTotalScores(id);
    }
  }
  // if (params == 'userEmailOptIn') {
    // push user email to user report object
    // trigger email function call
    // insert either one or both reports into db
  // }

}
const contextsEvaluation = (message, conversationID) => {
  message.map((elm) => {
    if (elm.parameters) {
      for (val in elm.parameters) {
        questionAnswerScore(val, elm.parameters[val], conversationID)
      }
    }
  })
}
const sendMessage = (event) => {
  const message              = { id: event.sender.id, message: event.message.text}
  const userMessage          = event.message.text;
  let senderID;
  if (event.sender.id != 274664636304054) {
    senderID = event.sender.id;
  }
  userReports.conversationID  = senderID;
  if (!conversations[senderID]) {
    conversationInit(senderID);
  }
  if (!userReports[senderID]) {
    userReportInit(senderID);
  }
  const apiai = apiaiApp.textRequest(userMessage, {
    sessionId: 'doctor_concussion'
  });
  apiai.on('response', (response) => {
    if (response.result.contexts && response.result.contexts.length > 0 && senderID) {
      contextsEvaluation(response.result.contexts, senderID);
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
      } else if (response.body.error && response.body.error.code !== 100) {
        console.log(`Response Body Errors: ${printData(response.body.error)}`);
        // console.log(`Response Body Error`);
      }
    });
  });
  apiai.on('error', (error) => {
    console.log(`APIAI.ON ERROR ${error}`);
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
          sendMessage(event);
        }
      });
    });
    res.status(200).end();
  }
});

app.use((req, res) => res.status(404).send(`Error 404. This path does not exist.`));

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
