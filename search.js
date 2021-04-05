const puppeteer = require("puppeteer");
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
        this.bodyParams.offset = (page - 1) * this.bodyParams.limit
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

    async getCookieAsync(callback) {
        try {
            this.browser = await puppeteer.launch({
                headless: true,
                executablePath: '/usr/bin/chromium-browser',
                args: [
                    "--no-sandbox",
                    "--disable-gpu",
                ]
            });
            this.pageBrowser = await this.browser.newPage();
            await this.pageBrowser.setCacheEnabled(false);
            await this.pageBrowser.setDefaultNavigationTimeout(0);
            await this.pageBrowser.setViewport({ width: 1000, height: 500 })
            await this.pageBrowser.goto("https://www.leboncoin.fr/voitures/offres", { waitUntil: 'load' });
            await this.pageBrowser.evaluate(() => {
                const $ = window.$;
            })
            const cookies = await this.pageBrowser.cookies()

            if (cookies) {
                for (const key in cookies) {
                    if (Object.hasOwnProperty.call(cookies, key)) {
                        const element = cookies[key];
                        if (element.name == "datadome") {
                            callback({ success: true, cookie: element.value })
                        }
                    }
                }
            } else {
                callback({ success: false })
            }
            await this.browser.close();
        } catch (error) {
            callback({ success: false, error })
        }
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
                callback({
                    success: false,
                    error: httpResponse,
                    code: httpResponse.statusCode,
                    cookie: httpResponse.caseless.dict["set-cookie"][0].split("; ")[0]
                })
            } else if (jsonResult && jsonResult.ads) {
                var output = [];

                for (var i in jsonResult.ads) {
                    var entry = jsonResult.ads[i];

                    var attributes = {};

                    if (entry.attributes != null) {
                        entry.attributes.forEach(attribute => {
                            attributes[attribute.key] = attribute.value;
                        })
                    }

                    output.push({
                        id: entry.list_id,
                        title: entry.subject,
                        description: entry.body,
                        category: entry.category_name,
                        link: entry.url,
                        images: entry.images.urls,
                        location: entry.location,
                        urgent: entry.urgent ? entry.urgent : false,
                        price: entry.price ? entry.price[0] : 0,
                        date: entry.first_publication_date,
                        date_index: entry.index_date,
                        owner: entry.owner,
                        attributes: attributes
                    })
                }

                callback({ success: true, data: output, cookie: httpResponse.caseless.dict["set-cookie"][0].split("; ")[0] })
            } else {
                callback({ success: true, data: [] })
            }
        })
    }
}

module.exports = { Search }