const whatsappClient = require('./whatsapp-client');
const scraper = require('./scrap-website');
const dotenv = require('dotenv');
// Comment this line if you don't want to ping the server to keep it alive
// const { pingForever } = require('./ping-forever');

dotenv.config();

let client = null;
let ackCount = 0;
let newMainAnnouncements = [];
let newProgramsAnnouncements = [];

async function main() {
    console.log('Running main function');
    // Check if the client is already running
    if (!client) {
        try {
            [newMainAnnouncements, newProgramsAnnouncements] = await Promise.all([
                scraper.scrapeMainAnnouncementsPage(),
                scraper.scrapeProgramsAnnouncementsPage(),
            ]);
        } catch (err) {
            console.log(err);
            return;
        }

        if (!newMainAnnouncements.length && !newProgramsAnnouncements.length) {
            console.log('No new announcements found');
            return;
        }

        // An unknown error occures which returns all the announcements as new announcements, this is a temporary fix
        if (newMainAnnouncements.length > 10) {
            newMainAnnouncements = [];
        }
        if (newProgramsAnnouncements.length > 5) {
            newProgramsAnnouncements = [];
        }
        if (newMainAnnouncements.length || newProgramsAnnouncements.length) {

            ackCount = 0;
            // Decrease the ackCount by the number of new announcements 
            // because we don't want to destroy the client until the documents of the new announcements are sent
            ackCount -= newMainAnnouncements.length + newProgramsAnnouncements.length;

            client = whatsappClient(newMainAnnouncements, newProgramsAnnouncements);

            // listen for the message ack event to know when the message is sent, if the same number of messages acknolwedged as the number of messages sent, then destroy the client
            client.on("message_ack", (msg, ack) => {
                /*
                == ACK VALUES ==
                ACK_ERROR: -1
                ACK_PENDING: 0
                ACK_SERVER: 1
                ACK_DEVICE: 2
                ACK_READ: 3
                ACK_PLAYED: 4
                */
                if (ack === 1) {
                    ackCount++;
                    if (ackCount === 1) {
                        client.destroy()
                        client = null;
                        newMainAnnouncements = [];
                        newProgramsAnnouncements = [];
                        console.log('Client destroyed');
                    }
                }
            });


        }
    }
}

async function run() {
    while (true) {
        await main();
        // Wait for 5 minutes
        await new Promise((resolve) => setTimeout(resolve, 5 * 60 * 1000));
    }
}

run();

// Comment this line if you don't want to ping the server to keep it alive
// pingForever();
