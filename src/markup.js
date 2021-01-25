const { JSDOM } = require('jsdom');
const fs = require('fs-extra');
const { transformFilename } = require('../build');

const openHtmlFile = (filepath) => {
    const file = fs.readFileSync(filepath, 'utf8')
    return new JSDOM(file.toString());
}

const saveHtmlFile = (filepath, dom) => {
    fs.writeFileSync(filepath, dom.window.document.documentElement.outerHTML);
}

const isLinkExternalWebsite = (url) => {
    const reg = /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
    return reg.test(url);
}

const fixLinks = (dom) => {
    const links = dom.window.document.querySelectorAll('a');

    links.forEach((a) => {
        if (!isLinkExternalWebsite(a.href)) {
            a.href = transformFilename(decodeURI(a.href));
        }
    })
};

const processMarkup = (filepath) => {
    const dom = openHtmlFile(filepath);
    fixLinks(dom)
    saveHtmlFile(filepath, dom)
}

module.exports = {
    processMarkup,
    isLinkExternalWebsite
}

// testing
processMarkup('temp/personal-home.html');
