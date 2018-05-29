/*
Template
========
Do you want to write your won script? Use this template!
*/

// Import the required modules
//
// * osmium for the OSM logic
// * fs for writing the output to the filesystem
// If you need to use other modules like turf, import them here.
var osmium = require('osmium');
var fs = require('fs');

// Process any command line parameters
//
// The first user-provided argument has index 2
// The convention for these scripts is
// node script.js INFILE OUTFILE ...other arguments...
// So we store the value of argv[2] into infile
// and the value of argv[3] into outfile
const infile = process.argv[2];
const outfile = process.argv[3];

// User variables
// 
// These variables control the output. Anything you
// want the user to be able to tweak should go in this
// section.
const base_year = 2004; // year to start counting

// Create osmium Reader and Handler
//
// This is where we tell Osmium to set itself up
// using a file Reader object and a Handler to process
// the file. Nothing happens yet.
var reader = new osmium.Reader(infile, {way: true});
// If you only want to read specific osm types, you can add
// an option object like below.
// This can improve processing speed significantly.
// var reader = new osmium.Reader(infile, {way: true});
var handler = new osmium.Handler();

// Function to get the date index
//
// In many scripts, yoy want a time series output.
// This function facilitates that by returning a zero-based
// month index calculated from the UNIX timestamp passed in. 
// Say the user set the base_year above at 2013. A timestamp
// representing Jan 12, 2013 would return 0 (the first month).
// A timestamp representing Mar 25, 2015 would return 26.
// If called without arguments, it will return the index for the
// current time.
function get_date_index(timestamp=(+ new Date())) {
    const date = new Date(timestamp);
    return (date.getFullYear() - base_year) * 12 + date.getMonth();
}

// Function to process the object
//
// Use this for the OSM object processing logic if the logic
// is very similar for each type you want to process. You have
// access to the object itself (o) and its type as a string (t).
function process_osm_object(o, t) {
    // Get the object timestamp (ts).
    const ts = way.timestamp_seconds_since_epoch * 1000;
    // Skip if date is before our base year
    if (new Date(t).getFullYear() < base_year) return;
    // 
    // Your code goes here...
    //
    // use o.tags() to get tags, o.user for the OSMusername, etc
}

// Handlers

// Each type of object (node, way, relation) has its own
// handler, even if you want to perform the same function 
// for all object types.
// To streamline your code, call the process_osm_obj() function
// if the code for each object type is (fairly) similar.

// Node handler
handler.on('node', function(node) {
    // 
    // Your code goes here...
    //
    // Call process_osm_object(node, 'node') if you want to use
    // that function for processing.
});

// Way handler
handler.on('way', function(way) {
    // 
    // Your code goes here...
    //
    // Call process_osm_object(way, 'way') if you want to use
    // that function for processing.
});

// Relation handler
handler.on('relation', function(relation) {
    // 
    // Your code goes here...
    //
    // Call process_osm_object(relation, 'relation') if you want to use
    // that function for processing.
});

// Data variables / objects
// 
// Declare and assign any global variables and / or objects 
// that you need to hold / accumulate data when processing.
//
// Counters
var nodes = 0;
var ways = 0;
var relations = 0;
//
// If you want an array to hold a time series, you need to
// initialize it with zeros and with the right size.
// var time_series = new Array(get_date_index() + 1).fill(0);

// Process the file
osmium.apply(reader, handler);

// Any console output after processing
console.log('nodes: ' + nodes);
console.log('ways: ' + ways);
console.log('relations: ' + relations);

// Write the output as JSON
//
// Any JSON serializable output can be written as a file.
// Replace 'data' with the object that holds your serializable
// data.
fs.writeFileSync(outfile, JSON.stringify(data));
// If you want pretty output, replace with this:
// fs.writeFileSync(outfile, JSON.stringify(data));
