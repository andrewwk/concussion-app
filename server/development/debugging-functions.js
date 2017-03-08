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
