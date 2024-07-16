const puppeteer = require('puppeteer');
//const fs = require('fs');

function delay(time){
    return new Promise(function(resolve){
        setTimeout(resolve, time);
    });
}
async function sendWhatsAppMessage(data, waitTime) {
    const message = data.message;
    let phoneNos=data.phoneNos;

    //Launch a browser instance
    const browser = await puppeteer.launch({
        headless: false, //set to true if you want to run the script in  the background
        defaultViewport: null,
        userDataDir: './myUserDataDir'
    });

    //create a new page
    const page = await browser.newPage();

    //navigate to whatsapp Web
    await page.goto('https://web.whatsapp.com/');

    for (const number of phoneNos) {
        await page.waitForSelector('div[title="Search input textbox"]');
        await page.type('div[title="Search input textbox"]', number, {delay: 0});
        const element = await page.waitForSelector('div.Er7QU');
        const value = await element.evaluate(el => el.textContent);
        (value===number) ?  await page.keyboard.press('Enter') : console.log('error');
        await page.waitForSelector('div.fd365im1[title="Type a message"]');
        await page.type('div.fd365im1[title="Type a message"]', message, {delay: 0});
        await page.keyboard.press('Enter');
        const ele = await page.waitForSelector('div[title="Search input textbox"]');
        await ele.evaluate(elem => elem.textContent = '');
        await delay(waitTime);
    }

    await page.close();

    //close the browser
    await browser.close();
    return 'Message: "'+message+'" sent to '+ phoneNos;

    //await page.click('div[title="'+ number +'"]', {delay: 500});
}

async function sendWhatsappMedia(data, waitTime){
    const media = data.media;
    let phoneNos=data.phoneNos;

    //Launch a browser instance
    const browser = await puppeteer.launch({
        headless: false, //set to true if you want to run the script in  the background
        defaultViewport: null,
        userDataDir: './myUserDataDir'
    });

    //create a new page
    const page = await browser.newPage();

    //navigate to whatsapp Web
    await page.goto('https://web.whatsapp.com/');

    for(const number of phoneNos){
        await page.waitForSelector('div[title="Search input textbox"]');
        await page.type('div[title="Search input textbox"]', number, {delay: 0});
        const element = await page.waitForSelector('div.Er7QU');
        const value = await element.evaluate(el => el.textContent);
        (value===number) ?  await page.keyboard.press('Enter') : console.log('error');
        await page.waitForSelector('div._3ndVb[title="Attach"]');
        await page.click('div._3ndVb[title="Attach"]', {delay: 500});
        await page.waitForSelector('div._2ZCpJ');
        await page.waitForSelector('div._8JAXG');
        await page.waitForSelector('ul._3bcLp');
        await page.waitForSelector('li.Iaqxu.FCS6Q._1LsXI');
        //await page.waitForSelector('button._1CGek');
        await page.waitForSelector('button._1CGek');
        await page.click('button._1CGek', {delay: 500});
    }
}

async function sendWhatsappFile(data, waitTime){
    const file = data.file;
    let caption = data.caption;
    let phoneNos = data.phoneNos;

    //Launch a browser instance
    const browser = await puppeteer.launch({
        headless: false, //set to true if you want to run the script in  the background
        defaultViewport: null,
        userDataDir: './myUserDataDir'
    });

    //create a new page
    const page = await browser.newPage();

    //navigate to whatsapp Web
    await page.goto('https://web.whatsapp.com/');
    for (const number of phoneNos) {
        //await page.waitForSelector('div[title="New chat"]');
        
        await page.waitForSelector('div.Er7QU[title="Search input textbox"]');
        await page.type('div.Er7QU[title="Search input textbox"]', number, {delay: 0});
        const element = await page.waitForSelector('div.Er7QU');
        const value = await element.evaluate(el => el.textContent);
        (value===number) ?  await page.keyboard.press('Enter') : console.log('error');
        await page.waitForSelector('div._3ndVb[title="Attach"]');
        await page.click('div._3ndVb[title="Attach"]', {delay: 0});
        await page.waitForSelector('div._2ZCpJ');
        await page.waitForSelector('div._8JAXG');
        await page.waitForSelector('ul._3bcLp');
        await page.waitForSelector('li.Iaqxu.FCS6Q._1LsXI[data-testid="mi-attach-document"]');
        const elem = await page.waitForSelector('li.Iaqxu.FCS6Q._1LsXI[data-testid="mi-attach-document"] button._1CGek input[type="file"]');
        await elem.uploadFile(file);
        await delay(500);
        //await page.waitForSelector('li.Iaqxu.FCS6Q._1LsXI[data-testid="mi-attach-document"] button._1CGek');
        //await page.click('li.Iaqxu.FCS6Q._1LsXI[data-testid="mi-attach-document"] button._1CGek', {delay: 500});
        await page.waitForSelector('p.iq0m558w');
        await page.type('p.iq0m558w', caption, {delay: 0});
        await page.click('div[aria-label="Send"]', {delay: 0});
        await delay(waitTime);
    }
    await page.close();
    
    //close the browser
    await browser.close();
    return 'File is sent to '+ phoneNos;
}

module.exports = {
    sendText: sendWhatsAppMessage,
    sendMedia: sendWhatsappMedia,
    sendFile: sendWhatsappFile
}

//sendWhatsAppMessage(data);
const data = {
    'file': 'files/upload1.pdf',
    'caption': 'The pdf is posted',
    'phoneNos': ['7783047335', '7783047335']
};
sendWhatsappFile(data, 5000);




