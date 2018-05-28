var osmium = require('osmium');
const fs = require('fs');

// get input file from argv
const infile = process.argv[2];
const outfile = process.argv[3];
// create osmium reader and handler
var reader = new osmium.Reader(infile);
var handler = new osmium.Handler();

// declare data variables
var nodes = 0;
var ways = 0;
var relations = 0;
var users = {};

function get_date_index(timestamp=(+ new Date())) {
    const date = new Date(timestamp);
    // console.log(date);
    const base_year = 2004; // year 0
    const y = date.getFullYear();
    const m = date.getMonth();
    // console.log(base_year);
    // console.log(y);
    // console.log(m);
    // console.log((y - base_year) + m);
    return (y - base_year) * 12 + m;
}

function process_osm_obj(osmobj, osmtype) {
    // extract salient metadata from OSM objects passing by and store in global variables
    var user = osmobj.user;
    if (user in users) {
    	// user exists
        // adjust first / last seen dates 
    	users[user]['first'] = Math.min(users[user]['first'], osmobj.timestamp_seconds_since_epoch);
    	users[user]['last'] = Math.max(users[user]['last'], osmobj.timestamp_seconds_since_epoch);
    } else {
    	// user is new
        // declare its object and add to users
        console.log('new');
    	users[user] = {
    		'node': 0, 
    		'way': 0, 
    		'relation': 0, 
    		'first': osmobj.timestamp_seconds_since_epoch, 
    		'last': osmobj.timestamp_seconds_since_epoch,
            'edit_history': new Array(get_date_index()).fill(0)};
    }	
    // increment edit count
    ++users[user][osmtype];
    // increment edit history
    ++users[user]['edit_history'][get_date_index(osmobj.timestamp_seconds_since_epoch * 1000)];
}

function postprocess_users() {
    // add convenience metrics to users
	for (user in users) {
		users[user]['age'] = users[user]['last'] - users[user]['first'];
		users[user]['total'] = users[user]['node'] + users[user]['way'] + users[user]['relation'];
	}
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

// run file through osmium
osmium.apply(reader, handler);

// add convenience metrics for each user
postprocess_users();

// final console output
console.log('nodes: ' + nodes);
console.log('ways: ' + ways);
console.log('relations: ' + relations);
console.log('users: ' + Object.keys(users).length);

// write out the users json file
// use this for pretty instead
// fs.writeFile(outfile, JSON.stringify(users, null, 2), 'utf8', function(err) {
fs.writeFile(outfile, JSON.stringify(users), 'utf8', function(err) {
	if (err) {
		console.log('file could not be written');
	}
	console.log('saved');
});