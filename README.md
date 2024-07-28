# CUFE Announcement Bot

This a simple bot that scraps [CUFE - CHS's announcements page](http://eng.cu.edu.eg/en/credit-hour-system/) and sends the new announcements to a whatsapp group. It is written in node.js and uses [whatsapp-web.js] to send the messages.

<div style="display: flex; justify-content: space-around;">
  <img src="https://github.com/user-attachments/assets/60951920-fda7-4b26-abe7-620c153ae30c" alt="Announcement's website" width="500"/>
  <img src="https://github.com/user-attachments/assets/d58fbbd3-0ef7-4326-9790-5ef113b22cc9" alt="Message sent to whatsapp group" width="300"/>
</div>


## How to use

1. Clone the repo
2. Install the dependencies using `npm install`
3. Create a file named `.env` and add the environment variables as shown in `.env.example`
4. Run the bot using `npm start`
5. Scan the QR code using your phone

## How it works

The bot scraps the announcements page every 5 minutes and stores the new announcements in a json file. If the bot is running, it will send the new announcements to the whatsapp group, then it will close.
