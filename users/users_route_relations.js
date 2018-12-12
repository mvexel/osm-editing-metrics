/*
deleting_users
==============
Takes an OSM full history data file 
and identifies users who delete things.
*/

var osmium = require('osmium');
const fs = require('fs');

// get input file from argv
const infile = process.argv[2];
const outfile = process.argv[3];
const base_year = 2004; // year 0
// create osmium reader and handler
var reader = new osmium.Reader(infile, {relation: true});
var handler = new osmium.Handler();

function process_osm_obj(o) {
    const t = o.timestamp_seconds_since_epoch * 1000;
    // skip if date is before our base year
    if (new Date(t).getFullYear() < base_year) return;
    if (o.tags('route')) o.user in users ? ++users[o.user] : users[o.user] = 1;
}

handler.on('relation', function(relation) {
    process_osm_obj(relation);
});

// declare data variable
var users = {}

// run file through osmium
osmium.apply(reader, handler);

// final console output


// write out the users json file
fs.writeFile(outfile, JSON.stringify(users), 'utf8', function(err) {
	console.log(err ? 'file could not be written' : 'saved')
});