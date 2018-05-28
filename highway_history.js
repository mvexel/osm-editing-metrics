/*
highway_history
===============
Takes an OSM full history data file,
and counts new highways added month by month.

For quicker processing pre-filter your data file 
using the the osmium command line tool
*/

var osmium = require('osmium');
const fs = require('fs');

// get input file from argv
const infile = process.argv[2];
const outfile = process.argv[3];
// create osmium reader and handler
var reader = new osmium.Reader(infile, {way: true});
var handler = new osmium.Handler();

function get_date_index(timestamp=(+ new Date())) {
    const date = new Date(timestamp);
    const base_year = 2004; // year 0
    return (date.getFullYear() - base_year) * 12 + date.getMonth();
}

// way handler
handler.on('way', function(way) {
    if (way.version === 1) {
        ++ways;
        const tags = way.tags();
        if ('highway' in tags) {
            const t = way.timestamp_seconds_since_epoch * 1000;
            way.visible ? ++hist[get_date_index(t)] : --hist[get_date_index(t)];
        }
    }
});

// declare data variable
var ways = 0;
var hist = new Array(get_date_index() + 1).fill(0);

// run file through osmium
osmium.apply(reader, handler);

// final console output
console.log('ways: ' + ways);

// write out the users json file
// use this for pretty instead
// fs.writeFile(outfile, JSON.stringify(hist, null, 2), 'utf8', function(err) {
fs.writeFile(outfile, JSON.stringify(hist), 'utf8', function(err) {
	if (err) {
		console.log('file could not be written');
	}
	console.log('saved');
});