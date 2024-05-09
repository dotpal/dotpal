# client
printf "<!doctype html><body><script>'use strict'\n" > build/index.html
bun include.js src/client/ >> build/index.html
printf '</script>' >> build/index.html
# server
printf "'use strict'\n" > build/server.js
bun include.js src/server/ >> build/server.js