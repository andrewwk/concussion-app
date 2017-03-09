
exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('assessments').del()
    .then(() => {
      // Inserts seed entries
      return knex('assessments').insert([
        {
          conversation_id: 12345,
          assessment     :     {
                conversationID       : 12345,
                userEmail            : 'awkim.11@gmail.com',
                testDate             : new Date(),
                numberOfSymptoms     : 5,
                symptomSeverityScore : 5,
                orientation          : 5,
                immediateMemory      : 5,
                concentration        : 5,
                delayedRecall        : 5,
                sacTotal             : 100,
                answeredQuestions    : ['q1', 'q2', 'q3']
              }
        },
      ]);
    });
};
