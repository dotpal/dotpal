printf '<!doctype html><body style=margin:0><link rel=stylesheet href=styles.css>' > src/index.html
printf '<script>' >> src/index.html
cat src/client.js >> src/index.html
printf '</script>' >> src/index.html
node src/server.js