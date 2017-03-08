// Andrew - I put long questions into variables to make the objects cleaner
const sacMemoryQuestion1 = 'I am going to test your memory. I will show you a list of words and when I am done, return a response with as many words as you can remember, in any order.'

const sacMemoryQuestion2and3 = 'I am going to repeat the same list again. Repeat back as many words as you can remember in any order, even if you said the word before.'

const sacConcentrationQuestion = 'I am going to read you a string of numbers and when I am done, you repeat them back to me backwards, in reverse order of how I read them to you.'

const sacMonthsQuestion = 'Now tell me the months of the year in reverse order. Start with the last month and go backward. So you’ll say December, November ... Go ahead'

const delayedRecallQuestion = 'Do you remember the list of words I read a few times earlier? Tell me as many words from the list as you can remember in any order.'


const hydf = {
  headache                : 'Headache',
  pressureInHead          : 'Pressure In Head',
  neckPain                : 'Neck Pain',
  nauseaOrVomiting        : 'Nausea Or Vomiting',
  dizziness               : 'Dizziness',
  balanceProblems         : 'Balance Problems',
  blurredVision           : 'Blurrred Vision',
  sensitivityToLight      : 'Sensitivity To Light',
  sensitivityToNoise      : 'Sensitivity To Noise',
  feelingSlowedDown       : 'Feeling Slowed Down',
  feelingLikeInAFog       : 'Feeling Like In A Fog',
  dontFeelRight           : "Don't Feel Right",
  difficultyConcentrating : 'Difficulty concentrating',
  difficultyRemembering   : 'Difficulty Remembering',
  fatigueOrLowEnergy      : 'Fatigue Or Low Energy',
  confusion               : 'Confusion',
  drowsiness              : 'Drowsiness',
  troubleFallingAsleep    : 'Trouble Falling Asleep',
  moreEmotional           : 'More Emotional',
  irritability            : 'Irritability',
  sadness                 : 'Sadness',
  nervousOrAnxious        : 'Nervous Or Anxious',
  symptomsWorseMental     : 'Symptoms Worse Mental',
  symptomsWorsePhysical   : 'Symptoms Worse Physical',
}

const psocYes = {
  anyLossOfConsciousnessYes      : 'Any loss of consciousness?',
  anyLossOfConsciousnessDuration : 'How long?', // User Response = follow up answer
  lossOfMemoryYes                : 'Loss of memory?',
  lossOfMemoryDuration           : 'Approximately how long?',
  lossOfMemoryConclusion         : 'Before or after the injury?',
  facialInjuryYes                : 'Visible facial injury in combination with any of the above?'
}

const psocNo = {
  anyLossOfConsciousnessNo : 'Any loss of consciousness?',
  lossOfMemoryNo           : 'Loss of memory?',
  facialInjuryNo           : 'Visible facial injury in combination with any of the above?'

}

const sacOrientation = {
  checkMonth     : 'What month is it?',
  checkDate      : 'What is the date today?',
  checkDayOfWeek : 'What day of the week is it?',
  checkYear      : 'What year is it?',
  checkTime      : 'What hour is it right now?'
}

const sacImmediateMemory = {
  memoryRecallTrial1 : sacMemoryQuestion1,
  memoryRecallTrial2 : sacMemoryQuestion2and3,
  memoryRecallTrial3 : sacMemoryQuestion2and3
}

const sacConcentration = {
  digitsQ1        : sacConcentrationQuestion,
  digitsQ2        : sacConcentrationQuestion,
  digitsQ3        : sacConcentrationQuestion,
  digitsQ4        : sacConcentrationQuestion,
  monthsBackwards : sacMonthsQuestion
}

const sacDelayedRecall = {
  delayedRecall : delayedRecallQuestion
}

module.exports = {
  hydf               : hydf,
  psocYes            : psocYes,
  psocNo             : psocNo,
  sacOrientation     : sacOrientation,
  sacImmediateMemory : sacImmediateMemory,
  sacConcentration   : sacConcentration,
  sacDelayedRecall   : sacDelayedRecall
}
