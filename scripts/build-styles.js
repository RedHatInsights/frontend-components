const fs = require('fs');
const glob = require('glob');
const path = require('path');
const sass = require('sass');
const chokidar = require('chokidar');
const packageImporter = require('node-sass-package-importer');

/**
 * Root path of the current package
 */
const root = process.cwd();
/**
 * get all scss files
 */
const files = glob.sync(`${root}/src/**/*.scss`);

async function buildStyle(file) {
    const outFile = path.resolve(file.split('/src/').pop(), './').replace(/scss$/, 'css');
    let targetDir = outFile.split('/');
    targetDir.pop();
    targetDir = targetDir.join('/').replace(root, '').replace(/^\//, '');

    if (!fs.existsSync(path.resolve(root, targetDir))) {
        fs.mkdirSync(targetDir);
    }

    const render = sass.render({
        file,
        outFile,
        importer: packageImporter()
    }, function(err, result) {
        if (err) {
            console.error(file, outFile);
            throw err;
        }

        return fs.writeFile(outFile, result.css, 'utf8', function(err) {
            if (err) {
                throw err;
            }
        });

    });
    const copy = fs.copyFile(file, outFile.replace(/css$/, 'scss'), function(err) {
        if (err) {
            throw err;
        }
    });
    return Promise.all([ render, copy ]);
}

async function buildStyles(files) {
    const cmds = files.map(buildStyle);
    return Promise.all(cmds);
}

async function run(files) {
    try {
        await buildStyles(files);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

const args = process.argv.slice(2);

if (args.includes('-w') || args.includes('--watch')) {
    console.log(`Watching ${files.length} scss files in: ${root}`);
    const watcher = chokidar.watch(files);
    watcher
    .on('add', path => {
        console.log(`Compiling sass: ${path}`);
        buildStyles([ path ]);
    })
    .on('change', path => {
        console.log(`Compiling sass: ${path}`);
        buildStyles([ path ]);
    });

} else {
    run(files);
}
