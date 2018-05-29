/*
basic_user_stats
===============
Takes an OSM full history data file,
and tallies individual user contributions.
*/

var osmium = require('osmium');
var fs = require('fs');
var turf = require('@turf/turf');

// get input file from argv
const infile = process.argv[2];
const outfile = process.argv[3];
const uid = parseInt(process.argv[4]);

// create osmium reader and handler
var reader = new osmium.Reader(infile, {node: true});
var handler = new osmium.Handler();

// declare data variables
var points = [];

// node handler
handler.on('node', function(o) {
    if (uid === o.uid && o.visible && o.version === 1) points.push(turf.point([o.lon, o.lat]));
});

// run file through osmium
osmium.apply(reader, handler);

//hull
var fc = turf.featureCollection(points);
// var opts = {unit: 'miles', maxEdge: 10};
var hull = turf.convex(fc, {concavity: 100});

// write out the users json file
fs.writeFileSync(outfile, JSON.stringify(hull));
