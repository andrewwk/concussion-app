const correctAnswer = {
  digitsQ1        : '3 9 4',
  digitsQ2        : '4 1 8 3',
  digitsQ3        : '1 7 9 2 6',
  digitsQ4        : '2 6 4 8 1 7',
  monthsBackwards : 'december november october september august july june may april march february january'
}

const assessAnswer = (params, answer) => {
  return correctAnswer[params] == answer;
}

module.exports = assessAnswer;
