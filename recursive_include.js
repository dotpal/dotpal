const fs = require('fs')
const get_data_url = function(path) {
	const content = fs.readFileSync(path, 'base64')
	const extension = path.split('.')[1]
	const type = {
		jpg: 'image/jpeg',
		png: 'image/png',
		gif: 'image/gif',
	}[extension]
	if (type !== undefined) {
		return `data:${type};base64,${content}`
	}
}
const process_file = function(path) {
	let content = fs.readFileSync(path, 'utf8')
	while (true) {
		const content1 = content.replace(/IMPORT\(([^)]*)\)/g, function(match, path) {
			const data_url = get_data_url('src/' + path)
			if (data_url) {
				return data_url
			}
			else {
				return fs.readFileSync('src/' + path, 'utf8')
			}
		})
		if (content === content1) {
			return content
		}
		content = content1
	}
}
const input_file = process.argv[2]
console.log(process_file(input_file))