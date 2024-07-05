const Utils = {}
{
	const link = (env) => {
		const adjust = (a, b) => {
			for (const i in b) {
				if (b[i] != undefined) {
					a[i] = b[i]
				}
			}
		}
		const get_copy = (object) => {
			return structuredClone(object)
		}
		const get_date = (seconds) => {
			const milliseconds = 1000*seconds
			const date = new Date(milliseconds)
			const formatted = date.toLocaleString()
			return formatted
		}
		const insert_after = (current, insert) => {
			if (current.nextSibling) {
				current.parentElement.insertBefore(insert, current.nextSibling)
			} else {
				current.parentElement.appendChild(insert)
			}
		}
		Utils.adjust = adjust
		Utils.get_copy = get_copy
		Utils.get_date = get_date
		Utils.insert_after = insert_after
	}
	Utils.link = link
}