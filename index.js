const express = require("express");
const app = express();
const { getToken, getTweets, filterTweets } = require("./twitter");

app.use(express.static("./ticker"));

app.listen(8080, () => console.log("Twicker up and running."));

app.get("/links.json", (req, res) => {
    getToken()
        .then(token => {
            // we're using promise.all to make 3 requests to Twitter simultaneously
            // Promise.all takes in an ARRAY of promises as an argument!
            return Promise.all([
                getTweets(token, "nytimes"),
                getTweets(token, "bbcworld"),
                getTweets(token, "theonion")
            ]);
        })
        .then(results => {
            console.log(results);
            // 'then' will run only when we get all 3 responses (when they're 'resolved')
            // [{}, {}, {},{}, {}, {},{}, {}, {}];
            // We want to merge all of the arrays into a single one:
            // #1 ----- using concat -----
            // let mergedResults = nytimes.concat(bbcworld, theonion);

            // #2 ---------  using spread operator -------
            // let mergedResults = [...nytimes, ...bbcworld, ...theonion];

            // #3 --------- think you need at least node version 12 for this one -------
            let mergedResults = results.flat();

            let sorted = mergedResults.sort((a, b) => {
                return new Date(b.created_at) - new Date(a.created_at);
            });

            // if you want to sort in chronological order:
            // return a - b;

            let filteredTweets = filterTweets(sorted);
            res.json(filteredTweets);
        })
        .catch(err => {
            console.log("err in catch: ", err);
            res.sendStatus(500);
        });
});
