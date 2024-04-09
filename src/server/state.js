const State = {}
{
	const fs = require('fs')
	const current = JSON.parse(fs.readFileSync('state.json', 'utf8'))
	State.push = function(...values) {
		Debug.log('push to state', ...values)
		current.push(...values)
		fs.writeFileSync('state.json', JSON.stringify(current), 'utf8')
	}
	State.get_current = function() {
		return current
	}
	process.on('exit', function() {
		Debug.log('oof we closed time to save the state xd')
	})
}