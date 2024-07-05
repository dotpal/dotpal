const Signal = {}
{
	const create = (tfunc) => {
		const sig = {}
		const cons = []
		let call
		const tie = (call) => {
			const con = {}
			cons.push(con)
			con.remove = () => {
				cons.splice(cons.indexOf(con), 1)
			}
			if (cons.length >= 2) {
				// console.trace("this is the second con...")
			}
			con.call = call
			return con
		}
		const once = (call) => {
			const con = tie((...args) => {
				con.remove()
				call(...args)
			})
			return con
		}
		const transform = (tfunc) => {
			if (!tfunc) {
				call = (...args) => {
					for (const con of cons) {
						con.call(...args)
					}
				}
			}
			else {
				call = (...args) => {
					args = tfunc(...args)
					for (const con of cons) {
						con.call(...args)
					}
				}
			}
			sig.call = call
		}
		const remove = () => {
			for (const con of cons) {
				con.remove()
			}
		}
		sig.once = once
		sig.remove = remove
		sig.tie = tie
		sig.transform = transform
		transform(tfunc)
		return sig
	}
	Signal.create = create
}