require('dotenv').config();

const api_key           = process.env.MAILGUN_API_KEY;
const domain            = process.env.MAILGUN_DOMAIN;
const dbReport          = require('./user-report');  //User Report Object going into DB.
const conversations     = dbReport.conversations;
const conversationInit  = dbReport.conversationInit;
const mailgun           = require('mailgun-js')({apiKey: api_key, domain: domain});


const data = (id, email) => {
  return (
  {
    from: `Cerebrum <concussionassessmentapp@gmail.com>`,
    to: `${email}`,
    subject: `Cerebrum Assessment`,
    html: `<html lang="en">

    <head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title> SCAT3 Results</title>
    <style type="text/css">
    /* -------------------------------------
        Global:
        A very basic CSS reset
    ------------------------------------- */

    * {
      margin: 0;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      box-sizing: border-box;
      font-size: 14px;
    }

    img {
      max-width: 35%;
    }

    body {
      -webkit-font-smoothing: antialiased;
      -webkit-text-size-adjust: none;
      width: 100% !important;
      height: 100%;
      line-height: 1.6em;
    }

    table td {
      vertical-align: top;
    }

    /* -------------------------------------
        Body & Container:
    ------------------------------------- */

    body {
      background-color: #7b7b7b;
    }

    .body-wrap {
      background-color: #7b7b7b;
      width: 100%;
    }

    .container {
      display: block !important;
      max-width: 600px !important;
      margin: 0 auto !important;
      /* makes it centered */
      clear: both !important;
    }

    .content {
      max-width: 600px;
      margin: 0 auto;
      display: block;
      padding: 20px;
    }

    /* -------------------------------------
        Header & Main:
    ------------------------------------- */

    .main {
      background-color: #e5e5e5;
      border: 1px solid #e9e9e9;
      border-radius: 3px;
    }

    .content-wrap {
      padding: 20px;
    }

    .content-block {
      padding: 0 0 20px;
    }

    .header {
      width: 100%;
      margin-bottom: 20px;
    }

    /* -------------------------------------
        Typography:
    ------------------------------------- */

    h1, h2, h3 {
      font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
      color: #0f45d9;
      margin: 40px 0 0;
      line-height: 1.2em;
      font-weight: 400;
    }

    h1 {
      font-size: 32px;
      font-weight: 500;
    }

    h2 {
      font-size: 24px;
    }

    h3 {
      font-size: 18px;
    }

    h4 {
      font-size: 14px;
      font-weight: 600;
    }

    p, ul, ol {
      margin-bottom: 10px;
      font-weight: normal;
    }

    p li, ul li, ol li {
      margin-left: 5px;
      list-style-position: inside;
    }

    /* -------------------------------------
        Email Button:
    ------------------------------------- */

    a {
      color: #348eda;
      text-decoration: underline;
    }

    .btn-primary {
      text-decoration: none;
      color: #FFF;
      background-color: #348eda;
      border: solid #348eda;
      border-width: 10px 20px;
      line-height: 2em;
      font-weight: bold;
      text-align: center;
      cursor: pointer;
      display: inline-block;
      border-radius: 5px;
      text-transform: capitalize;
    }

    /* -------------------------------------
        Styles:
    ------------------------------------- */

    .last {
      margin-bottom: 0;
    }

    .first {
      margin-top: 0;
    }

    .aligncenter {
      text-align: center;
    }

    .alignright {
      text-align: right;
    }

    .alignleft {
      text-align: left;
    }

    .clear {
      clear: both;
    }

    /* -------------------------------------
        Styles for the Results Table:
    ------------------------------------- */

    .results {
      margin: 40px auto;
      text-align: center;
      width: 80%;
    }
    .results td {
      padding: 10px 0;
    }
    .results .results-items {
      width: 100%;
    }
    .results .results-items td {
      border-top: #eee 1px solid;
      padding-bottom: 20px;
      padding-top: 20px;
    }
    .results .results-items .sendOff td {
      margin-top: auto;
      border-top: 2px solid #333;
      border-bottom: 2px solid #333;
      font-weight: 700;
    }

    /* -------------------------------------
        RESPONSIVE AND MOBILE FRIENDLY STYLES
    ------------------------------------- */

    @media only screen and (max-width: 640px) {
      body {
        padding: 0 !important;
      }

      h1, h2, h3, h4 {
        font-weight: 800 !important;
        margin: 20px 0 5px !important;
      }

      h1 {
        font-size: 22px !important;
      }

      h2 {
        font-size: 18px !important;
      }

      h3 {
        font-size: 16px !important;
      }

      .container {
        padding: 0 !important;
        width: 100% !important;
      }

      .content {
        padding: 0 !important;
      }

      .content-wrap {
        padding: 10px !important;
      }

      .results {
        width: 100% !important;
      }
    }
    </style>
    </head>

    <body>

    <table class="body-wrap">
      <tr>
      	<td> </td>
      	<td class="container" width="600">
      		<div class="content">
      			<table class="main" width="100%" cellpadding="0" cellspacing="0">
      				<tr>
      					<td class="content-wrap aligncenter">
      						<table width="100%" cellpadding="0" cellspacing="0">
      							<tr>
      								<td class="content-block">
      									<h2 class="aligncenter"> SCAT3™ Results</h2>
      								</td>
      							</tr>
      							<tr>
      								<td class="content-block">
      									<h3 class="aligncenter">
                        <img src="http://sunnybrook.ca/uploads/1/programs/brain-sciences/concussion/head-icon.png">
                        </h3>
      								</td>
      							</tr>
      							<tr>
      								<td class="content-block aligncenter">
      									<table class="results">
      										<tr>
      											<td> <strong> Dylan Toyne <br> Assessment #${id}<!-- Id --> <br> ${conversations[id].testDate} <!-- Data --> </strong> </td>
      										</tr>
      										<tr>
      											<td>
      												<table class="results-items" cellpadding="0" cellspacing="0">
      													<tr>
      														<td class="aligncenter"> <strong> Scoring Summary:</td>
                                    <table class="results-items" cellpadding="0" cellspacing="0">
                                        <tr> Number of Symptoms of 22: ${conversations[id].numberOfSymptoms} </tr> <br>
                                        <tr> Symptom Severity Score of 132: ${conversations[id].symptomSeverityScore} </tr> <br>
                                        <tr> Orientation Score of 5: ${conversations[id].orientation} </tr> <br>
                                        <tr> Immediate Memory Score of 15: ${conversations[id].immediateMemory} </tr> <br>
                                        <tr> Concentration Score of 5: ${conversations[id].concentration} </tr> <br>
                                        <tr> Delayed Recall Score of 5: ${conversations[id].delayedRecall} </tr> <br> <br>
                                        <tr> <strong> SAC Total: ${conversations[id].sacTotal} </tr> <br> <br> <br>
                                    </table>
                                  </td>
      													</tr>
      													<tr class="sendOff">
      														<td class="aligncenter" width="100%"> <strong> Thanks For Taking Care Of Yourself!</td>
      													</tr>
      												</table>
      											</td>
      										</tr>
      									</table>
                        <table width="100%">
                					<tr>
                						<td class="aligncenter content-block"> <strong> Questions?<br> <br> <a href="mailto:"> concussionassessmentapp@gmail.com </a> </strong> </td>
                					</tr>
                				</table>
      								</td>
      							</tr>
      						</table>
      					</td>
      				</tr>
      			</table>
      		</td>
      	</tr>
      </table>

      </body>
      </html>`
  }
)
};
const sendMail = (id, email) => {
  mailgun.messages().send(data(id, email), (error, body) => {
    if(error) {
      console.log(error)
    }
    console.log(`Sending the email to ${email}. Email content: ${body}`);
  });
}


// module.exports = {
//   data : data,
//   sendMail : sendMail
// }
module.exports = sendMail;
