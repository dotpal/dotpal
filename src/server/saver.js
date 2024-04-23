const Saver = {}
{
	const fs = require('fs')
	const parse = JSON.parse
	const random = Math.random
	const stringify = JSON.stringify
	Saver.create = (path) => {
		const saver = {}
		if (!fs.existsSync(path)) {
			Debug.log('save file', path, 'doesnt exist creating it')
			fs.writeFileSync(path, '[]')
		}
		const state = parse(fs.readFileSync(path))
		saver.save = () => {
			fs.writeFileSync(path, stringify(state))
		}
		saver.create = (type) => {
			const object = {}
			const id = random()
			object.time = get_time()
			object.type = type
			state[id] = object
			return object
		}
		saver.get_state = () => {
			return state
		}
		saver.source = (entry, attributes) => {
			const clone = {...entry}
			for (const j in attributes) {
				const i = attributes[j]
				const id = entry[i]
				clone[i] = {...state[id]}
			}
			return clone
		}
		return saver
	}
}