const fs = require("fs")
const path = require("path")

class RegexMutator {
	constructor(initialString) {
		this.string = initialString
	}

	replace(pattern, replacement) {
		this.string = this.string.replace(pattern, replacement)
		return this
	}

	getResult() {
		return this.string
	}
}

function translate_to_js(zs_content) {
	return new RegexMutator(zs_content)
		.replace(/ \.\. /g, " + ")
		.replace(/ not /g, " !")
		.replace(/for (.+) {/g, "for ($1) {")
		.replace(/if (.+) {/g, "if ($1) {")
		.replace(/while (.+) {/g, "while ($1) {")
		.replace(/ isnt /g, " !== ")
		.replace(/ is /g, " === ")
		.replace(/ or /g, " || ")
		.replace(/ and /g, " && ")
		.replace(/soft /g, "let ")
		.replace(/function(.+) {/g, "$1 => {")
		.replace(/(?<=^|	)(\w+) = /gm, "const $1 = ")
		.replace(/(?<=^|\s)(\[.*?\])\s*=\s*(.*)/g, "const $1 = $2")
		.replace(/nil/g, "undefined")
		.replace(/old (\w+) = /gm, "$1 = ")
		.replace(/((\w+) of .+)/gm, "const $1")
		.replace(/((\w+) in .+)/gm, "const $1")
		.getResult()
}

function printJsFiles(dir) {
	fs.readdir(dir, (err, files) => {
		if (err) {
			console.error(`Error reading directory ${dir}:`, err)
			return
		}

		files.forEach(file => {
			const filePath = path.join(dir, file)

			fs.stat(filePath, (err, stats) => {
				if (err) {
					console.error(`Error getting stats of file ${filePath}:`, err)
					return
				}

				if (stats.isDirectory()) {
					printJsFiles(filePath)
				}
				else if (stats.isFile() && path.extname(file) === ".zs") {
					// console.log("asd")
					const zs_content = fs.readFileSync(filePath, "utf8")
					const jsFilePath = path.join(dir, path.basename(file, ".zs") + ".js")
					fs.writeFileSync(jsFilePath, translate_to_js(zs_content))
				}
			})
		})
	})
}

printJsFiles(__dirname)
