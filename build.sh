printf "<!doctype html><body style=margin:0><link rel=stylesheet href=styles.css><script>$(terser client.js --mangle --compress passes=8 --ie8 --toplevel | tr '"' '`')</script>" > index.html
