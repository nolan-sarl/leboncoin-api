const puppeteer = require("puppeteer");
const request = require("request");

class Search {
  constructor() {
    this.headers = {
      accept: "*/*",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
      api_key: "ba0c2dad52b3ec",
      "cache-control": "no-cache",
      "content-type": "application/json",
      Cookie:
        "datadome=R-5wMNi1vIl3C-h6rZaTsGa.Q958J93_hBYTab1sogn97hpWit_hmk-U6JFIKY4tf9WAseG3O_tG~5p7juRWO0x3WpI0F6uZRM3-n4.wUQ",
      origin: "https://www.leboncoin.fr",
      referer: "https://www.leboncoin.fr/voitures/offres",
      "sec-ch-ua":
        '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36",
    };

    this.bodyParams = {
      limit: 100,
      filters: {
        category: { id: "2" },
        enums: { ad_type: ["offer"] },
        location: {},
        keywords: { type: "subject" },
        ranges: {},
      },
      offset: 0,
      owner_type: "all",
      sort_by: "time",
      sort_order: "desc",
    };
  }

  setUserAgent(userAgent) {
    this.headers["User-Agent"] = userAgent;
  }

  setCookie(cookie) {
    cookie = cookie.replace(/\n/g, "");
    this.headers["Cookie"] = cookie;
  }

  setPage(page) {
    this.bodyParams.offset = (page - 1) * this.bodyParams.limit;
  }

  setLimit(limit) {
    this.bodyParams.limit = limit;
  }

  setCategory(category) {
    this.bodyParams.filters.category = { id: category };
  }

  setParam(label, value) {
    this.bodyParams.filters.enums[label] = value;
  }

  removeParam(label) {
    this.bodyParams.filters.enums[label] = undefined;
  }

  async getCookieAsync(callback) {
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        executablePath: "/usr/bin/chromium-browser",
        args: ["--no-sandbox", "--disable-gpu"],
      });
      this.pageBrowser = await this.browser.newPage();
      await this.pageBrowser.setCacheEnabled(false);
      await this.pageBrowser.setDefaultNavigationTimeout(0);
      await this.pageBrowser.setViewport({ width: 1000, height: 500 });
      await this.pageBrowser.goto("https://www.leboncoin.fr/voitures/offres", {
        waitUntil: "load",
      });
      await this.pageBrowser.evaluate(() => {
        const $ = window.$;
      });
      const cookies = await this.pageBrowser.cookies();

      if (cookies) {
        for (const key in cookies) {
          if (Object.hasOwnProperty.call(cookies, key)) {
            const element = cookies[key];
            if (element.name == "datadome") {
              callback({ success: true, cookie: element.value });
            }
          }
        }
      } else {
        callback({ success: false });
      }
      await this.browser.close();
    } catch (error) {
      callback({ success: false, error });
    }
  }

  getHeaders() {
    return { success: true, headers: this.headers };
  }

  search(callback) {
    let body = {
      uri: "https://api.leboncoin.fr/finder/search",
      headers: this.headers,
      json: this.bodyParams,
      gzip: true,
      method: "POST",
    };

    request(body, (err, httpResponse, jsonResult) => {
      if (err) {
        callback({ success: false, error: err });
      } else if (httpResponse && httpResponse.statusCode == 403) {
        callback({
          success: false,
          error: httpResponse,
          code: httpResponse.statusCode,
          cookie: httpResponse.caseless.dict["set-cookie"][0].split("; ")[0],
        });
      } else if (jsonResult && jsonResult.ads) {
        var output = [];

        for (var i in jsonResult.ads) {
          var entry = jsonResult.ads[i];

          var attributes = {};

          if (entry.attributes != null) {
            entry.attributes.forEach((attribute) => {
              attributes[attribute.key] = attribute.value;
            });
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
            attributes: attributes,
          });
        }

        callback({
          success: true,
          data: output,
          cookie: httpResponse.caseless.dict["set-cookie"]
            ? httpResponse.caseless.dict["set-cookie"][0].split("; ")[0]
            : "",
        });
      } else {
        callback({
          success: true,
          data: [],
          cookie: httpResponse.caseless.dict["set-cookie"]
            ? httpResponse.caseless.dict["set-cookie"][0].split("; ")[0]
            : "",
        });
      }
    });
  }
}

module.exports = { Search };
