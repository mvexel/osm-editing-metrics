## basic_user_stats.js

Generates basic user metrics. 

The output looks like this (prettified):

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

The `edit_history` shows the number of edits in a given month. 

The first index in this array represents January, 2004. This is defined in the `base_year` variable.
