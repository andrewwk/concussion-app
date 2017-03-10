const showScores = (id, question, answer, score) => {
  console.log(`
    ===> Question : ${question}
    ===> Answer   : ${answer}
    ===> Score    : ${score}
    -------------------------------------------------------------------------------------------
    EMAIL REPORT NUMBER OF SYMPTOMS     ==> ${conversations[id].numberOfSymptoms}
    EMAIL REPORT SYMPTOM SEVERITY SCORE ==> ${conversations[id].symptomSeverityScore}
    USER REPORT NUMBER OF SYMPTOMS      ==> ${userReports[id].numberOfSymptoms}
    USER REPORT SYMPTOM SEVERITY SCORE  ==> ${userReports[id].symptomSeverityScore}
    -------------------------------------------------------------------------------------------
    EMAIL REPORT ORIENTATION SCORE ==> ${conversations[id].orientation}
    USER REPORT ORIENTATION SCORE  ==> ${userReports[id].sacOrientationScore}
    -------------------------------------------------------------------------------------------
    EMAIL REPORT IMMEDIATE MEMORY SCORE ==> ${conversations[id].immediateMemory}
    USER REPORT IMMEDIATE MEMORY SCORE  ==> ${userReports[id].sacMemoryScore}
    -------------------------------------------------------------------------------------------
    EMAIL REPORT CONCENTRATION SCORE ==> ${conversations[id].concentration}
    USER REPORT CONCENTRATION SCORE  ==> ${userReports[id].sacConcentrationScore}
    -------------------------------------------------------------------------------------------
    EMAIL REPORT DELAYED RECALL SCORE ==> ${conversations[id].delayedRecall}
    USER REPORT DELAYED RECALL SCORE  ==> ${userReports[id].sacDelayedRecallScore}
    -------------------------------------------------------------------------------------------
    SAC TOTAL SCORE EMAIL  : ${conversations[id].sacTotal}
    SAC TOTAL SCORE REPORT : ${userReports[id].sacTotalScore}
    `);
}

module.exports = showScores;
