const digitsQ1        = '3 9 4'
const digitsQ2        = '4 1 8 3'
const digitsQ3        = '1 7 9 2 6'
const digitsQ4        = '2 6 8 1 7'
const monthsBackwards = 'december november october september august july june may april march february january'

const assessAnswer = (params, answer) => {
  return params == answer;
}
//
// let user1 = '3 9 4'
// let user2 = '4 1 3 8'
// let params1 = digitsQ1
// let params2 = digitsQ2
// console.log(assessAnswer(params1, user1))
// console.log(assessAnswer(params2, user2))

module.exports = assessAnswer;
