require('dotenv').config();

const express      = require('express');
const bodyParser   = require('body-parser');
const ENV          = process.env.ENV || "development";
const PORT         = process.env.PORT || 8080
const app          = express();

// parse application/json
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', (req, res) => res.status(200).send('app connected and made get request to root.'));

// app.get('/webhook', (req, res) => res.status(200).send(''));
//
// app.post('/webhook', (req, res) => {
// })

/* For Facebook Validation */
app.get('/webhook', (req, res) => {
  console.log(req.query);
  if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'concussion-app-token') {
    return res.status(200).send(req.query['hub.challenge']);
  }
  // otherwise, not authorized
  return res.status(403).end();
});

/* Handling all messenges */
app.post('/webhook', (req, res) => {
  console.log(req.body);
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message && event.message.text) {
          sendMessage(event);
        }
      });
    });
    res.status(200).end();
  }
});

app.use((req, res) => res.status(404).send('Error 404. This path does not exist.'));

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
