const Search = require('./main')

// let page = 60

const search = new Search()

search.setCookie('datadome=HKhGFj44P8xjqaEvMOjDj~GCj_VaHIH6qMB4-a~f3FpTvxlhRTOQRwz4OP3D2BN7_-Lk4t6ybRyHQbxWJu3ThHfDc5DUkBJmfsngB0Pq7A')
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

test()