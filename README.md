# OSM User metrics

This is a growing suite of node-osmium scripts that extract meaningful user activity data out of an OSM data file.

This is the spiritual successor to [OSMQualityMetrics](https://github.com/mvexel/OSMQualityMetrics).

## Scripts

* `edits/` -- scripts for generic editing metrics
* `users/` -- scripts for user-centered metrics
* `highways/` -- scripts for highway-specific metrics 

See the `README`s in each directory for more detail.

To write your own, use `script_template.js` in the root directory as a starting point.

## Usage

Requires `node-osmium` and the osmium library. See the [node-osmium README](https://github.com/osmcode/node-osmium) for install instructions / caveats. 

Each script can be run as follows:

`node script_name.js INFILE OUTFILE`

* The scripts take any OSM map data file that node-osmium will accept. (I only tested it with PBF files.)
* The output is JSON
* Meaningful results can only be obtained using non-anonymized OSM data files like the ones found [here](https://osm-internal.download.geofabrik.de)
* For complete editing history, use full history files. Interpret the results based on the file type used!

## Contributing

Certainly! Use `script_template.js` to start writing your own scripts, and submit a pull request with your results.

## Notes on Performance

These scripts are not designed for or tested on huge OSM data files. You are likely to run into performance and / or memory issues if you would run some of these scripts on the entire planet. You are of course most welcome to try, and contribute improvements!

On a 2.3 GHz Intel Core i7 2013 Macbook Pro:

```
$ time node enhanced_user_stats.js in.osh.pbf out/enhanced.json
nodes: 13586051
ways: 1127252
relations: 18493
users: 3358
saved

real	0m25.426s
user	0m29.714s
sys	0m0.613s
```

where in.osh.pbf is a 116MB full history PBF file for Utah, USA.