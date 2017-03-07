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

module.exports = matchStrings;
