const mongoose = require('mongoose');
mongoose.connect('mongodb://admin:password@ds129183.mlab.com:29183/follower')
var Record = mongoose.model('Record', {
  time: Number,
  userid: String,
  text: String
});
var Follower = mongoose.model('Follower', {
  time: Number,
  userid: String,
});

var log = new Follower();
      log.time = "123";
      log.userid = "325432";
      log.save();