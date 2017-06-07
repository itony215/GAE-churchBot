const data = require('./data');
const line = require('./index')
const push = require('./push.js')
const remind = require('./remind.js')
const giveweekly = require('./giveweekly.js')
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
//const mongoose = require('mongoose');
const API_URL = `https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/46d04fde-70a3-4507-aec8-98869e189ea0?subscription-key=727cb238c1244bc4b2abf5a0a378553c&timezoneOffset=0&verbose=true&q=`

/*var Record = mongoose.model('Record', {
  time: Number,
  userid: String,
  text: String
});
var Follower = mongoose.model('Follower', {
  time: Number,
  userid: String,
});
*/
app.use(bodyParser.json({
  verify (req, res, buf) {
    req.rawBody = buf
  }
}))
app.get('/push', (req, res) => {
  res.status(200).send('提醒成功!');
  //push.push();
});

line.init({
  accessToken: 'c/XMmaPokDjHzMTNmPed0Mjtf3UZ8S/9+tTB08iIELrmaP5vydkuPLQVPMat1cfVV4H4dfFph4sc1S91OSOg8PWmSg1JbGIyXP7WJvZ1e2X3LJ0zCdKQsk4OS0QkCzlvVY3GqF8UOPa6hGJixR99KgdB04t89/1O/w1cDnyilFU=',

  channelSecret: '22fc220ce651793e6b4a546b028a230a'
})

app.post('/webhook/', line.validator.validateSignature(), (req, res, next) => {

  const promises = req.body.events.map(event => {

    if (event.type != 'message'){
     /* mongoose.connect('mongodb://admin:password@35.185.176.117:27017');
      var log = new Follower();
      log.time = event.timestamp;
      log.userid = event.source.userId;
      log.save();
      mongoose.connection.close();*/
    }else if (event.message.type === 'text') {
     /* mongoose.connect('mongodb://admin:password@35.185.176.117:27017');
      var log = new Record();
      log.time = event.timestamp;
      log.userid = event.source.userId;
      log.text = event.message.text;
      log.save();
      mongoose.connection.close();*/

      if (event.message.text === '週報') {
        giveweekly.push(event);
      } 
      else if (event.message.text === '上週週報') {
        giveweekly.pushlast(event);
      }
      else if (event.message.text === '服事') {
       remind.timeSet(event);
      }
      else if (event.message.text === '講道') {
        return line.client
          .replyMessage({
            replyToken: event.replyToken,
            messages: [
              {
                type: 'text',
                text: '講道信息放在雲端硬碟\nhttps://drive.google.com/open?id=0B1ZfNOPlu1qsanFuZWRJZ0dNSlU'
              }
            ]
          })
      }
      else {
        
        const queryUrl = `${API_URL}${encodeURIComponent(event.message.text)}`;

        request({ uri: queryUrl, encoding: null, }, function (error, response, body) {
          if (response.statusCode === 200) {
            body = JSON.parse(body);
            const { intent } = body.topScoringIntent;
            if (intent === 'None') {
              return line.client
                .replyMessage({
                  replyToken: event.replyToken,
                  messages: [
                    {
                      type: 'text',
                      text: '你好, 我是施恩堂小幫手，還再學習怎麼跟人類對話，可以和我聊天。\n\n輸入『週報』本週週報\n輸入『上週週報』上週週報\n輸入『講道』講道影音\n輸入『服事』主日服事同工'
                    }
                  ]
                })
            
            } else {
              if (event.message.text) {
                let isMatch = false;
                Object.keys(data.DATA).forEach((prop) => {
                  if (isMatch) {
                    return;
                  }
                  isMatch = event.message.text.indexOf(prop) >= 0;
                  if (isMatch) {
                    matchProp = prop;
                  } else {
                    matchProp = '恩典';
                  }
                })
  
                const randItems = {};
                const randSet = data.DATA[matchProp];
                const randKeys = Object.keys(randSet);
                const randStart = parseInt((Math.random() * randKeys.length));
                const itemKey = randKeys[randStart];
                const title = randSet[itemKey].title;
                randItems[title] = randSet[itemKey];
              return line.client
                .replyMessage({
                  replyToken: event.replyToken,
                  messages: [
                    {
                      "type": "template",
                      "altText": "電腦版看不到",
                      "template": {
                        "type": "buttons",
                        "thumbnailImageUrl": randItems[title].image_url,
                        "title": "我能理解您的心情，推薦這首歌給您",
                        "text": randItems[title].title,
                        "actions": [

                          {
                            "type": "uri",
                            "label": "聽歌",
                            "uri": randItems[title].item_url
                          }
                        ]
                      }
                    }
      
                     ,{
                      type: 'text',
                      text: '喜樂的心乃是良藥，憂傷的靈使骨枯乾。(箴言17:22)'
                    }
                  ]
                })
                
              }
            }
          } else {
            console.log('oops');
            return line.client
              .replyMessage({
                replyToken: event.replyToken,
                messages: [
                  {
                    type: 'text',
                    text: '輸入『週報(傳送)』本週週報\n輸入『上週週報(傳送)』上週週報\n輸入『講道(傳送)』講道影音\n輸入『服事』主日服事同工'
                  }
                ]
              })
          }
          
        });
        
      }
         
    }
 else {
      console.log('other');
    }
  })
  Promise
    .all(promises)
    .then(() => res.json({success: true}))
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Example app listening on port 3000!')
})
