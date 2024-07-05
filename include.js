const fs = require("fs")
const get_data_url = (folder, file) => {
	const content = fs.readFileSync(folder + file, "base64")
	const extension = file.split(".").pop()
	const type = {
		css: "text/css",
		gif: "image/gif",
		html: "text/html",
		jpg: "image/jpeg",
		png: "image/png",
	}[extension]
	if (extension == "html") {
		return atob(content).replace(/\n/g, "\\n")//.replace(/\t/g, "")
	}
	else if (extension == "css") {
		return atob(content).replace(/[\n\s]+/g, " ")
	}
	if (type) {
		return `data:${type};base64,${content}`
	}
	return atob(content)
	// console.error(folder + file + " type is missing missing")
}
const array_swap = (array, ia, ib) => {
	const temp = array[ia]
	array[ia] = array[ib]
	array[ib] = temp
}
const replace_data_url = (folder, content) => {
	return content.replace(/_include\(([^)]*)\)/g, (match, file) => {
		return get_data_url(folder, file)
	})
}
const replace = (input, search, replacement) => {
	return input.split(search).join(replacement)
}
const get_paths = (folder) => {
	return Bun.spawnSync(["ls", folder]).stdout.toString().split(/\s+/).filter(Boolean)
}
const folders = [process.argv[2], "src/shared/"]
const files = {}
for (const i in folders) {
	const folder = folders[i]
	const paths = get_paths(folder)
	for (const i in paths) {
		const file = {}
		const content = fs.readFileSync(folder + paths[i], "utf8")
		const match = content.match(/const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/)
		if (match) {
			const name = match[1]
			files[name] = replace(content, name, "_" + name)
			files[name] = replace_data_url(folder, files[name])
			files[name] = replace_data_url(folder, files[name]) // level 2 recursion
		}
	}
}
for (const name in files) {
	if (name != "Env") {
		console.log(files[name])
	}
}
console.log(files["Env"])