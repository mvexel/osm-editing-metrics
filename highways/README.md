# Highway Scripts

**These scripts require a full history file to report accurate results.**

## highway_history.js

Generates month-by-month counts of new highways (`highway=*`) added:

```
[...,0,29714,185,842,3,0,0,424,0,0,1847,1,1021,5693,47787,760,...]
```

The first index in this array represents January, 2004. This is defined in the `base_year` variable.

## residential_history.js

Expands on the generic `highway_history` script. Generates month-by-month counts of new / changed / deleted residential roads (`highway=residential`):

```
[[362,196,531,238,192,105,174,73,184,246,...],
[1952,2135,739,532,579,325,525,517,358,641,552,...],
[7,4,11,13,21,11,8,4,9,28,57,64,20,7,12,4,23,43,...]]
```

You can set the `highway_type` and `base_year` in the script to perform different counts.