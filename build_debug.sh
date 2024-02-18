#build_debug.sh
printf '<!doctype html><body style=margin:0><link rel=stylesheet href=styles.css>' > index.html
printf '<script>' >> index.html
cat client.js >> index.html
printf '</script>' >> index.html
node server.js