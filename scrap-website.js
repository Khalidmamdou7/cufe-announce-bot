const axios = require('axios');
const fs = require('fs');
const cheerio = require('cheerio');

async function downloadAnnouncements(announcementType, newAnnouncements) {
  const fileDir = `announcements/${announcementType}/`;

  for (const link of newAnnouncements) {
    const fileName = link.split('/').pop();
    console.log(`file_name: ${fileName}`);
    console.log(`Downloading: ${fileName} from: ${link}`);

    const response = await axios.get(link, { responseType: 'arraybuffer' });
    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
    }
    fs.writeFileSync(fileDir + fileName, response.data);
  }
}

function getNewAnnouncements(announcementType, scrapedLinks) {
  const fileName = `${announcementType}_announcements.json`;
  let newAnnouncements = [];

  if (!fs.existsSync(fileName)) {
    console.log('No previous announcements file found');
    fs.writeFileSync(fileName, JSON.stringify(scrapedLinks));
    newAnnouncements = scrapedLinks;
  } else {
    console.log('Previous announcements file found');
    const previousAnnouncements = JSON.parse(fs.readFileSync(fileName));

    console.log(`previous_announcements: ${previousAnnouncements}`);
    for (const link of scrapedLinks) {
      if (!previousAnnouncements.includes(link)) {
        newAnnouncements.push(link);
      }
    }

    console.log(`new_announcements: ${newAnnouncements}`);
    fs.writeFileSync(fileName, JSON.stringify(scrapedLinks));
  }

  return newAnnouncements;
}

function scrapeLinks(announcementsDiv) {
  const anchorTags = announcementsDiv.eq(0).find('a');
  const scrapedLinks = [];

  anchorTags.each((_, anchorTag) => {
    const link = anchorTag.attribs.href;
    console.log(`link: ${link}`);
    scrapedLinks.push(link);
  });

  return scrapedLinks;
}

async function scrapeProgramsAnnouncementsPage() {
  const page = await axios.get('http://eng.cu.edu.eg/en/credit-hour-system/credit-notices-for-students/');
  const $ = cheerio.load(page.data);
  const announcementsDiv = $('.post-content');
  const scrapedLinks = scrapeLinks(announcementsDiv);
  const newAnnouncements = getNewAnnouncements('programs', scrapedLinks);
  await downloadAnnouncements('programs', newAnnouncements);
  return newAnnouncements;
}

async function scrapeMainAnnouncementsPage() {
  const page = await axios.get('http://eng.cu.edu.eg/en/credit-hour-system/');
  const $ = cheerio.load(page.data);
  const announcementsDiv = $('.post-content > div:nth-child(4)');
  const scrapedLinks = scrapeLinks(announcementsDiv);
  const newAnnouncements = getNewAnnouncements('main', scrapedLinks);
  await downloadAnnouncements('main', newAnnouncements);
  return newAnnouncements;
}

// console.log('Scraping announcements');
// scrapeMainAnnouncementsPage();
// scrapeProgramsAnnouncementsPage();
module.exports = {
    scrapeMainAnnouncementsPage,
    scrapeProgramsAnnouncementsPage
};
