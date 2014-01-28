var exec = require('child_process').exec;
var gaze = require('gaze');
var debounce = require('lodash.debounce');

module.exports = function(pattern, cmd){
  var running = false
  var runAgain = false

  function runner() {
    if (running) {
      runAgain = true
      return
    }
    console.log('Running: '+ cmd);
    running = true
    exec(cmd, function(err, stdout, stderr){
      running = false
      if (err) {
        console.log(err);
      }
      console.log(stdout);
      console.log(stderr);
      if (runAgain) {
        runAgain = false
        runner()
      }
    });
  }

  gaze(pattern, function(err, watcher){
    if (err) {
      throw new Error(err);
    }

    var fileCount = Object.keys(this.watched()).length;

    console.log('Watching "'+ pattern +'" : ' +
                fileCount +' file'+ (fileCount > 1 ? 's' : ''));

    this.on('all', debounce(runner, 100));
  });
};

