const https = require("https");
const { consumerKey, consumerSecret } = require("./secrets.json");

module.exports.getToken = function() {
    return new Promise(function(resolve, reject) {
        let creds = `${consumerKey}:${consumerSecret}`;
        let encodedCreds = Buffer.from(creds).toString("base64");

        const options = {
            host: "api.twitter.com",
            path: "/oauth2/token",
            method: "POST",
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded;charset=UTF-8",
                Authorization: `Basic ${encodedCreds}`
            }
        };
        const cb = function(response) {
            if (response.statusCode != 200) {
                console.log("Response status: ", response.statusCode);
                reject(response.statusCode);
            }

            let body = "";
            response.on("data", chunk => {
                body += chunk;
            });
            response.on("end", () => {
                let parsedBody = JSON.parse(body);
                resolve(parsedBody.access_token);
            });
        };

        const req = https.request(options, cb);

        req.end("grant_type=client_credentials");
    });
};

module.exports.getTweets = function(bearerToken, screenName) {
    return new Promise((resolve, reject) => {
        const options = {
            host: "api.twitter.com",
            path: `/1.1/statuses/user_timeline.json?screen_name=${screenName}&tweet_mode=extended`,
            method: "GET",
            headers: {
                Authorization: "Bearer " + bearerToken
            }
        };

        const cb = function(response) {
            if (response.statusCode != 200) {
                reject(response.statusCode);
            }

            let body = "";
            response.on("data", chunk => {
                body += chunk;
            });
            response.on("end", () => {
                const parsedBody = JSON.parse(body);
                console.log("Get tweets response body: ", parsedBody);
                resolve(parsedBody);
            });
        };

        const req = https.request(options, cb);
        req.end();
    });
};

module.exports.filterTweets = function(tweets) {
    const filteredTweets = [];
    for (let i = 0; i < tweets.length; i++) {
        let obj = {};
        if (tweets[i].entities.urls.length === 1) {
            obj.text = tweets[i].full_text.replace(/(https?:\/\/[^\s]+)/g, "");
            obj.href = tweets[i].entities.urls[0].url;
            filteredTweets.push(obj);
        }
    }
    return filteredTweets;
};
