// Andrew - Object that holds all conversations/conversation objects
const conversations = {};
// Andrew - Function to create new conversation object.
const conversationInit = (id) => {
  conversations[id] =
    {
      conversationID       : id,
      userEmail            : '',
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
};

const userReports = {};

const userReportInit = (id) => {
  userReports[id] =
    {
      conversationID             : '',
      firstName                  : '',
      lastName                   : '',
      email                      : '',
      potentialSignsOfConcussion : [],
      howDoYouFeel               : [],
      numberOfSymptoms           : 0,
      symptomSeverityScore       : 0,
      sacOrientation             : [],
      sacOrientationScore        : 0,
      sacMemory                  : [],
      sacMemoryScore             : 0,
      sacConcentration           : [],
      sacConcentrationScore      : 0,
      sacDelayedRecall           : [],
      sacDelayedRecallScore      : 0,
      sacTotalScore              : 0
    }
}

module.exports = {
  userReports    : userReports,
  userReportInit : userReportInit,
  conversations  : conversations,
  conversationInit : conversationInit
}
