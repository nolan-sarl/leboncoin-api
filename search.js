const request = require("request")

class Search {
    constructor() {
        this.headers = {
            'Method': "POST",
            'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36",
            'Accept-Language': '*',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
            'Content-Type': 'application/json',
            'Referer': "https://www.leboncoin.fr/recherche/",
            'Origin': 'https://www.leboncoin.fr',
            'Api_key': "ba0c2dad52b3ec",
            'Cookie': ''
        }

        this.bodyParams = {
            limit: 100,
            filters: {
                category: {},
                enums: { ad_type: ['offer'] },
                location: {},
                keywords: { type: 'subject' },
                ranges: {}
            },
            offset: 0,
            owner_type: null,
            sort_by: 'time',
            sort_order: 'desc'
        }
    }

    setUserAgent(userAgent) {
        this.headers['User-Agent'] = userAgent
    }

    setCookie(cookie) {
        this.headers['Cookie'] = cookie
    }

    setPage(page) {
        this.bodyParams.offset = page
    }

    setLimit(limit) {
        this.bodyParams.limit = limit
    }

    setCategory(category) {
        this.bodyParams.filters.category = { id: category }
    }

    setParam(label, value) {
        this.bodyParams.filters.enums[label] = value
    }

    removeParam(label) {
        this.bodyParams.filters.enums[label] = undefined
    }

    getCookieAsync(callback) {
        this.search((resultSearch) => {
            if (resultSearch.cookie) {
                callback({ success: true, cookie: resultSearch.cookie })
            } else {
                callback({ success: false, cookie: '' })
            }
        })
    }

    getHeaders() {
        return { success: true, headers: this.headers }
    }

    search(callback) {
        let body = {
            uri: 'https://api.leboncoin.fr/finder/search',
            headers: this.headers,
            json: this.bodyParams,
            gzip: true,
            method: 'POST',
        }

        request(body, (err, httpResponse, jsonResult) => {
            if (err) {
                callback({ success: false, error: err })
            } else if (httpResponse && httpResponse.statusCode == 403) {
                callback({ success: false, error: httpResponse, cookie: httpResponse.caseless.dict["set-cookie"][0].split("; ")[0] })
            } else {
                callback({ success: true, data: jsonResult.ads, cookie: httpResponse.caseless.dict["set-cookie"][0].split("; ")[0] })
            }
        })
    }
}

module.exports = { Search }