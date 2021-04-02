const Session = require('./session').Session;

module.exports.defaultSession = new Session();

module.exports.requestHeaders = {
  'Method': "POST",
  'User-Agent':  "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36",
  'Accept-Language': '*',
  'Accept': '*/*',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
  'Content-Type': 'application/json',
  'Referer': "https://www.leboncoin.fr/recherche/",
  'Origin': 'https://www.leboncoin.fr',
  'Api_key': "ba0c2dad52b3ec",
  'Cookie': ''
};

module.exports.getParisGMT = function () {
    var d = new Date();
    var s = d.toLocaleString(undefined, { timeZone: "Europe/Paris", timeZoneName: "short" });
    return s.slice(-5)
};

module.exports.getRandomUserAgent = function () {
    userAgent = [
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
    ]

    return userAgent[getRandomInt(userAgent.length)]
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
