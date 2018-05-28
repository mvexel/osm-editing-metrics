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
const base_year = 2004; // year to start counting
// create osmium reader and handler
var reader = new osmium.Reader(infile, {way: true});
var handler = new osmium.Handler();

function get_date_index(timestamp=(+ new Date())) {
    const date = new Date(timestamp);
    return (date.getFullYear() - base_year) * 12 + date.getMonth();
}

// way handler
handler.on('way', function(way) {
    const t = way.timestamp_seconds_since_epoch * 1000;
    // skip if date is before our base year
    if (new Date(t).getFullYear() < base_year) return;
    // we need to handle ways being deleted separately since they don't have any tags
    if (!way.visible) {
        if (matching_ways_ids.indexOf(way.id) != -1) --hist[get_date_index(t)];
    }
    if (way.version === 1) {
        // a new way
        ++ways;
        // get tags
        const tags = way.tags();
        if (way.tags('highway')) {
            // a highway, count it
            ++hist[get_date_index(t)];

            // because disappearing ways (visible=false) don't have their tags anymore
            // we need to keep a list of ways that match so we can track those
            // that are deleted.
            if (matching_ways_ids.indexOf(way.id) === -1) matching_ways_ids.push(way.id);
        }
    }
});

// declare data variable
var ways = 0;
var matching_ways_ids = [];
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