module.exports.timeSet = function (Token) {
  const line = require('./index')
var dt = new Date();
var dt2 = new Date();
const request = require('request')

request({
  url: "https://spreadsheets.google.com/feeds/list/1H6TP_OK7XNxS6D8xQyDErlP1ZSa_0lFMEbrxNA1mCvE/1/public/values?alt=json",
  method: "GET"
}, function (error, response, body) {
  if (error || !body) {
    return;
  } else {
    body = JSON.parse(body);
    var i;
    const totalWeek = body.feed.openSearch$totalResults.$t
    for(i=0;i<totalWeek;i++){
      if (error || !body.feed.entry[i].gsx$_cn6ca){
        return;
      }else{
        let value = body.feed.entry[i].gsx$_cn6ca.$t;
        dt2 = Date.parse(value);
        if (dt2 - dt > -43200000 && dt2 - dt < 561600000) {
          //561600000 is 86400000 * 6 +43200000
          break;
        }
      }
    }
    return line.client.replyMessage({
      replyToken: Token,
      messages: [
        {
          type: 'text',
          text: body.feed.entry[i].gsx$_cn6ca.$t+'服事同工\n'+body.feed.entry[i].content.$t
        }
      ]
    }) 
  }});
}
