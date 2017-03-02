const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

// Andrew - function to validate user input for current month
// const checkMonth = (input) => {
//
//   switch (new Date().getMonth()) {
//     case 0:
//       month = 'January';
//       break;
//     case 1:
//       month = 'February';
//       break;
//     case 2:
//       month = 'March';
//       break;
//     case 3:
//       month = 'April';
//       break;
//     case 4:
//       month = 'May';
//       break;
//     case 5:
//       month = 'June';
//       break;
//     case 6:
//       month = 'July';
//       break;
//     case 7:
//       month = 'August';
//       break;
//     case 8:
//       month = 'September';
//       break;
//     case 9:
//       month = 'October';
//       break;
//     case 10:
//       month = 'November';
//       break;
//     case 11:
//       month = 'December';
//       break;
//     default:
//       break;
//   }
//   return month === input;
// }

const checkMonth = (input) => {
  const todayInt = new Date().getMonth();
  const todayStr = months[todayInt];
  return input === todayStr;
};
console.log(checkMonth('January'));
console.log(checkMonth('February'));

// Andrew - function to validate user input for current day of month (number)
const checkDate = (input) => {
  const today = new Date().getDate();
  return input === today;
};
console.log(checkDate(9));
console.log(checkDate(28));

// Andrew - function to validate user input for current day of the week (string)
const checkDayOfWeek = (input) => {
  const today = new Date().getDay();
  const weekday = days[today];
  return input === weekday;
};
console.log(checkDayOfWeek('Sunday'));
console.log(checkDayOfWeek('Tuesday'));

// Andrew - function to validate user input for the current year
const checkYear = (input) => {
  const today = new Date().getFullYear();
  return input === today;
}
console.log(checkYear(2016));
console.log(checkYear(2017));

// Andrew - function to validate user input for the current hour with a one hour threshold

const checkTime = (input) => {
  // 12 hour time
  const currentHour = (new Date().getHours()) % 12
  return currentHour - input <= 1
}

console.log(checkTime(4));
console.log(checkTime(6));
