
module.exports = function parseJSON(res, fn){
  res.text = '';
  res.setEncoding('utf8');
  res.on('data', function(chunk){ res.text += chunk;});
  res.on('end', function(){
    if (res.statusCode !== 200) {
      var e = new Error(res.statusCode + ' ' + res.statusMessage);
      e.statusMessage = res.statusMessage
      e.code = e.statusCode = res.statusCode;
      e.rawResponse = res.text || null;
      return fn(e);
    }
    try {
      var body = res.text && JSON.parse(res.text);
    } catch (e) {
      var err = e;
      // issue #675: return the raw response if the response parsing fails
      err.rawResponse = res.text || null;
      // issue #876: return the http status code if the response parsing fails
      err.code = err.statusCode = res.statusCode;
    } finally {
      fn(err, body);
    }
  });
};
