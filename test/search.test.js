const search = require("../lib/search.js");

describe('Search', function () {
    describe('GetBodyParams', function () {
        it('search', function (done) {
            var s = new search.Search()
                .setPage(1)
                .setCategory("voitures")
                .setLimit(100)
                .setTitleOnly(true)
                .setSort({
                    "sort_by": "date_index",
                    "sort_order": "desc"
                })
            s.run().then(result => {
                if (result.success == true) {
                    console.log(result.results.length)
                    done()
                } else {
                    console.log(result)
                }
            })
        });
    });
});
