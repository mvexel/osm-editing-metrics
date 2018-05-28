# OSM User metrics

This is a growing suite of node-osmium scripts that extract meaningful user activity data out of an OSM data file.

This is the spiritual successor to OSMQualityMetrics.

## Scripts

### basic_user_stats.js

Generates basic user metrics. The output looks like this (prettified):

```
{
  "osm_username": {
    "node": 4572,
    "way": 116,
    "relation": 0,
    "first": 1312970358,
    "last": 1377240309,
    "age": 64269951,
    "total": 4688
  },
  ...
}
```

### enhanced_user_stats.js

Generates user metrics enhanced with number of edits per month:

```
{
  "osm_username": {
    "node": 720,
    "way": 4,
    "relation": 0,
    "first": 1398935191,
    "last": 1398935522,
    "edit_history": [
      10,
      0,
      0,
      22,
      2,
      7,
      ...]
  },
  ...
}
```

The `edit_history` shows the number of edits in a given month. The first index in this array is January, 2004.

## Usage

```
npm install
node basic_user_stats.js INFILE OUTFILE
```

## Performance

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