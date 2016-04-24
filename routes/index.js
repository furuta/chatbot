var express = require('express'),
    request = require('request'),
    router = express.Router(),
    token = process.env.FB_PAGE_TOKEN;
    verify_token = process.env.FB_VERIFY_TOKEN;

function sendTextMessage(sender, text) {
  var messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

router.get('/', function(req, res, next) {
console.log('get start');
  if (req.query['hub.verify_token'] === verify_token) {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

router.post('/', function(req, res, next) {
console.log('post start');
  var messaging_events = req.body.entry[0].messaging,
      replayMessages = [];
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;

      // アレコレしたいことをどうぞ
      sendTextMessage(sender, text.substring(0, 200));
    }
  }
  res.sendStatus(200);
});

module.exports = router;