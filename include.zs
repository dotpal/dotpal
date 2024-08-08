release = process.argv[1] is "release"

fs = require("fs")

get_type = function(path) {
	return path.split(".").pop()
}

replace_data_url = function(type, folder, content) {
	return content.replace(/\.\/([^<>\s'"\)`]+)(?=[<>\s'"\`)])/g, function(match, include_path) {
		soft content = nil
		try {
			old content = fs.readFileSync(folder .. include_path, "base64")
		}
		catch {}
		if not content {
			return
		}

		include_type = get_type(include_path)

		mime = {
			css: "text/css",
			gif: "image/gif",
			html: "text/html",
			jpg: "image/jpeg",
			png: "image/png",
		}[include_type]

		if include_type is "html" {
			return atob(content).replace(/\n/g, "\\n")//.replace(/\t/g, "")
		}

		if include_type is "css" {
			return atob(content).replace(/[\n\s]+/g, " ")
		}

		if include_type is "png" or include_type is "jpg" {
			return `url(data:${mime};base64,${content})`
		}

		if mime {
			return `data:${mime};base64,${content}`
		}

		if true {
			return atob(content)
		}
	})
}

replace = function(input, search, replacement) {
	return input.split(search).join(replacement)
}

get_paths = function(folder) {
	return Bun.spawnSync(["dir", folder]).stdout.toString().split(/\s+/).filter(Boolean)
}

folders = [process.argv[2], "src/shared/"]

files = {}
for i in folders {
	folder = folders[i]
	paths = get_paths(folder)
	for i in paths {
		file = {}
		path = folder .. paths[i]
		content = fs.readFileSync(path, "utf8")
		type = get_type(path)
		match = content.match(/const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/)
		if match {
			name = match[1]
			files[name] = replace(content, name, "_" .. name)
			files[name] = replace_data_url(type, folder, files[name]) or files[name]
			files[name] = replace_data_url(type, folder, files[name]) or files[name] // level 2 recursion
		}
	}
}

for name in files {
	if name isnt "Env" {
		console.log(files[name])
	}
}

console.log(files["Env"])