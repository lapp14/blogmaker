const assert = require('assert').strict;
const build = require('../build');
const markup = require('../src/markup');

const assertEqual = (message, result, expected) => {
    try {
        assert.deepEqual(result, expected);
        console.log(`PASS: ${message}`);
    } catch (err) {
        console.log(err);
    }
}

(async () => {

    console.log('When passing html filepath from the source directory')
    const transformFilename1 = await build.transformFilename('Recipes d23566d16c1f4b2fa999a5bbcd22285f.html');
    assertEqual('it returns a filename in lowercase with no UUID\'s', transformFilename1, 'recipes.html');
    const transformFilename2 = await build.transformFilename('Recipes With Spaces d23566d16c1f4b2fa999a5bbcd22285f.html');
    assertEqual('it returns a filename with spaces converted to dashes', transformFilename2, 'recipes-with-spaces.html');
    const transformFilename3 = await build.transformFilename('Dir with Spaces');
    assertEqual('it returns a dir in lowercase with no UUID\'s and spaces replaced with dashes', transformFilename3, 'dir-with-spaces');


    const processFiles = require('./data/_processFiles.json');
    console.log('When processing files')
    const processFilesResult = build._processFiles(processFiles.fileList);
    assertEqual('it creates the list of files and directories properly', processFilesResult, processFiles.expectedOutput);

    /* src/markup.js */
    console.log('When testing links to see if they are external')
    const externalUrls = ["http://www.sample.com", "https://www.sample.com/", "https://www.sample.com#", "http://www.sample.com/xyz", "http://www.sample.com/#xyz", "www.sample.com", "www.sample.com/xyz/#/xyz", "sample.com", "sample.com?name=foo", "http://www.sample.com#xyz", "http://www.sample.c"];
    externalUrls.forEach(url => assertEqual(`url ${url} returns true`, markup.isLinkExternalWebsite(url), true));
    console.log('When testing links to see if they are internal')
    const internalUrls = ['movie-list.html', '/personal-home/recipes.html', '../personal-home/yearly-goals.html'];
    externalUrls.forEach(url => assertEqual(`url ${url} returns false`, markup.isLinkExternalWebsite(url), false));
})();

