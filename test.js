const Search = require("./main");

// const search = new Search("socks5h://127.0.0.1:9050");
const search = new Search();

let page = 1;
let interval = 5;

search.getCookieAsync((resultCookie) => {
  if (resultCookie.success) {
    console.log("START");
    // search.setCookie(resultCookie.cookie);
    search.setPage(page);
    startSearch();
  } else {
    console.log("FALSE");
  }
});

function startSearch() {
  setTimeout(
    () =>
      search.search((result) => {
        if (result.cookie) {
          search.setCookie(result.cookie);
        }
        if (result.code == 200) {
          page++;
          search.setPage(page);
          console.log(`NEW PAGE : ${page}`);
        }
        console.log(result.cookie, result.code);
        startSearch();
      }),
    interval * 1000
  );
}
