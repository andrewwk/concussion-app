// Andrew - print error and data objects
const printObject = (obj) => {
  for (data in obj) {
    console.log(`Print Object CallBack Function ==> ${data} ${obj[data]}`);
  }
}
const printData = (data) => {
  if (data.constructor === Object) {
    for (log in data) {
      // console.log(`Printing Data Object : ${log} => ${data[log]}`);
      if (log == 'parameters' || log == 'contexts' || log == 'metadata') {
        console.log(`${log} ${printObject(data[log])}`);
      }
    }
  }
  if (data.constructor === Array) {
    data.map((log) => {
      console.log(`Printing Data Array : ${log}`);
    })
  }
  if (data.constructor === String) {
    console.log(`Printing Data String : ${data}`);
  }
  if (data.constructor === Number) {
    console.log(`Printing Data Number : ${data}`);
  }
  console.log(`Data type match not found. Sheeiitttt....${data}`);
}

module.exports = printData;
