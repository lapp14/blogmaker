const extract = require('extract-zip');
const glob = require('glob');
const path = require('path');
const fs = require('fs-extra');

const DATE = new Date().toISOString();
const DIST_DIR = 'dist';
const TEMP_DIR = 'temp';

const manifest = {
    date: DATE
};

const usage = () => console.log(`Error: Usage is 'node build.js <zip-file>'`);

const _clearFiles = () => fs.rmdirSync(TEMP_DIR, { recursive: true });

const _transformFilename = (filename) => filename
    .replace(/[a-f0-9]{32}/g, '') // remove uuid's
    .replace(/ \//g, '/') // remove spaces before '/'
    .replace(/ \./g, '.') // remove spaces before '.ext'
    .trim()
    .replace(/ /g, '-') // spaces to '-'
    .toLowerCase();


const parseFilepath = (filepath) => {
    const split = filepath.split(' ');
    // remove .* file extensions on non-directories
    const uuid = split[split.length - 1].split('.')[0];
    const extension = split[split.length - 1].split('.')[1];
    const depth = filepath.split('/').length + (extension !== undefined ? 0.5 : 0);


    const pathSplit = filepath.split('/');
    const transformFilename = _transformFilename(pathSplit[pathSplit.length - 1]);
    pathSplit.pop();

    return {
        uuid,
        depth,
        origin: filepath,
        filepath: `${pathSplit.join('/')}/${transformFilename}`,
        extension: extension || null  // explicit null for tests 
    }
};

const _processFiles = (files) => {
    console.log(files);
    const result = []
    files.map((file) => {
        result.push(parseFilepath(file));
    });

    result.sort((a, b) => {
        if (a.depth < b.depth) {
            return 1;
        }
        if (a.depth > b.depth) {
            return -1;
        }

        return 0;
    });

    console.log(result)
    return result;
}

const _renameFiles = (files) => {
    files.forEach((file) => {
        fs.renameSync(file.origin, file.filepath);
    });
};

const _saveManifest = () => {
    fs.writeFileSync(`${TEMP_DIR}/manifest.json`, JSON.stringify(manifest, null, 2));
};

const unzip = async () => {
    const source = process.argv[2];
    if (!source) {
        throw usage();
    }

    console.log(`> Unzipping ${source}`);
    const target = path.join(__dirname, TEMP_DIR);

    try {
        await extract(source, { dir: target })
        console.log('Extraction complete');
    } catch (err) {
        console.error(err)
    }
};

const build = async () => {
    _clearFiles();
    await unzip();

    const files = glob.sync(`${TEMP_DIR}/**/*`);
    const processedFiles = _processFiles(files);
    _renameFiles(processedFiles);
    _saveManifest();
};

if (require.main === module) {
    (async () => build())();
}

module.exports = {
    _transformFilename,
    _processFiles
}