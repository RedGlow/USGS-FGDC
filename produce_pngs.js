var fs = require('fs')
    , gm = require('gm').subClass({
        appPath: 'C:\\Program Files\\GraphicsMagick-1.3.30-Q8\\'
    })
    , path = require('path');

// map indices to filenames
const names = {};
const pushNames = (min, max, dir, prefix) => {
    for (var i = min; i <= max; i++) {
        const abspath = path.resolve('.', dir, `${prefix}${i}.svg`);
        if (fs.existsSync(abspath)) {
            names[i] = abspath;
        }
    }
}
pushNames(601, 686, 'SED_fixedcolor', 'sed');
pushNames(701, 733, 'IGM_fixedcolor', 'igm');

// create dest
const outDir = path.join('.', 'output');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
}

// convert
okResults = 0;
errors = [];
const indices = Object.getOwnPropertyNames(names);
indices.forEach(idx => {
    gm(names[idx])
        .resize(240, 240)
        .write(path.join(outDir, `${idx}.png`), (err) => {
            if (err) {
                errors.push([idx, err]);
            } else {
                okResults++;
            }
            const numProcessed = errors.length + okResults;
            console.log(`${Math.floor(numProcessed * 100 / indices.length)}%...`);

            if (indices.length === numProcessed) {
                if (errors.length === 0) {
                    console.log('All done!');
                } else {
                    console.log(`${errors.length} errors found:`);
                    errors.forEach(([idx, err]) => {
                        console.error(`${idx}:`);
                        console.error(err);
                    });
                }
            }
        });
});