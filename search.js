const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

class Search {
  constructor(url = null) {
    this.headers = {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36",
    };
    this.url = url;
    this.isCheck = false;
  }

  closeBrowser() {
    try {
      this.browser.close();
    } catch (error) {
      console.log("errorClose");
    }
  }

  async getDataPage(page, callback) {
    try {
      if (!this.browser) {
        this.browser = await puppeteer.launch({
          headless: false,
          // executablePath: "/usr/bin/chromium-browser",
          args: ["--no-sandbox", "--disable-gpu"],
        });
      }

      this.pageBrowser = await this.browser.newPage();
      await this.pageBrowser.setUserAgent(this.headers["user-agent"]);
      await this.pageBrowser.setRequestInterception(true);

      this.pageBrowser.on("request", (req) => {
        if (
          req.resourceType() == "stylesheet" ||
          req.resourceType() == "font" ||
          req.resourceType() == "video" ||
          req.resourceType() == "media" ||
          req.resourceType() == "image" ||
          req.resourceType() == "style"
        ) {
          req.abort();
        } else {
          req.continue();
        }
      });

      await this.pageBrowser.setCacheEnabled(true);
      await this.pageBrowser.setDefaultNavigationTimeout(0);
      await this.pageBrowser.setViewport({ width: 1000, height: 500 });
      const response = await this.pageBrowser.goto(
        page > 1
          ? `https://www.leboncoin.fr/${this.url}/offres/p-${page}`
          : `https://www.leboncoin.fr/${this.url}/offres`,
        {
          waitUntil: "load",
        }
      );

      const bodyHTML = await this.pageBrowser.evaluate(
        () => document.body.innerHTML
      );
      const $ = cheerio.load(bodyHTML);

      let data = [];

      if ($("#__NEXT_DATA__").length > 0) {
        const dataJSON = JSON.parse($("#__NEXT_DATA__").html());

        dataJSON.props.pageProps.searchData.ads.map((element) => {
          let images = [];
          if (element.images && element.images.urls) {
            element.images.urls.map((image) => {
              images.push(image);
            });
          }

          let attributes = {};
          if (element.attributes) {
            element.attributes.map((attribute) => {
              attributes[attribute.key] = attribute.value;
            });
          }

          let location = {};
          if (element.location) {
            Object.keys(element.location).map((idx) => {
              location[idx] = element.location[idx];
            });
          }

          let owner = {};
          if (element.owner) {
            Object.keys(element.owner).map((idx) => {
              owner[idx] = element.owner[idx];
            });
          }

          data.push({
            id: element.list_id,
            date: element.first_publication_date,
            date_index: element.index_date,
            status: element.status,
            category_d: element.category_id,
            category_name: element.category_name,
            title: element.subject,
            description: element.body,
            ad_type: element.ad_type,
            url: element.url,
            price: element.price[0],
            images,
            attributes,
            location,
            owner,
          });
        });

        await this.pageBrowser.close();
        callback({ success: true, data });
      } else {
        await this.pageBrowser.close();
        callback({ success: false, error: "no ID __NEXT_DATA__" });
      }
    } catch (error) {
      try {
        await this.pageBrowser.close();
        callback({ success: false, error });
      } catch (error) {
        callback({ success: false, error });
      }
    }
  }

  async checkAd(url, callback) {
    try {
      if (!this.isCheck) {
        this.isCheck = true;
        if (!this.browser) {
          this.browser = await puppeteer.launch({
            headless: false,
            // executablePath: "/usr/bin/chromium-browser",
            args: ["--no-sandbox", "--disable-gpu"],
          });
        }

        this.pageBrowserCheck = await this.browser.newPage();
        await this.pageBrowserCheck.setUserAgent(this.headers["user-agent"]);
        await this.pageBrowserCheck.setRequestInterception(true);
        this.pageBrowserCheck.on("request", (req) => {
          if (
            req.resourceType() == "stylesheet" ||
            req.resourceType() == "font" ||
            req.resourceType() == "video" ||
            req.resourceType() == "media" ||
            req.resourceType() == "image" ||
            req.resourceType() == "style"
          ) {
            req.abort();
          } else {
            req.continue();
          }
        });

        let code = 200;

        await this.pageBrowserCheck.setCacheEnabled(true);
        await this.pageBrowserCheck.setDefaultNavigationTimeout(0);
        await this.pageBrowserCheck.setViewport({ width: 1000, height: 500 });
        const response = await this.pageBrowserCheck.goto(url, {
          waitUntil: "load",
        });

        if (response.status() === 410) {
          code = 410;
        } else if (response.status() === 403) {
          code = 403;
        }

        await this.pageBrowserCheck.close();
        this.isCheck = false;
        callback({ success: true, code });
      } else {
        setTimeout(() => {
          this.checkAd(url, callback);
        }, 250);
      }
    } catch (error) {
      try {
        await this.pageBrowserCheck.close();
        callback({ success: false, error });
      } catch (error) {
        callback({ success: false, error });
      }
    }
  }
}

module.exports = { Search };
