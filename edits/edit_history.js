/*
highway_history
===============
Takes an OSM full history data file,
and counts edits month by month.
*/

var osmium = require('osmium');
const fs = require('fs');

// get input file from argv
const infile = process.argv[2];
const outfile = process.argv[3];
const base_year = 2004; // year 0
// create osmium reader and handler
var reader = new osmium.Reader(infile);
var handler = new osmium.Handler();

function get_date_index(timestamp=(+ new Date())) {
    const date = new Date(timestamp);
    const base_year = 2004; // year 0
    return (date.getFullYear() - base_year) * 12 + date.getMonth();
}

function process_osm_obj(osmobj, osmtype) {
    const t = osmobj.timestamp_seconds_since_epoch * 1000;
    // skip if date is before our base year
    if (new Date(t).getFullYear() < base_year) return;
    ++edit_history[get_date_index(t)];
    ++edits;
}

// node handler
handler.on('node', function(node) {
    ++nodes;
    process_osm_obj(node, 'node');
});

// way handler
handler.on('way', function(way) {
    ++ways;
    process_osm_obj(way, 'way');
});

// relation handler
handler.on('relation', function(relation) {
    ++relations;
    process_osm_obj(relation, 'relation');
});

// declare data variable
var nodes = 0;
var ways = 0;
var relations = 0;
var edits = 0;
var edit_history = new Array(get_date_index() + 1).fill(0);

// run file through osmium
osmium.apply(reader, handler);

// final console output
console.log('nodes: ' + nodes);
console.log('ways: ' + ways);
console.log('relations: ' + relations);
console.log('edits: ' + edits);

// write out the users json file
// use this for pretty instead
// fs.writeFile(outfile, JSON.stringify(edit_history, null, 2), 'utf8', function(err) {
fs.writeFile(outfile, JSON.stringify(edit_history), 'utf8', function(err) {
	if (err) {
		console.log('file could not be written');
	}
	console.log('saved');
});