require('dotenv').config();

const express      = require('express');
const app          = express();
const ENV          = process.env.ENV || "development";
const PORT         = process.env.PORT || 8080

app.get('/', (req, res) => res.status(200).send('1722484629'));

app.use((req, res) => res.status(404).send('Error 404. This path does not exist.'));

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
