const puppeteer = require('puppeteer');


function delay(time){
    return new Promise(function(resolve){
        setTimeout(resolve, time);
    });
}

async function send(type, data, waitTime){
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
    //menu bar check
    await page.waitForSelector('div._3OtEr[data-testid="menu-bar-menu"]');
    await page.click('div._3OtEr[data-testid="menu-bar-menu"] div._3ndVb[role="button"]', {delay: 500});
    await page.waitForSelector('li.Iaqxu.FCS6Q.jScby[data-testid="mi-logout menu-item"]');
    await delay(1000);
    //close the page
    await page.close();
    //close the browser
    await browser.close();
    let response='';
    if(type==='text'){
        response = await sendWhatsAppMessage(data, waitTime);
    }
    else if(type==='image'){
       response = await sendWhatsappImage(data, waitTime);
    }
    else if(type==='file'){
        response = await sendWhatsappFile(data, waitTime);
    }
    return response;
}

async function sendWhatsAppMessage(data, waitTime) {
    const message = data.message;
    let phoneNos=data.phoneNos;
    //Launch a browser instance
    const browser = await puppeteer.launch({
        headless: true, //set to true if you want to run the script in  the background
        defaultViewport: null,
        userDataDir: './myUserDataDir'
    });
    //create a new page
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36');
    //navigate to whatsapp Web
    await page.goto('https://web.whatsapp.com/');
    for (const number of phoneNos) {
        await page.waitForSelector('div[title="Search input textbox"]');
        await page.type('div[title="Search input textbox"]', number, {delay: 0});
        const element = await page.waitForSelector('div.Er7QU');
        const value = await element.evaluate(el => el.textContent);
        console.log(value);
        (value===number) ?  await page.keyboard.press('Enter') : console.log('error');
        await page.waitForSelector('div.fd365im1[title="Type a message"]');
        await page.type('div.fd365im1[title="Type a message"]', message, {delay: 0});
        await page.keyboard.press('Enter');
        const ele = await page.waitForSelector('div[title="Search input textbox"]');
        await ele.evaluate(elem => elem.textContent = '');
        await delay(waitTime);
    }
    //close the page
    await page.close();
    //close the browser
    await browser.close();
    return 'Message: "'+message+'" sent to '+ phoneNos;
    //console.log();
}

async function sendWhatsappImage(data, waitTime){
    const media = data.media;
    const caption = data.caption;
    let phoneNos = data.phoneNos;
    await delay(3000);
    //launch a browser instance
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        userDataDir: './myUserDataDir'
    });
    //create a new page
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36');
    //navigate to whatsapp web
    await page.goto('https://web.whatsapp.com/');
    //await delay(1000);
    for (const number of phoneNos) {
        await page.waitForSelector('div[title="Search input textbox"]');
        await page.type('div[title="Search input textbox"]', number, {delay: 0});
        const element = await page.waitForSelector('div.Er7QU');
        const value = await element.evaluate(el => el.textContent);
        console.log(value);
        (value===number) ?  await page.keyboard.press('Enter') : console.log('error');
        await page.waitForSelector('div._3ndVb[title="Attach"]');
        await page.click('div._3ndVb[title="Attach"]', {delay: 0});
        await page.waitForSelector('div._2ZCpJ');
        await page.waitForSelector('div._8JAXG');
        await page.waitForSelector('ul._3bcLp');
        await page.waitForSelector('li.Iaqxu.FCS6Q._1LsXI[data-testid="mi-attach-media"]');
        await page.hover('li.Iaqxu.FCS6Q._1LsXI[data-testid="mi-attach-media"]');
        const elementHandle = await page.waitForSelector('li.Iaqxu.FCS6Q._1LsXI[data-testid="mi-attach-media"] button._1CGek input[accept="image/*,video/mp4,video/3gpp,video/quicktime"]');
        elementHandle.uploadFile(media);
        //add caption
        await page.waitForSelector('p.selectable-text.copyable-text.iq0m558w');
        await page.waitForSelector('p.selectable-text.copyable-text.iq0m558w');
        await page.type('p.selectable-text.copyable-text.iq0m558w', caption, {delay: 0});
        const captionEle = await page.waitForSelector('p.selectable-text.copyable-text.iq0m558w span.selectable-text.copyable-text');
        const captionVal = await captionEle.evaluate(elem => elem.textContent);
        (captionVal==caption) ? await page.click('span[data-testid="send"]', {delay: 0}) : console.log('Caption Error');
        const repeatele = await page.waitForSelector('div[title="Search input textbox"]');
        await repeatele.evaluate(elem => elem.textContent = '');
        await delay(waitTime);
    }
    
    //close the page
    await page.close();
    //close the browser
    await browser.close();
    /*const newdte = new Date();
    const stop = newdte.getTime();
    console.log((stop/1000));
    console.log('Difference is: '+(stop/1000)-startSec);*/
    return 'image sent to '+phoneNos;
    //console.log();
}

//send File
async function sendWhatsappFile(data, waitTime){
    const file = data.file;
    let caption = data.caption;
    let phoneNos = data.phoneNos;
    //Launch a browser instance
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        userDataDir: './myUserDataDir'
    });
    //create a new page
    const page =await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36');
    //navigate to whatsapp web
    await page.goto('https://web.whatsapp.com/');
    for(const number of phoneNos){
        await page.waitForSelector('div[title="Search input textbox"]');
        await page.type('div[title="Search input textbox"]', number, {delay: 0});
        const element = await page.waitForSelector('div.Er7QU');
        const value = await element.evaluate(el => el.textContent);
        console.log(value);
        (value===number) ?  await page.keyboard.press('Enter') : console.log('error');
        await page.waitForSelector('div._3ndVb[title="Attach"]');
        await page.click('div._3ndVb[title="Attach"]', {delay: 0});
        await page.waitForSelector('div._2ZCpJ');
        await page.waitForSelector('div._8JAXG');
        await page.waitForSelector('ul._3bcLp');
        await page.waitForSelector('li.Iaqxu.FCS6Q._1LsXI[data-testid="mi-attach-document"]');
        await page.hover('li.Iaqxu.FCS6Q._1LsXI[data-testid="mi-attach-document"]');
        const elementHandle = await page.waitForSelector('li.Iaqxu.FCS6Q._1LsXI[data-testid="mi-attach-document"] button._1CGek input[type="file"]');
        elementHandle.uploadFile(file);
        //add caption
        await delay(2000);
        await page.waitForSelector('p.iq0m558w');
        await page.type('p.iq0m558w', caption, {delay: 500});
        //const captionEle = await page.waitForSelector('p.iq0m558w span.selectable-text.copyable-text');
        //const captionVal = await captionEle.evaluate(elem => elem.textContent);
        //(captionVal==caption) ? await page.click('div[aria-label="send"]', {delay: 0}) : console.log('Caption Error');
        await page.click('div[aria-label="Send"]', {delay: 0});
        const repeatele = await page.waitForSelector('div[title="Search input textbox"]');
        await repeatele.evaluate(elem => elem.textContent = '');
        await delay(waitTime);
    }
    await page.close();
    //close the browser
    await browser.close();
    /*const newdte = new Date();
    const stop = newdte.getTime();
    console.log((stop/1000));*/
    return 'File is sent to '+phoneNos;
    //console.log('File is sent to '+phoneNos);
}

module.exports = {
    //sendText: sendWhatsAppMessage,
    //sendImage: sendWhatsappImage,
    //sendFile: sendWhatsappFile
    send: send
}

//sendWhatsAppMessage(data);

/*const data = {
    'file': './files/screenrecording.mov',
    'caption': 'link this pic',
    'phoneNos': ['917783047335', '917783047335']
};

send('file', data, 5000);*/