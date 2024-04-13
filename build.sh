# client
printf "<!doctype html><body><script>'use strict'\n" > build/index.html
bun recursive_include.js src/client/ >> build/index.html
printf '</script>' >> build/index.html
# stylesheet
printf '<style>' >> build/index.html
cat src/client/style.css >> build/index.html
printf '</style>' >> build/index.html
# server
printf "'use strict'\n" > build/server.js
bun recursive_include.js src/server/ >> build/server.js