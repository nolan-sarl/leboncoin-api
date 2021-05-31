const Search = require("./main");

let page = 1;
let interval = 5;

const search = new Search();

search.setCookie(`datadome=0j1y~inqS0_-cj8s87eIg6JBZo2hJSJ-qwK3SqH~ThVOggP.c13DzmCF91byxhFflTa-EVqatQE3NnKdSRtZJlr8vV-5_5_IzvOTuvRg3d`);
search.setCategory('2')
search.setPage(page)

function startSearch() {
  setTimeout(
    () =>
      search.search((result) => {
        page++;
        search.setPage(page);
        search.setCookie(result.cookie);
        console.log(result.cookie, result.data.length);
        if (result.success && result.cookie) {
          search.setCookie(result.cookie);
        }
        interval = 40;
        startSearch();
      }),
    interval * 1000
  );
}

startSearch();
