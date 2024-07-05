const Netizens = {}
{
	const link = (env) => {
		const create = (...args) => {
			const netizens = {}
			const counter = document.createElement("button")
			counter.value = "settings"
			document.body.appendChild(counter)
			const fetch = () => {
				env.network.fetch("connections").once((connections) => {
					if (connections >= 2) {
						counter.textContent = connections + " people online"
					}
					else {
						counter.textContent = connections + " person online"
					}
					setTimeout(() => {
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