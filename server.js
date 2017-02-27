require('dotenv').config();

const express      = require('express');
const bodyParser   = require('body-parser');
const ENV          = process.env.ENV || "development";
const PORT         = process.env.PORT || 8080
const app          = express();

// parse application/json
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))


app.get('/', (req, res) => res.status(200).send('app connected and made get request to root.'));

app.get('/webhook', (req, res) => res.status(200).send(''));

app.post('/webhook', (req, res) => {

})

app.use((req, res) => res.status(404).send('Error 404. This path does not exist.'));

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
