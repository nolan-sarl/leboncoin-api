const { SocksProxyAgent } = require("socks-proxy-agent");
// const puppeteer = require("puppeteer");
const request = require("request");

class Search {
  constructor(proxy = null) {
    this.headers = {
      accept: "*/*",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
      api_key: "ba0c2dad52b3ec",
      "cache-control": "no-cache",
      "content-type": "application/json",
      Cookie:
        "_fbp=fb.1.1623236495652.1610402823; _gcl_au=1.1.1151400082.1623170642; __gads=ID=ed5da0c861a06844:T=1623236497:S=ALNI_MaV5L1Yduo_lcjj8TFCo58kVWxdFw; __Secure-InstanceId=c54e7e8d-9909-48d0-8953-192de5bf66d7; ry_ry-l3b0nco_realytics=eyJpZCI6InJ5X0NGMkUxODhBLUE0OEYtNDUwNi04QUEyLUY0N0IyQjk3QTEzMCIsImNpZCI6bnVsbCwiZXhwIjoxNjU0Nzc2MjE1NDkxLCJjcyI6bnVsbH0=; didomi_token=eyJ1c2VyX2lkIjoiMTc5ZjBhODAtMTNiNi02ZjQzLWJkYzgtMDE0NjZmMzAzZWVjIiwiY3JlYXRlZCI6IjIwMjEtMDYtMDlUMTI6MDc6NDEuNzEwWiIsInVwZGF0ZWQiOiIyMDIxLTA2LTA5VDEyOjA3OjQxLjcxMFoiLCJ2ZXJzaW9uIjoyLCJwdXJwb3NlcyI6eyJlbmFibGVkIjpbInBlcnNvbm5hbGlzYXRpb25jb250ZW51IiwicGVyc29ubmFsaXNhdGlvbm1hcmtldGluZyIsInByaXgiLCJtZXN1cmVhdWRpZW5jZSIsImV4cGVyaWVuY2V1dGlsaXNhdGV1ciJdfSwidmVuZG9ycyI6eyJlbmFibGVkIjpbImFtYXpvbiIsInNhbGVzZm9yY2UiLCJnb29nbGUiLCJjOm5leHQtcGVyZm9ybWFuY2UiLCJjOmNvbGxlY3RpdmUtaGhTWXRSVm4iLCJjOnJvY2t5b3UiLCJjOnB1Ym9jZWFuLWI2QkpNdHNlIiwiYzpydGFyZ2V0LUdlZk1WeWlDIiwiYzpzY2hpYnN0ZWQtTVFQWGFxeWgiLCJjOmdyZWVuaG91c2UtUUtiR0JrczQiLCJjOnJlYWx6ZWl0Zy1iNktDa3h5ViIsImM6dmlkZW8tbWVkaWEtZ3JvdXAiLCJjOnN3aXRjaC1jb25jZXB0cyIsImM6bHVjaWRob2xkLXlmdGJXVGY3IiwiYzpsZW1vbWVkaWEtemJZaHAyUWMiLCJjOnlvcm1lZGlhcy1xbkJXaFF5UyIsImM6c2Fub21hIiwiYzpyYWR2ZXJ0aXMtU0pwYTI1SDgiLCJjOnF3ZXJ0aXplLXpkbmdFMmh4IiwiYzp2ZG9waWEiLCJjOnJldmxpZnRlci1jUnBNbnA1eCIsImM6cmVzZWFyY2gtbm93IiwiYzp3aGVuZXZlcm0tOFZZaHdiMlAiLCJjOmFkbW90aW9uIiwiYzp3b29iaSIsImM6c2hvcHN0eWxlLWZXSksyTGlQIiwiYzp0aGlyZHByZXNlLVNzS3dtSFZLIiwiYzpiMmJtZWRpYS1wUVRGZ3lXayIsImM6cHVyY2giLCJjOmxpZmVzdHJlZXQtbWVkaWEiLCJjOnN5bmMtbjc0WFFwcmciLCJjOmludG93b3dpbi1xYXp0NXRHaSIsImM6ZGlkb21pIiwiYzpyYWRpdW1vbmUiLCJjOmFkb3Rtb2IiLCJjOmFiLXRhc3R5IiwiYzpncmFwZXNob3QiLCJjOmFkbW9iIiwiYzphZGFnaW8iLCJjOmxiY2ZyYW5jZSJdfSwidmVuZG9yc19saSI6eyJlbmFibGVkIjpbImdvb2dsZSJdfSwiYWMiOiJERTJBd0FFSUFmb0JoUUR4QUhtQVNTQWtzQ0pJSEVBT3JBaURCRktDS2dFbTRKdkFUa0F0ckJiZUM0d0Z5UUxsZ1lEQXdpQmlhQUFBLkRFMkF3QUVJQWZvQmhRRHhBSG1BU1NBa3NDSklIRUFPckFpREJGS0NLZ0VtNEp2QVRrQXRyQmJlQzR3RnlRTGxnWURBd2lCaWFBQUEifQ==; euconsent-v2=CPHhtaJPHhtaJAHABBENBcCgAP_AAHLAAAAAG7tf_X_fb2vj-_599_t0eY1f9_63v6wzjheNs-8NyZ_X_L4Xo2M6vB36pq4KmR4Eu3LBAQdlHOHcTQmQ4IkVqTPsbk2Mr7NKJ7LEmlMbe2dYGH9_n8XTuZKY70_8___z_3-v_v__7rbgCAAAAAAAIAgc6ASYal8AA2JY4Ek0aVQogQhWEhUAoAKKAYWiawgJHBTsrgI9QQIAEJqAjAiBBiCjFgEAAgEASERACAHggEQBEAgABACpAQgAIkAQWAFgYBAAKAaFABFAEIEhBEYFRymBARItFBPIGAAQAAAAAAAAAAAAAAAgBigYIABwAEgANAAeABSADAAMgAigBSAFQALAAYgA1gB8AH8AQgBDACYAFoALkAXgBfgDCAMQAZgA2gB4AD1AH8AggBCwCNAI4ASYAlQBMwCfAKAAUgAqABWgCygFuAXEAygDLgGaAZ0A0wDVAGwANoAcEA4gDkAHMAOyAd4B4QDzAPSAfIB9AD8AH_AQUBBoCEgIUARAAjABHICSgJMASuAloCXAEwAJvATwBPgCggFFAKQAUsAqIBV4CugK-AWaAtAC0gFzgLsAu4BeQC-AF-AMCAYQAxUBnAGdANAAacA1oBtADeAHCgOaA5wB1QDsgHbAO-AeIA9YB7YD9AP2Af8BAgCBwEGAISAQuAh8BEoCLAEcQI6AjsBHoCQQEhgJFASiAlSBLwEvwJhAmIBM0CbAJtATuAn8BQoCiAFFAKMgUcBSACmYFNgU4Ap8BUQCpIFWgVeArMBW0CxALFgWOBZMCywLMAWcAtEBasC1wLYAW4AuCBcYFyQLmAugBdcC7QLugXmBesC9wL7AYEAwqBhoGHwMUAxUBjUDHgMgAZEAyUBlcDMAMxAZpAzgDOYGeAZ9A0EDQgGigNPga0BrcDXQNeAbAA2QBtQDbQG4ANygboBusDfQN-gcIBw0DiQOKAccA5IBykDmAOZAc8A6eB1oHYAO4Ad2A72B4QHhgPQgemB6kD1gPYAe4A94B8AD4gHzgPpAfZA-8D8BgL4AA4ACQAHgAUgAwADIAIoAUgBUACwAGIANQAfwBCAEMAJgAUwAuABegDCAMQAZgA2wB_AIKARoBHgCTAEqAJmAT4BQACkAFQAK0AWUAtwC4AGPAMoAywBnQDTANUAbQA4IBxAHIAOYAdkA7wDwgHmAekA-gD8AH_AQkBCgCIAESAIwARwAkoBKwCWgEwAJvATwBPgCggFFAKQAUsAqIBVwCtwFdAV8AsQBZgC5wF2AXcAvIBfAC_AGEAMVAZwBnQDQQGmAacA1oBtADeAHCgOaA5wB1QDsgHbAO-AeIA9YB7QD5AH7AQIAgcBCQCFwEPgIlARYAjiBHQEdgI9ASCAkMBIoCTgEogJUgS8BL8CYQJiATNAmwCbQE4gJ3AT-AoUBRACigFGQKOApABTMCmwKcgU8BT4CogFSQKtAq8BWYCtgFiQLHAsmBZYFmALOAWiAtWBa4FsQLbAtwBcAC44FzAXQAuuBdoF3QLyAvSBe4F8AL7AYEAwoBhoDD4GKAYqAxoBjwDIAGRAMlAZWAzEBmkDOAM5gZ4Bn0DQQNCAaKA0-BrQGtgNdAbAA2SBtQG2ANwgboBusDfQN-gcIBwwDiQHHAOSAcpA5gDmQHPAOngdaB2ADuAHdgO9geEB4YD0IHpgepA9YD2AHuAPeAfAA-IB84D6QH2QPvA_AgDnAADAAcACQAFgANAAeABQAC0AGQAaAA6ACIAEgAKgAWAAuABiAD-AIIAhwBMAE0AKYAVQArgBcgC8AL8AYQBiADMAGgANoAbwA7gB6gD-AQIAi4BGgEeAJEASYAlYBPgFAAKQAVAAqgBWwCxALKAW4BcgC-AGEAMSAZQBlwDNAM6AaYBqgDYAG1AN8A4ABxADkgHMAc4A7IB3gHhAPMA9AB7QD5APwAf4BBYCEgIUARAAikBGAEZAI4ASUAlIBKwCXAEwgJuAnABPACfAFBAKGAUWApACkgFLAKeAVEAq4BWQCtwFdAV8AsQBZoC0ALSAXOAuwC7gF5AL4AX4AwABhADFAGZgM4AzoBoIDTANOAasA1oBtADeAHCAObAdQB1QDrgHZAO2Ad8A8QB6ID1APWAe2A_ID-AIAAQIAgcBCcCFwIYAQ-AiGBEoETAIsgRwBHcCPQI-gSCBIoCTgEogJUASuAlqBLwEvwJhAmIBMwCaYE2ATaAnEBO4Cf4FCAUKAoiBRgFIQKSApOBTIFOQKeAp8BUQCpIFWgVeArMBW0CvgK_gWIBYsCxwLJgWWBZgCzgFogLTAWrAtcC3AFvALggXGBckC5wLogXWBdwC8gF6QL2Av2BgIGBgMKgYYBh4DEoGKAYqAxoBjwDIAGRAMlAZOAysBloDMQGaQM3Az-BoIGhQNEA0UBo8DSQNLAaeA1OBqoGrQNaA1sBrsDXwNhAbJA2sDbAG3ANwgboBusDeQN6gb6Bv0DgAOBgcIBwwDiQHGAOOAclA5gDmYHPAc-A6OB0oHTwOpA6qB1gHYAO1AdwA7uB3oHfAPBgeGB4gDx4HkgeVA84D0YHpgepA9YD2IHuAe9A-AD4oHzgfSA-wB-AAA.f_gADlgAAAAA; include_in_experiment=true; adview_clickmeter=alu__listing__0__4776c94e-c91b-11eb-840d-46c15a71e054; sq=ca=16_s; utag_main=_st:1623250294233$v_id:0179f0a806840016eb882a4198bd03078002807001356$_sn:2$_ss:1$_pn:1;exp-session$ses_id:1623248492250;exp-session; datadome=CkcMzA267Xq7YMYix4yMVQ8qWZDaJNcfyGsIXgGiS5KOQpIhSCHgeFeITAr78JwB_vD99S0zsMLirigc4_tdnpAJOuB06_HCKKVJBuSUlv; ry_ry-l3b0nco_so_realytics=eyJpZCI6InJ5X0NGMkUxODhBLUE0OEYtNDUwNi04QUEyLUY0N0IyQjk3QTEzMCIsImNpZCI6bnVsbCwib3JpZ2luIjpmYWxzZSwicmVmIjpudWxsLCJjb250IjpudWxsLCJucyI6ZmFsc2V9",
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

    if (proxy) {
      this.agent = new SocksProxyAgent(proxy);
    }

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
    let currentCookie = {};

    cookie = cookie.replace(/ /g, "");
    cookie = cookie.replace(/%3D/g, "=");
    cookie = cookie.replace(/%3B/g, ";");

    this.headers["Cookie"].split(";").map((element) => {
      if (element) {
        const tmpElement = element.split("=");
        currentCookie[tmpElement[0]] = {
          value: tmpElement[1]
            ? element.replace(tmpElement[0] + "=", "")
            : undefined,
        };
      }
    });

    let newCookie = cookie.split(";");
    newCookie.map((element) => {
      if (element) {
        const tmpElement = element.split("=");
        if (
          currentCookie.hasOwnProperty(tmpElement[0]) &&
          tmpElement[0] == "datadome"
        ) {
          currentCookie[tmpElement[0]] = {
            value: tmpElement[1]
              ? element.replace(tmpElement[0] + "=", "")
              : undefined,
          };
        }
      }
    });

    let tmpCookie = "";
    Object.keys(currentCookie).map((idx) => {
      if (idx) {
        tmpCookie += idx;
        if (currentCookie[idx].value) {
          tmpCookie += `=${currentCookie[idx].value}`;
        }
        tmpCookie += ";";
      }
    });

    // console.log(tmpCookie);
    // console.log("\n\n");
    // console.log(this.headers["Cookie"]);
    // console.log("\n\n");

    this.headers["Cookie"] = tmpCookie;
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
    // try {
    //   this.browser = await puppeteer.launch({
    //     headless: false,
    //     // executablePath: "/usr/bin/chromium-browser",
    //     // args: ["--no-sandbox", "--disable-gpu"],
    //   });
    //   this.pageBrowser = await this.browser.newPage();
    //   await this.pageBrowser.setUserAgent(this.headers["user-agent"]);
    //   // await this.pageBrowser.setRequestInterception(true);
    //   // this.pageBrowser.on("request", (req) => {
    //   //   if (
    //   //     req.resourceType() == "stylesheet" ||
    //   //     req.resourceType() == "font" ||
    //   //     req.resourceType() == "image"
    //   //   ) {
    //   //     req.abort();
    //   //   } else {
    //   //     req.continue();
    //   //   }
    //   // });
    //   await this.pageBrowser.setCacheEnabled(false);
    //   await this.pageBrowser.setDefaultNavigationTimeout(0);
    //   await this.pageBrowser.setViewport({ width: 1000, height: 500 });
    //   const response = await this.pageBrowser.goto(
    //     "https://www.leboncoin.fr/voitures/offres",
    //     {
    //       waitUntil: "load",
    //     }
    //   );
    //   await this.pageBrowser.evaluate(() => {
    //     const $ = window.$;
    //   });

    //   // const headers = response.headers();
    //   // callback({
    //   //   success: true,
    //   //   cookie: headers["set-cookie"].split("; ")[0],
    //   // });

    //   const cookies = await this.pageBrowser.cookies();

    //   let cookie = "";

    //   if (cookies) {
    //     for (const key in cookies) {
    //       if (Object.hasOwnProperty.call(cookies, key)) {
    //         const element = cookies[key];
    //         if (element.name == "datadome") {
    //           cookie += `${element.name}=${element.value};`;
    //         } else if (element.name == "_fbp") {
    //           cookie += `${element.name}=${element.value};`;
    //         } else if (element.name == "_gcl_au") {
    //           cookie += `${element.name}=${element.value};`;
    //         } else if (element.name == "__gads") {
    //           cookie += `${element.name}=${element.value};`;
    //         } else if (element.name == "__Secure-InstanceId") {
    //           cookie += `${element.name}=${element.value};`;
    //         } else if (element.name == "ry_ry-l3b0nco_realytics") {
    //           cookie += `${element.name}=${element.value};`;
    //         } else if (element.name == "ry_ry-l3b0nco_so_realytics") {
    //           cookie += `${element.name}=${element.value};`;
    //         } else if (element.name == "didomi_token") {
    //           cookie += `${element.name}=${element.value};`;
    //         } else if (element.name == "exp-session$ses_id") {
    //           cookie += `${element.name}=${element.value};`;
    //         } else if (element.name == "euconsent-v2") {
    //           cookie += `${element.name}=${element.value};`;
    //         } else if (element.name == "include_in_experiment") {
    //           cookie += `${element.name}=${element.value};`;
    //         } else if (element.name == "adview_clickmeter") {
    //           cookie += `${element.name}=${element.value};`;
    //         } else if (element.name == "sq") {
    //           cookie += `${element.name}=${element.value};`;
    //         } else if (element.name == "utag_main") {
    //           cookie += `${element.name}=${element.value};`;
    //         } else if (element.name == "exp-session$ses_id") {
    //           cookie += `${element.name}=${element.value};`;
    //         } else if (element.name == "datadome") {
    //           cookie += `${element.name}=${element.value};`;
    //         }
    //       }
    //     }
    //   }

    //   callback({
    //     success: true,
    //     cookie,
    //   });

    //   // await this.browser.close();
    // } catch (error) {
    //   callback({ success: false, error });
    // }
    callback({ success: false });
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
      method: "OPTIONS",
    };

    if (this.agent) {
      body.agent = this.agent;
    }
    request(body, (err, httpResponse, jsonResult) => {
      if (err) {
        callback({ success: false, error: err });
      } else if (httpResponse && httpResponse.statusCode == 204) {
        body.method = "POST";
        request(body, (err, httpResponse, jsonResult) => {
          if (err) {
            callback({ success: false, error: err });
          } else if (httpResponse && httpResponse.statusCode == 403) {
            callback({
              success: false,
              error: httpResponse,
              code: httpResponse.statusCode,
              cookie:
                httpResponse.caseless.dict["set-cookie"][0].split("; ")[0],
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
              code: httpResponse.statusCode,
              data: output,
              cookie: httpResponse.caseless.dict["set-cookie"]
                ? httpResponse.caseless.dict["set-cookie"][0].split("; ")[0]
                : "",
            });
          } else {
            callback({
              success: true,
              code: httpResponse.statusCode,
              data: [],
              cookie: httpResponse.caseless.dict["set-cookie"]
                ? httpResponse.caseless.dict["set-cookie"][0].split("; ")[0]
                : "",
            });
          }
        });
      } else {
        callback({ success: false });
      }
    });
  }
}

module.exports = { Search };
