const Search = require("./main");

// const search = new Search("socks5h://127.0.0.1:9050");
const search = new Search();

function start() {
  search.getDataPage((result) => {
    console.log(result);
    // setTimeout(() => {
    //   start();
    // }, 5000);
  });
}

start();
