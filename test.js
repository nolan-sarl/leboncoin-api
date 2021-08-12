const Search = require("./main");

// const search = new Search("socks5h://127.0.0.1:9050");
const search = new Search();

function start() {
  search.checkAd(
    "https://github.com/puppeteer/puppeteer/issues/1981",
    (result) => {
      console.log(result);
      // setTimeout(() => {
      //   start();
      // }, 5000);
    }
  );
}

start();
setTimeout(() => {
  start();
  start();
  start();
  start();
  start();
  start();
  start();
  start();
  start();
  start();
  start();
  start();
  start();
  start();
  start();
  start();
  start();
  start();
  start();
  start();
  start();
  start();
  start();
}, 2000);
