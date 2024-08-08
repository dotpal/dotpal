# client
bun include.js src/client/ > build/index.html
# server
printf '"use strict"\n' > build/dotpal.js
bun include.js src/server/ >> build/dotpal.js
# remove the client
# rm build/index.html