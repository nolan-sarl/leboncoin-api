const Search = require('./main')

let page = 1

const search = new Search()

search.setCookie('datadome=9XEZQMe0__9y4vsmZODITzIaYa4gIabB5jcwdBkPxs6j4jgcz9rQbJrcn1-gMQuRFNpJ69MpDzI.sPi2f2YPQRCFv_Z5K6ul-BwUDQh_vv')
search.setCategory('2')
search.setParam("brand", "Audi")
search.setPage(page)

function startSearch() {
    setTimeout(
        () => search.search(result => {
            page++
            search.setPage(page)
            search.setCookie(result.cookie)
            console.log(result)
            startSearch()
        }),
        20 * 1000
    )
}

startSearch()