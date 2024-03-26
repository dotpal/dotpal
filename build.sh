# page
printf '<!doctype html><body>' > build/index.html
# client
printf '<script>' >> build/index.html
node recursive_include.js src/ >> build/index.html
printf '</script>' >> build/index.html
# stylesheet
printf '<style>' >> build/index.html
cat src/style.css >> build/index.html
printf '</style>' >> build/index.html
# server
node recursive_include.js src/ > build/server.js