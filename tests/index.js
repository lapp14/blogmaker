const assert = require('assert').strict;
const build = require('../build');

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
    const transformFilename1 = await build._transformFilename('Recipes d23566d16c1f4b2fa999a5bbcd22285f.html');
    assertEqual('it returns a filename in lowercase with no UUID\'s', transformFilename1, 'recipes.html');
    const transformFilename2 = await build._transformFilename('Recipes With Spaces d23566d16c1f4b2fa999a5bbcd22285f.html');
    assertEqual('it returns a filename with spaces converted to dashes', transformFilename2, 'recipes-with-spaces.html');
    const transformFilename3 = await build._transformFilename('Dir with Spaces');
    assertEqual('it returns a dir in lowercase with no UUID\'s and spaces replaced with dashes', transformFilename3, 'dir-with-spaces');


    const processFiles = require('./data/_processFiles.json');
    console.log('When processing files')
    const processFilesResult = build._processFiles(processFiles.fileList);
    assertEqual('it creates the list of files and directories properly', processFilesResult, processFiles.expectedOutput);
})();

