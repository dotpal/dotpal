const child_process = require('child_process')
const fs = require('fs')
const get_data_url = (folder, file) => {
	const content = fs.readFileSync(folder + file, 'base64')
	const extension = file.split('.')[1]
	const type = {
		jpg: 'image/jpeg',
		png: 'image/png',
		gif: 'image/gif',
	}[extension]
	if (type) {
		return `data:${type};base64,${content}`
	}
}
const replace_data_url = (folder, content) => {
	return content.replace(/_include\(([^)]*)\)/g, (match, file) => {
		const data_url = get_data_url(folder, file)
		if (data_url) {
			return data_url
		}
		else {
			return fs.readFileSync(folder + file, 'utf8')
		}
	})
}
const build_files = (files) => {
	const build_status = {}
	const recurse = (file) => {
		if (build_status[file.name] == 'building') {
			return
		}
		else if (build_status[file.name] == 'built') {
			return
		}
		build_status[file.name] = 'building'
		for (const i in file.dependencies) {
			recurse(file.dependencies[i])
		}
		build_status[file.name] = 'built'
		console.log(file.content)
	}
	for (const i in files) {
		recurse(files[i])
	}
}
const get_paths = (folder) => {
	return child_process.execSync('dir ' + folder).toString().split(/\s+/).filter(Boolean)
}
const input_folders = [process.argv[2], 'src/shared/']
const files = []
for (const i in input_folders) {
	const input_folder = input_folders[i]
	const paths = get_paths(input_folder)
	for (const i in paths) {
		const file = {}
		file.content = fs.readFileSync(input_folder + paths[i], 'utf8')
		const match = file.content.match(/const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/)
		if (match) {
			file.dependencies = []
			file.check_dependency = (fileb) => {
				if (file.name != fileb.name && file.content.includes(fileb.name)) {
					file.dependencies.push(fileb)
				}
			}
			file.name = match[1]
			file.content = replace_data_url(input_folder, file.content)
			files.push(file)
		}
	}
}
for (const i in files) {
	for (const j in files) {
		files[i].check_dependency(files[j])
	}
}
build_files(files)