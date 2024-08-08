# Translate everything into ZaScript
bun translate.js

# Build the client
bun include.js src/client/ > build/index.html

# Build the server
printf '"use strict"\n' > build/dotpal.js
bun include.js src/server/ >> build/dotpal.js

# Remove the client build (commented out as it's not currently executed)
# rm build/index.html