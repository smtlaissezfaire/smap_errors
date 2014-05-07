var _ = require('underscore');
var async = require('async');
var sourceMap = require('source-map');
var program = require('commander');
var request = require('request');
var urlMod = require('url');
var sprintf = require('sprintf').sprintf;

var urlCache = {};
var sourceMapCache = {};

exports.main = function() {
  var self = this;

  program
    .version('0.0.1')
    .option('-u, --url [url]', 'url')
    .parse(process.argv);

  self.readStdin(function(err, stdin) {
    if (err) {
      throw err;
    }

    program.stack_trace = stdin;
    self.run(program);
  });
};

exports.readStdin = function(cb) {
  var stdin = "";

  process.stdin.setEncoding('utf8');

  process.stdin.on('readable', function() {
    stdin += process.stdin.read();
  });

  process.stdin.on('end', function() {
    return cb(null, stdin);
  });
};

exports.getUrl = function(url, cb) {
  if (urlCache[url]) {
    return cb(null, urlCache[url]);
  }

  var options = {
    url: url,
    strictSSL: false
  };

  console.log('Fetching url:', url);

  request(options, function(err, response, body) {
    if (err) {
      return cb(err);
    }

    var obj = {
      response: response,
      body: body
    };

    urlCache[url] = obj;
    cb(null, obj);
  });
};

exports.getSourceMap = function(url, cb) {
  if (sourceMapCache[url]) {
    return cb(null, sourceMapCache[url]);
  }

  var self = this;
  var sourceMapUrl;
  var sourceMapBody;

  async.waterfall([
    // get the file
    function(cb) {
      self.getUrl(url, cb);
    },
    function(resp, cb) {
      if (resp.response.headers['X-SourceMap']) {
        return cb(null, resp.response.headers['X-SourceMap']);
      }

      var match = resp.body.match(/\/\/\# sourceMappingURL=(.+)$/);
      if (match && match[1]) {
        cb(null, match[1]);
      }
    },
    function(mapUrl, cb) {
      var mapUrlParsed = urlMod.parse(mapUrl);
      var originalUrlParsed = urlMod.parse(url);

      if (!mapUrlParsed.host) {
        mapUrlParsed.host = originalUrlParsed.host;
      }
      if (!mapUrlParsed.protocol) {
        mapUrlParsed.protocol = originalUrlParsed.protocol;
      }

      sourceMapUrl = urlMod.format(mapUrlParsed);
      self.getUrl(sourceMapUrl, cb);
    },
    function(resp, cb) {
      sourceMapBody = resp.body;
      cb();
    }
  ], function(err) {
    if (err) {
      return cb(err);
    }

    var obj = {
      sourceMapUrl: sourceMapUrl,
      sourceMapBody: sourceMapBody,
      sourceMapConsumer: new sourceMap.SourceMapConsumer(sourceMapBody)
    };

    sourceMapCache[url] = obj;

    cb(null, obj);
  });
};

exports.mapErrorLine = function(url, line, col, cb) {
  var self = this;
  var map;

  async.waterfall([
    function(cb) {
      self.getSourceMap(url, cb);
    },
    function(sourceMapData, cb) {
      map = sourceMapData.sourceMapConsumer.originalPositionFor({
        line: line,
        column: col
      });

      map.string = sprintf("\t%7s:%-3s at: %20s (%s)", map.line, map.column, '`' + map.name + '`', map.source);

      cb();
    }
  ], function(err) {
    cb(err, map);
  });
};

exports.parseErrorLine = function(line) {
  var matchData = line.match(/.*at ([a-zA-Z]+)?.*(http.*)\:(\d+):(\d+)/);

  if (matchData) {
    return {
      function: matchData[1],
      file: matchData[2],
      line: parseInt(matchData[3], 10),
      col: parseInt(matchData[4], 10)
    };
  }
};;

exports.parseErrorLines = function(lines) {
  var self = this;
  var lines = lines.split('\n');

  var lineData = _.map(lines, function(line) {
    return self.parseErrorLine(line);
  });

  return _.compact(lineData);
};

exports.run = function(options) {
  var self = this;
  var errorLinesParsed = this.parseErrorLines(options.stack_trace);

  async.mapSeries(errorLinesParsed, function(errorLineData, cb) {
    self.mapErrorLine(errorLineData.file, errorLineData.line, errorLineData.col, function(err, line) {
      if (err) {
        return cb(err);
      }

      cb(null, line.string);
    });
  }, function(err, lines) {
    if (err) {
      throw err;
    }

    console.log("");
    _.each(lines, function(line) {
      console.log(line);
    });
    console.log("");
  });
};
