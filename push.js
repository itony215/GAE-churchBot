module.exports.push = function () {
  new Date()
  const line = require('@line/bot-sdk');
  const request = require('request')

  const client = new line.Client({
    channelAccessToken: 'c/XMmaPokDjHzMTNmPed0Mjtf3UZ8S/9+tTB08iIELrmaP5vydkuPLQVPMat1cfVV4H4dfFph4sc1S91OSOg8PWmSg1JbGIyXP7WJvZ1e2X3LJ0zCdKQsk4OS0QkCzlvVY3GqF8UOPa6hGJixR99KgdB04t89/1O/w1cDnyilFU='
  });
  const message = {
    type: 'text',
    text: '明天要聚會唷～上帝的恩典和禮物攏底家啦！千萬別錯過喔！願上帝賜福於你！'
  };

  client.pushMessage('U98eb646573a9793f8e9142078f2969df', message)
    .then(() => {
    })
    .catch((err) => {
      // error handling
    }, null, true);

}