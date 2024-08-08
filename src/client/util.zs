Utils = {}
{
	link = function(env) {
		adjust = function(a, b) {
			for i in b {
				if b[i] isnt nil {
					a[i] = b[i]
				}
			}
		}
		get_copy = function(object) {
			return structuredClone(object)
		}
		get_date = function(seconds) {
			milliseconds = 1000*seconds
			date = new Date(milliseconds)
			formatted = date.toLocaleString()
			return formatted
		}
		insert_after = function(current, insert) {
			if current.nextSibling {
				current.parentElement.insertBefore(insert, current.nextSibling)
			}
			else {
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