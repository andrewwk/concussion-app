const stringArray  = ['elbow', 'apple', 'carpet', 'saddle', 'bubble'];
const bobInput     = 'elbow apple';
const aliceInput   = 'wine carpet chicken';
const deandreInput = 'cadillac saddle bubble winterberry football'

const matchStrings = (input) => {
  const inputArr = input.split(' ');
  let score = 0;
  stringArray.map((val) => {
    if (inputArr.includes(val)) {
      score += 1
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
