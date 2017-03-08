require('dotenv').config();

const PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
const APIAI_TOKEN       = process.env.APIAI_TOKEN;
const APP_VERIFY_TOKEN  = process.env.APP_VERIFY_TOKEN;
const ENV               = process.env.ENV  || 'development';
const PORT              = process.env.PORT || 8080;
const api_key           = process.env.MAILGUN_API_KEY;
const domain            = process.env.DOMAIN;
const express           = require('express');
const bodyParser        = require('body-parser');
const request           = require('request');
const apiai             = require('apiai');
const app               = express();
const apiaiApp          = apiai(APIAI_TOKEN);
const orientation       = require('./orientation'); // Functions for Orientation Tests
const questions         = require('./dictionary'); // Object containing HYDF Questions
const mailgun           = require('mailgun-js')({apiKey: api_key, domain: domain});


const data = {
  from: 'Dylan Toyne <dylantoyne@gmail.com>',
  to: 'dylantoyne@gmail.com',
  subject: 'Test Email',
  html: '<html lang="en">' +

'<head>' +
'<meta name="viewport" content="width=device-width" />' +
'<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />' +
'<title> SCAT3 Results</title>' +
'<style type="text/css">' +
/* -------------------------------------
    Global:
    A very basic CSS reset
------------------------------------- */

'* {' +
  'margin: 0;' +
  'font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;' +
  'box-sizing: border-box;' +
  'font-size: 14px;' +
'}' +

'img {' +
  'max-width: 35%;' +
'}' +

'body {' +
  '-webkit-font-smoothing: antialiased;' +
  '-webkit-text-size-adjust: none;' +
  'width: 100% !important;' +
  'height: 100%;' +
  'line-height: 1.6em;' +
'}' +

'table td {' +
  'vertical-align: top;' +
'}' +

/* -------------------------------------
    Body & Container:
------------------------------------- */

'body {' +
  'background-color: #7b7b7b;' +
'}' +

'.body-wrap {' +
  'background-color: #7b7b7b;' +
  'width: 100%;' +
'}' +

'.container {' +
  'display: block !important;' +
  'max-width: 600px !important;' +
  'margin: 0 auto !important;' +
  /* makes it centered */
  'clear: both !important;' +
'}' +

'.content {' +
  'max-width: 600px;' +
  'margin: 0 auto;' +
  'display: block;' +
  'padding: 20px;' +
'}' +

/* -------------------------------------
    Header & Main:
------------------------------------- */

'.main {' +
  'background-color: #e5e5e5;' +
  'border: 1px solid #e9e9e9;' +
  'border-radius: 3px;' +
'}' +

'.content-wrap {' +
  'padding: 20px;' +
'}' +

'.content-block {' +
  'padding: 0 0 20px;' +
'}' +

'.header {' +
  'width: 100%;' +
  'margin-bottom: 20px;' +
'}' +

/* -------------------------------------
    Typography:
------------------------------------- */

'h1, h2, h3 {' +
  'font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;' +
  'color: #0f45d9;' +
  'margin: 40px 0 0;' +
  'line-height: 1.2em;' +
  'font-weight: 400;' +
'}' +

'h1 {' +
  'font-size: 32px;' +
  'font-weight: 500;' +
'}' +

'h2 {' +
  'font-size: 24px;' +
'}' +

'h3 {' +
  'font-size: 18px;' +
'}' +

'h4 {' +
  'font-size: 14px;' +
  'font-weight: 600;' +
'}' +

'p, ul, ol {' +
  'margin-bottom: 10px;' +
  'font-weight: normal;' +
'}' +

'p li, ul li, ol li {' +
  'margin-left: 5px;' +
  'list-style-position: inside;' +
'}' +

/* -------------------------------------
    Email Button:
------------------------------------- */

'a {' +
  'color: #348eda;' +
  'text-decoration: underline;' +
'}' +

'.btn-primary {' +
  'text-decoration: none;' +
  'color: #FFF;' +
  'background-color: #348eda;' +
  'border: solid #348eda;' +
  'border-width: 10px 20px;' +
  'line-height: 2em;' +
  'font-weight: bold;' +
  'text-align: center;' +
  'cursor: pointer;' +
  'display: inline-block;' +
  'border-radius: 5px;' +
  'text-transform: capitalize;' +
'}' +

/* -------------------------------------
    Styles:
------------------------------------- */

'.last {' +
  'margin-bottom: 0;' +
'}' +

'.first {' +
  'margin-top: 0;' +
'}' +

'.aligncenter {' +
  'text-align: center;' +
'}' +

'.alignright {' +
  'text-align: right;' +
'}' +

'.alignleft {' +
  'text-align: left;' +
'}' +

'.clear {' +
  'clear: both;' +
'}' +

/* -------------------------------------
    Styles for the Results Table:
------------------------------------- */

'.results {' +
  'margin: 40px auto;' +
  'text-align: center;' +
  'width: 80%;' +
'}' +
'.results td {' +
  'padding: 10px 0;' +
'}' +
'.results .results-items {' +
  'width: 100%;' +
'}' +
'.results .results-items td {' +
  'border-top: #eee 1px solid;' +
  'padding-bottom: 20px;' +
  'padding-top: 20px;' +
'}' +
'.results .results-items .sendOff td {' +
  'margin-top: auto;' +
  'border-top: 2px solid #333;' +
  'border-bottom: 2px solid #333;' +
  'font-weight: 700;' +
'}' +

/* -------------------------------------
    RESPONSIVE AND MOBILE FRIENDLY STYLES
------------------------------------- */

'@media only screen and (max-width: 640px) {' +
  'body {' +
    'padding: 0 !important;' +
  '}' +

  'h1, h2, h3, h4 {' +
    'font-weight: 800 !important;' +
    'margin: 20px 0 5px !important;' +
  '}' +

  'h1 {' +
    'font-size: 22px !important;' +
  '}' +

  'h2 {' +
    'font-size: 18px !important;' +
  '}' +

  'h3 {' +
    'font-size: 16px !important;' +
  '}' +

  '.container {' +
    'padding: 0 !important;' +
    'width: 100% !important;' +
  '}' +

  '.content {' +
    'padding: 0 !important;' +
  '}' +

  '.content-wrap {' +
    'padding: 10px !important;' +
  '}' +

  '.results {' +
    'width: 100% !important;' +
  '}' +
'}' +
'</style>' +
'</head>' +

'<body>' +

'<table class="body-wrap">' +
  '<tr>' +
  	'<td> </td>' +
  	'<td class="container" width="600">' +
  		'<div class="content">' +
  			'<table class="main" width="100%" cellpadding="0" cellspacing="0">' +
  				'<tr>' +
  					'<td class="content-wrap aligncenter">' +
  						'<table width="100%" cellpadding="0" cellspacing="0">' +
  							'<tr>' +
  								'<td class="content-block">' +
  									'<h2 class="aligncenter"> SCAT3™ Results</h2>' +
  								'</td>' +
  							'</tr>' +
  							'<tr>' +
  								'<td class="content-block">' +
  									'<h3 class="aligncenter">' +
                    '<img src="http://sunnybrook.ca/uploads/1/programs/brain-sciences/concussion/head-icon.png">' +
                    '</h3>' +
  								'</td>' +
  							'</tr>' +
  							'<tr>' +
  								'<td class="content-block aligncenter">' +
  									'<table class="results">' +
  										'<tr>' +
  											'<td> <strong> userReport.firstname + userReport.lastName <br> Assessment #12345<!-- Id --> <br> March 3, 2017 <!-- Data --> </strong> </td>' +
  										'</tr>' +
  										'<tr>' +
  											'<td>' +
  												'<table class="results-items" cellpadding="0" cellspacing="0">' +
  													'<tr>' +
  														'<td class="alignright"> <strong> Scoring Summary:</td>' +
                                '<table class="results-items" cellpadding="0" cellspacing="0">' +
                                    '<tr> Number of Symptoms of 22:' ${userReport.numberOfSymptoms} '</tr> <br>' +
                                    '<tr> Symptom Severity Score of 132:' ${userReport.symptomSeverityScore} '</tr> <br>' +
                                    '<tr> Orientation of 5:' ${userReport.sacOrientationScore} '</tr> <br>' +
                                    '<tr> Immediate Memory of 15:' ${userReport.sacMemoryScore} '</tr> <br>' +
                                    '<tr> Concentration of 5:' ${userReport.sacConcentrationScore} '</tr> <br>' +
                                    '<tr> Delayed Recall of 5:' ${userReport.sacDelayedRecallScore} '</tr> <br> <br>' +
                                    '<tr> <strong> SAC Total:' ${userReport.sacTotalScore} '</tr> <br> <br> <br>' +
                                '</table>' +
                              '</td>' +
  													'</tr>' +
  													'<tr class="sendOff">' +
  														'<td class="aligncenter" width="100%"> <strong> Thanks For Taking Care Of Yourself!</td>' +
  													'</tr>' +
  												'</table>' +
  											'</td>' +
  										'</tr>' +
  									'</table>' +
                    '<table width="100%">' +
            					'<tr>' +
            						'<td class="aligncenter content-block"> <strong> Questions?<br> <br> <a href="mailto:"> concussionapp@example.com</a> </strong> </td>' +
            					'</tr>' +
            				'</table>' +
  								'</td>' +
  							'</tr>' +
  						'</table>' +
  					'</td>' +
  				'</tr>' +
  			'</table>' +
  		'</td>' +
  	'</tr>' +
  '</table>' +

  '</body>' +
  '</html>'
};

mailgun.messages().send(data, function (error, body) {
  console.log(body);
});

// Signs to watch for:

// Have a headache that gets worse
// Are very drowsy or can't be awakened
// Can't recognize people or places
// Have repeated vomiting
// Behave unusually or seem confused; are very irritable
// Have seizures (arms and legs jerk uncontrollably)
// Have weak or numb arms of legs
// Are unsteady on their feet; have slurred speech

module.exports = emailFire;
