const Search = require("./main");

// const search = new Search("socks5h://127.0.0.1:9050");
const search = new Search();

function start() {
  search.checkAd(
    "https://www.leboncoin.fr/voitures/2000422185.htm",
    (result) => {
      console.log(result);
      // setTimeout(() => {
      //   start();
      // }, 5000);
    }
  );
}

start();
