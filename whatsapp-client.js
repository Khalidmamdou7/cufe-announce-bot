const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { MessageMedia } = require("whatsapp-web.js");

function whatsappClient(newMainAnnouncements, newProgramsAnnouncements) {
    console.log("Running whatsapp client...");
    const client = new Client({
        puppeteer: {
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        },
        authStrategy: new LocalAuth(),
    });
    
    client.initialize();

    client.on("qr", (qr) => {
        qrcode.generate(qr, { small: true });
    });

    client.on("authenticated", () => {
        console.log("AUTHENTICATED");
    });


    client.on("auth_failure", (msg) => {
        console.error("AUTHENTICATION FAILURE", msg);
    });

    client.on("ready", () => {
        console.log("Client is ready!");

        const chat = process.env.WHATSAPP_CHAT_ID;

        if (!newMainAnnouncements.length && !newProgramsAnnouncements.length) {
            const message = "السلام عليكم ورحة الله وبركاته،\n\nلم يتم العثور على اعلانات جديدة على موقع الجامعة.\n\nهذه الرسالة تم ارسالها تلقائيا، تحياتي.";
            client.sendMessage(chat, message);
            return;
        }
        let message = `السلام عليكم ورحة الله وبركاته،\n\nتم نشر اعلانات جديدة على موقع الجامعة، ستجدها مرفقة مع الرسالة بجانب الروابط الخاصة بها:\n`;
        message += `\n\nالاعلانات الرئيسية:\n`;
        newMainAnnouncements.forEach((link) => {
            message += `${link}\n`;
        });
        message += `\n\nالاعلانات الخاصة بالبرامج:\n`;
        newProgramsAnnouncements.forEach((link) => {
            message += `${link}\n`;
        });
        message += `\n\nهذه الرسالة تم ارسالها تلقائيا، تحياتي.`;
        client.sendMessage(chat, message);
        newMainAnnouncements.forEach((link) => {
            const fileName = link.split("/").pop();
            const filePath = `announcements/main/${fileName}`;
            const media = MessageMedia.fromFilePath(filePath);
            client.sendMessage(chat, media);
        });
        newProgramsAnnouncements.forEach((link) => {
            const fileName = link.split("/").pop();
            const filePath = `announcements/programs/${fileName}`;
            const media = MessageMedia.fromFilePath(filePath);
            client.sendMessage(chat, media);
        });
    });

    // client.on("message", (msg) => {
    //     if (msg.body === "!ping") {
    //         msg.reply("pong");
    //     }
    // });

    client.on("disconnected", (reason) => {
        console.log("Client was logged out", reason);
    });
    return client;

}



module.exports = whatsappClient;