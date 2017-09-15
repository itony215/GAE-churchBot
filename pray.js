module.exports.push = function(Token) {
  const line = require("./index");
  var http = require("https");
  var options = {
    method: "GET",
    hostname: "api.imgur.com",
    port: null,
    path: "/3/album/ai158",
    headers: {
      authorization: "Client-ID 0c926e905ae8698"
    }
  };

  var req = http.request(options, function(res) {
    var chunks = [];

    res.on("data", function(chunk) {
      chunks.push(chunk);
    });

    res.on("end", function() {
      var body = Buffer.concat(chunks);
      body = JSON.parse(body);

      var linkd2 = body.data.images[body.data.images.length - 1].link;
      return line.client.replyMessage({
        replyToken: Token,
        messages: [
          {
            type: "image",
            originalContentUrl: linkd2,
            previewImageUrl: linkd2
          }
        ]
      });
    });
  });
  req.end();
};
