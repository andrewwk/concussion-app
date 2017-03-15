require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const MONGODB_URI = process.env.MONGODB_URI;

let mongoDBConnection;

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI} || error ${err}`);
    throw err;
  }
  console.log(`Datebase connection successful: ${db}`);
  mongoDBConnection = db;
});

// Function to find search MongoDB for assessments
const fetchDiagnosisById = () => {
  return new Promise((resolve, reject) => {
    mongoDBConnection
      .collection('assessments')
      .find()
      .toArray((err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      })
  })
}
// Function to save diagnosis to MongoDB collection 'assessments'
const saveDiagnosis = (diagnosis) => {
  return new Promise((resolve, reject) => {
    mongoDBConnection
      .collection('assessments')
      .insert(diagnosis, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result)
      })
  })
}

module.exports = {
  fetchDiagnosisById : fetchDiagnosisById,
  saveDiagnosis      : saveDiagnosis
}
