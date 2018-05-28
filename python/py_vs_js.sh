#!/bin/sh

# Compare performance bewteen Node vs Python bindings.

echo 'JS'
time node ../basic_user_stats.js ~/Downloads/eritrea-latest-internal.osm.pbf out/out-js.json

echo
echo 'PY'
time ./basic_user_stats.py ~/Downloads/eritrea-latest-internal.osm.pbf out/out-py.json
