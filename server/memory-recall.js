const stringArray  = ['elbow', 'apple', 'carpet', 'saddle', 'bubble'];
const bobInput     = 'elbow apple';
const aliceInput   = 'wine carpet chicken';
const deandreInput = 'cadillac saddle bubble winterberry football'

// Andrew - Array containing the five words used to test users memory
const recallTestWords  = ['elbow', 'apple', 'carpet', 'saddle', 'bubble'];

// Andrew - Function to check how many words the user can remember. One point given for each correct
// word.
const matchStrings = (input) => {
  // const inputArr = input.split(' ');
  let score = 0;
  recallTestWords.map((val) => {
    if (input.includes(val)) {
      score += 1;
    }
  })
  return score;
}

// console.log('Bob');
// console.log(matchStrings(bobInput));
//
// console.log('Alice');
// console.log(matchStrings(aliceInput));
//
// console.log('Deandre');
// console.log(matchStrings(deandreInput));

module.exports = matchStrings;
