#!/bin/bash
# Usage: ./run-matrix.sh  (needs: python3 -m http.server 8765 in this folder). Writes poc-results.jsonl
OUT=poc-results.jsonl; : > $OUT
for cpu in 4 6; do
 for cfg in "none:full:dash" "css:full:dash" "css:lite:dash" "js:full:dash" "js:full:clip" "js:lite:clip"; do
  IFS=: read v t th <<< "$cfg"
  for run in 1 2 3; do
   node probe.mjs "http://localhost:8765/poc.html?variant=$v&tier=$t&thread=$th" --cpu=$cpu --settle=2500 --label="$v-$t-$th-r$run" 2>/dev/null | tail -1 >> $OUT
  done
 done
done
