const StateManager = {}
{
	const fs = require('fs')
	StateManager.create = function(path) {
		const self = {}
		// the file might not exist so we should cover that later
		const state = JSON.parse(fs.readFileSync(path, 'utf8'))
		const save = function() {
			fs.writeFileSync(path, JSON.stringify(state), 'utf8')
		}
		self.push = function(...values) {
			Debug.log('push', path, ...values)
			state.push(...values)
			save()
		}
		self.get_state = function() {
			return state
		}
		// idk if this should be done externally or not but whatever
		process.on('exit', function() {
			Debug.log('oof we closed time to save the state xd')
			save()
		})
		return self
	}
}