const Saver = {}
{
	const fs = require('fs')
	const parse = JSON.parse
	const stringify = JSON.stringify
	Saver.create = (path) => {
		const saver = {}
		if (!fs.existsSync(path)) {
			Debug.log('save file', path, 'doesnt exist creating it')
			fs.writeFileSync(path, '[]')
		}
		const state = parse(fs.readFileSync(path, 'utf8'))
		saver.save = () => {
			fs.writeFileSync(path, stringify(state), 'utf8')
		}
		saver.push = (...values) => {
			state.push(...values)
		}
		saver.get_state = () => {
			return state
		}
		return saver
	}
}