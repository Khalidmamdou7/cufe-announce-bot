const https = require("https");
const http = require('http');
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

function pingForever() {
    setInterval(() => {
        try {
            if (process.env.NODE_ENV === 'production') {
                const options = {
                    hostname: process.env.PRODUCTION_URL,
                    path: '/',
                    method: 'GET',
                    // the app somehow recognizes if bot or human is using it, so we need to add a user agent to make it think we are a human
                    headers: {
                        "User-Agent": "Mozilla/5.0",
                    },
                
                };
                console.log('Pinging the server...');
                const req = https.request(options, res => {
                    console.log(`statusCode: ${res.statusCode}`);
                });

                req.on('error', error => {
                    console.error(error);
                });

                req.end();

            }
            else {
                const options = {
                    hostname: 'localhost',
                    port: PORT,
                    path: '/',
                    method: 'GET'
                };

                const req = http.request(options, res => {
                    console.log(`statusCode: ${res.statusCode}`);
                });

                req.on('error', error => {
                    console.error(error);
                });

                req.end();
            }

        } catch (err) {
            console.log(err);
        }
    }, 5 * 60 * 1000); // every 5 minutes 


    return true;
}

module.exports = { pingForever }

