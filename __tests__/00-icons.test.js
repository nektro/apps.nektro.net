/**
 */
//
const fs = require("fs");

//
const PUBLISHED_APPS = [
    "news",
    "camera",
    "calculator",
    "compass",
    "music",
    "gamepad",
    "clock",
    "maps",
];
const THEMES = [
    "dusk",
    "color",
    "1em",
    "ultraviolet",
    "nolan",
];

//
for (const app of PUBLISHED_APPS) {
    describe(`${app}`, () => {
        for (const th of THEMES) {
            test(`contains the icon for ${th}`, done => {
                const file = (`${__dirname}/../src/${app}/icons/${th}.png`);
                fs.access(file, fs.constants.F_OK, (err) => {
                    if (err) {
                        expect(true).toBeFalsy();
                    }
                    else {
                        expect(false).toBeFalsy();
                    }
                    done();
                });
            });
        }
    });
}
