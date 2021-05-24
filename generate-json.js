#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const Url = require('url');

let request = (url) => {
    return new Promise((res, rej) => {
        https.request({
            ...url
        }, response => {
            let str = "";
            response.on('data', chunk => str += chunk);
            response.on('end', () => {
                if (response.statusCode >= 300 && response.statusCode <= 399) {
                    let url = Url.parse(response.headers.location);
                    request({
                        host: url.host,
                        path: url.path
                    }).then(res).catch(rej);
                }
    
                res(JSON.parse(str));
            })
        }).end();
    });

}

let endData = {};

(async () => {
    for (let sheet = 1; sheet < 3; sheet++) {
        let data = await request({
            host: "spreadsheets.google.com",
            path: `/feeds/cells/1KCrVmLrHPoyrF_7onE10wE8CdloQrHFbOcuzHb51BC8/${sheet}/public/full?alt=json`
        });
    
        let rows = [];
        let cellsArray = [...data.feed.entry].filter(cell => cell["gs$cell"].row != '1');
        for (let cell of cellsArray) {
            let row = parseInt(cell["gs$cell"].row);
            if (!rows[row]) rows[row] = [];
            rows[row][parseInt(cell["gs$cell"].col)] = cell["gs$cell"]["$t"];
        }
        console.log(rows);

        switch (sheet) {
            case 1: { //Stations
                endData.stations = rows.reduce((acc, row) => {
                    return {
                        ...acc,
                        [row[1]]: {
                            name: row[2],
                            cx: parseInt(row[3]),
                            cz: parseInt(row[4]),
                            platforms: {}
                        }
                    }
                }, {})
                break;
            }
            case 2: { //Platforms
                rows.forEach(row => {
                    if (row[1] && row[2] && row[3]) endData.stations[row[1]].platforms[row[2]] = {
                        station: row[3],
                        blocks: parseInt(row[6])
                    }
                });
            }
        }
    }

    fs.writeFileSync("data/stations.json", JSON.stringify(endData, null, 4));
})();