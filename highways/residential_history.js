/*
residential_history
===================
Takes an OSM full history data file,
and counts new / changed / deleted residential
highways month by month.

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

// user variables
const base_year = 2011; // year to start counting
const highway_type = 'residential'; // highway type to count

function get_month_index(timestamp=(+ new Date())) {
    // returns the month array index for a given timestamp
    const date = new Date(timestamp);
    return (date.getFullYear() - base_year) * 12 + date.getMonth();
}

handler.on('way', function(way) {
    // way handler
    ++ways;
    // get timestamp for object
    const t = way.timestamp_seconds_since_epoch * 1000;
    // skip if date is before our base year
    if (new Date(t).getFullYear() < base_year) return;
    // we need to handle ways being deleted separately since they don't have any tags
    if (!way.visible) {
        // add to deleted history if same way id matched desired type originally 
        if (matching_ways_ids.indexOf(way.id) != -1) ++hist_deleted[get_month_index(t)];
    }
    const tags = way.tags();
    if (way.tags('highway') === highway_type) {
        // because disappearing ways (visible=false) don't have their tags anymore
        // we need to keep a list of ways that match so we can track those
        // that are deleted.
        if (matching_ways_ids.indexOf(way.id) === -1) matching_ways_ids.push(way.id);
        way.version === 1 ? ++hist_new[get_month_index(t)] : ++hist_changed[get_month_index(t)];
    }
});

// declare data variables
var ways = 0;
var matching_ways_ids = [];
var hist_new = new Array(get_month_index() + 1).fill(0);
var hist_changed = new Array(get_month_index() + 1).fill(0);
var hist_deleted = new Array(get_month_index() + 1).fill(0);

// run file through osmium
osmium.apply(reader, handler);

// final console output
console.log('ways: ' + ways);
console.log('residential ways: ' + matching_ways_ids.length);

// write out the users json file
// use this for pretty instead
// fs.writeFile(outfile, JSON.stringify(hist, null, 2), 'utf8', function(err) {
fs.writeFile(outfile, JSON.stringify(
    [hist_new, hist_changed, hist_deleted]),
    'utf8', 
    function(err) {
        console.log(err ? 'file could not be written' : 'saved')
    });