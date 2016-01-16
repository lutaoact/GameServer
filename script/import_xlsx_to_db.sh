#!/bin/bash
perl script/xlsx2json.pl "$@" && node script/import_json_to_db.js
