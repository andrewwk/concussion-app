const days = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
];

const months = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december'
];

// == (no type check) is used in cases were a number comparison is used.
// All incoming data is a string.

// Andrew - function to validate current month (string)
const checkMonth = (input) => {
  const todayInt = new Date().getMonth();
  const todayStr = months[todayInt];
  return input.toLowerCase() === todayStr;
};

// Andrew - function to validate user input for current day of month (number)
const checkDate = (input) => {
  // TODO: refactor date below
  const today = new Date().getDate();
  return input == today;
};

// Andrew - function to validate user input for current day of the week (string)
const checkDayOfWeek = (input) => {
  const today = new Date().getDay();
  const weekday = days[today];
  return input.toLowerCase() === weekday;
};

// Andrew - function to validate user input for the current year (number)
const checkYear = (input) => {
  const today = new Date().getFullYear();
  return input == today;
}

// Andrew - function to validate user input for the current hour with a one hour threshold
const checkTime = (input) => {
  const currentHour = (new Date().getHours()) % 12
  return currentHour - input <= 1
}

// const monthCheck = (input) => {
//   return months.includes(input)
// }

module.exports = {
  checkMonth     : checkMonth,
  checkDate      : checkDate,
  checkDayOfWeek : checkDayOfWeek,
  checkYear      : checkYear,
  checkTime      : checkTime
}
