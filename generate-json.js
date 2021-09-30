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
    
                res(JSON.parse(str.substr(47).slice(0, -2)));
            })
        }).end();
    });

}

let endData = {};

(async () => {
    for (let sheet of ["Stations", "Platforms", "Amenities"]) {
        let data = await request({
            host: "docs.google.com",
            path: `/spreadsheets/d/1KCrVmLrHPoyrF_7onE10wE8CdloQrHFbOcuzHb51BC8/gviz/tq?tqx=out:json&sheet=${sheet}`
        });
    
        let rows = [];
//        let cellsArray = [...data.feed.entry].filter(cell => cell["gs$cell"].row != '1');
//        for (let cell of cellsArray) {
//            let row = parseInt(cell["gs$cell"].row);
//            if (!rows[row]) rows[row] = [];
//            rows[row][parseInt(cell["gs$cell"].col)] = cell["gs$cell"]["$t"];
//        }
//        console.log(rows);
         rows = data.table.rows.map(rowObject => rowObject.c.map(cell => cell?.v || ""));
         console.log(rows);

        switch (sheet) {
            case "Stations": { //Stations
                endData.stations = rows.reduce((acc, row) => {
                    return {
                        ...acc,
                        [row[0]]: {
                            name: row[1],
                            cx: parseInt(row[3]),
                            cz: parseInt(row[4]),
                            platforms: {}
                        }
                    }
                }, {})
                break;
            }
            case "Platforms": { //Platforms
                rows.forEach(row => {
                    if (row[0] && row[1] && row[2]) endData.stations[row[0]].platforms[row[1]] = {
                        station: row[2],
                        blocks: parseInt(row[5])
                    }
                });
            }
        }
    }

     console.log(endData);
    fs.writeFileSync("data/stations.json", JSON.stringify(endData, null, 4));
})();
