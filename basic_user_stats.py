#!/usr/bin/env python3

# This file is provided for reference / educational
# purposes. I used it to compare performance between
# the osmium Node and Python bindings. Compare to the
# Javascript version for an example of how to implement
# this in JS vs Python

import osmium
import sys
import os
import json
import datetime


class UserStatsHandler(osmium.SimpleHandler):

    def __init__(self):
        osmium.SimpleHandler.__init__(self)

        # init counter ints and user dict
        self.nodes = 0
        self.ways = 0
        self.relations = 0
        self.users = {}

    def process_osm_obj(self, osmobj, osmtype):
        """extract salient metadata from OSM objects passing by and store in global variables"""

        # get user name
        user = osmobj.user

        if user in self.users:
            # user exists, adjust first / last seen dates
            self.users[user]["first"] = min(self.users[user]["first"], osmobj.timestamp)
            self.users[user]["last"] = max(self.users[user]["last"], osmobj.timestamp)
        else:
            # user is new, declare its object and add to users
            self.users[user] = {
                "node": 0,
                "way": 0,
                "relation": 0,
                "first": osmobj.timestamp,
                "last": osmobj.timestamp,
            }
        # increment edit count
        self.users[user][osmtype] += 1

    def postprocess_users(self):
        # add convenience metrics to users
        for user in self.users:
            self.users[user]["last"] = self.users[user]["last"].timestamp()
            self.users[user]["first"] = self.users[user]["first"].timestamp()
            self.users[user]["age"] = self.users[user]["last"] - self.users[user]["first"]
            self.users[user]["total"] = (
                self.users[user]["node"] + self.users[user]["way"] + self.users[user]["relation"]
            )

    def node(self, n):
        self.nodes += 1
        self.process_osm_obj(n, "node")

    def way(self, w):
        self.ways += 1
        self.process_osm_obj(w, "way")

    def relation(self, r):
        self.relations += 1
        self.process_osm_obj(r, "relation")


if __name__ == "__main__":
    # get input file from argv
    infile = sys.argv[1]
    outfile = sys.argv[2]
    # create osmium handler object
    h = UserStatsHandler()
    # run file through osmium
    h.apply_file(infile)

    # add convenience metrics for each user
    h.postprocess_users()

    # final console output
    print("nodes: %d" % h.nodes)
    print("ways: %d" % h.ways)
    print("relations: %d" % h.relations)
    print("users: %d" % len(h.users))

    # write out the users json file
    with open(outfile, "w") as fh:
        fh.write(json.dumps(h.users, indent=2))
