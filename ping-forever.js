const https = require("https");
const express = require("express");
const app = express();
app.get("/", (request, response) => {
    response.sendStatus(200);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
}
);

// the app somehow recognizes if bot or human is using it, so we need to add a user agent to make it think we are a human
const options = {
    headers: {
        "User-Agent": "Mozilla/5.0",
    },
};

function pingForever() {
    setInterval(() => {
        https.get(
            `https://${process.env.MY_DOMAIN}/`,
            options,
            (res) => {
                console.log(`Response status: ${res.statusCode}`);
                if (res.statusCode === 200) {
                    console.log('Server is up');
                }
            }
        );
    }, 240000);


    return true;
}

module.exports = { pingForever }

