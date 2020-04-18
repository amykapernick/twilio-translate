require('dotenv').config()

module.exports = async function (context) {
    const res = context.res,
     fetch = require('node-fetch'),
    qs = require('querystring'),
    uuidv4 = require('uuid/v4'),
    MessagingResponse = require('twilio').twiml.MessagingResponse,
    twiml = new MessagingResponse(),
    message = twiml.message(),
    phrase = qs.parse(context.req.body).Body

    const results = await fetch(`${process.env.TRANSLATE}translate?api-version=3.0&to=${process.env.LANGUAGE}`, {
        method: 'post',
        body:    JSON.stringify([{
            'text': phrase
      }]),
        headers: {
            'Ocp-Apim-Subscription-Key': process.env.API_KEY,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
          },
    }).then(response => response.json())


    message.body(results[0].translations[0].text)

    res.set('content-type', 'text/xml')
    res.end(message.toString())
};