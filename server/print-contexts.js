const printContexts = (message) => {
  const contextsArray = []
  message.map((elm) => {
    // console.log(`Here Are The Mother Fucking Contexts`);
    contextsArray.push({
      testName: elm.name,
    })
    if (elm.parameters) {
      for (val in elm.parameters) {
        questionAnswerScore(val, elm.parameters[val])
        // User Response
        // console.log(`
        //   Here's some more shit => It's the FUCKING user answers ${elm.parameters[val]}
        //   `);
        // contextsArray.push({
        //   val : elm.parameters[val]
        // })
      }
    }
    // printData(elm)
    // console.log(`
    //   Here is the fucking contexts array : ${contextsArray}
    //   Let's try to print this fucker : ${printData(contextsArray)}
    //   `);
  })
}
