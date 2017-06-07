module.exports.timeSet = function (event) {
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
        if (dt2 - dt > -86400000 && dt2 - dt < 86400000 * 6) {
          break;
        }
      }
    }
    return line.client.replyMessage({
      replyToken: event.replyToken,
      messages: [
        {
          type: 'text',
          text: body.feed.entry[i].gsx$_cn6ca.$t+'服事同工\n'+body.feed.entry[i].content.$t
        }
      ]
    }) 
  }});
}
