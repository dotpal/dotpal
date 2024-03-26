const fs = require('fs')
const get_data_url = function(file) {
	const content = fs.readFileSync(file, 'base64')
	const extension = file.split('.')[1]
	const type = {
		jpg: 'image/jpeg',
		png: 'image/png',
		gif: 'image/gif',
	}[extension]
	if (type !== undefined) {
		return `data:${type};base64,${content}`
	}
}
const replace_data_url = function(content) {
	return content.replace(/_include\(([^)]*)\)/g, function(match, file) {
		const data_url = get_data_url('src/' + file)
		if (data_url !== undefined) {
			return data_url
		}
		else {
			return fs.readFileSync('src/' + file, 'utf8')
		}
	})
}
const do_it = function(files) {
	const build_status = {}
	const recurse = function(file) {
		if (build_status[file.name] === 'building') {
			//console.log('recursive!!!', file.name)
			return
		}
		else if (build_status[file.name] === 'built') {
			return
		}
		build_status[file.name] = 'building'
		for (const i in file.dependencies) {
			recurse(file.dependencies[i])
		}
		build_status[file.name] = 'built'
		//console.log('this is when we actually build (by writing to the output)', file.name)
		console.log(file.content)
	}
	for (const i in files) {
		recurse(files[i])
	}
}
const input_folder = process.argv[2]
fs.readdir(input_folder, function(error, paths) {
	const files = []
	for (const i in paths) {
		const file = {}
		file.content = fs.readFileSync(input_folder + paths[i], 'utf8')
		const match = file.content.match(/const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/)
		if (match) {
			file.dependencies = []
			file.check_dependency = function(fileb) {
				if (file.name !== fileb.name && file.content.includes(fileb.name)) {
					file.dependencies.push(fileb)
				}
			}
			file.name = match[1]
			//console.log(replace_data_url('_include("asd")'))
			file.content = replace_data_url(file.content)
			files.push(file)
		}
		else {
			//console.log('variable name not found in', paths[i])
		}
	}
	for (const i in files) {
		for (const j in files) {
			files[i].check_dependency(files[j])
		}
	}
	do_it(files)
})