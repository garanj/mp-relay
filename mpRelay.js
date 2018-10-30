exports.mpRelay = (req, res) => {
  const request = require('request');
  
  // Set a key, to be compared against a key property
  // in the submitted JSON.
  // Choose your own value here.
  const KEY = '33e19888-98db-410f-8dba-874c7c6efd68';
  
  const GA_ENDPOINT = 'https://www.google-analytics.com';
  
  if (req.method !== 'POST') {
    res.status(400).send('Invalid method');
    return;
  }
  const data = req.body;
  if (!data || data.key !== KEY) {
    res.status(401).send('Unauthorized');
    return;
  }
  if (!data || !data.hits || !data.hits.length) {
    res.status(400).send('Invalid params');
    return;
  }
  
  if (data.hits.length === 1) {
    var path = '/collect';
  } else {
    var path = '/batch';
  }
  const form = data.hits.map((p) => {
    const keys = Object.keys(p);
    return keys.map((k) => k + '=' + p[k]).join('&');
  }).join('\n');
  
  request.post({
    url: GA_ENDPOINT + path,
    form: form
  }, function optionalCallback(err, httpResponse, body) {
    if (err) {
      res.status(httpResponse.statusCode).send(err);
    } else {
      res.status(200).send('Success');
    }
  });
};
