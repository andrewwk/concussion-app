RESPONSE.result.contexts [
  { name: 'psoc-conclusion',
    parameters:
     { 'User-Answers.original': 'okay',
       'User-Answers': 'okay',
       'HDYF-headache.original': '2',
       'HDYF-headache': '2' },
    lifespan: 1 },

  { name: 'hydf-initialize',
    parameters:
     { 'User-Answers.original': 'okay',
       'User-Answers': 'okay',
       'HDYF-headache.original': '2',
       'HDYF-headache': '2' },
    lifespan: 3 },

  { name: 'hydf-1',
    parameters: { 'HDYF-headache.original': '2', 'HDYF-headache': '2' },
    lifespan: 5 } ]

    {
      "id": "4877b7fa-f4c8-4f9c-a830-4e79f298540c",
      "timestamp": "2017-03-02T23:12:27.125Z",
      "lang": "en",
      "result": {
        "source": "agent",
        "resolvedQuery": "tuesday",
        "action": "",
        "actionIncomplete": false,
        "parameters": {
          "date": "2017-03-07"
        },
        "contexts": [],
        "metadata": {
          "intentId": "ae30ca6e-8cf8-4551-9b9c-8ba7aff20285",
          "webhookUsed": "false",
          "webhookForSlotFillingUsed": "false",
          "intentName": "test month"
        },
        "fulfillment": {
          "speech": "that's fucking great",
          "messages": [
            {
              "type": 0,
              "speech": "that's fucking great"
            }
          ]
        },
        "score": 1
      },
      "status": {
        "code": 200,
        "errorType": "success"
      },
      "sessionId": "1e72b039-374a-42f6-89bb-e07b312b5bfd"
    }
