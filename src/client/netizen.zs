Netizens = {}
{
	link = function(env) {
		create = function(...args) {
			netizens = {}
			counter = document.createElement("button")
			counter.value = "settings"
			document.body.appendChild(counter)
			fetch = function() {
				env.network.fetch("connections").once(function(connections) {
					if connections >= 2 {
						counter.textContent = connections + " people online"
					}
					else {
						counter.textContent = connections + " person online"
					}
					setTimeout(function() {
						fetch()
					}, 3000)
				})
			}
			fetch()
			return netizens
		}
		Netizens.create = create
	}
	Netizens.link = link
}