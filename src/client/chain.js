const Chain = {}
{
	const link = (env) => {
		const create = (...args) => {
			const chain = {}
			const links = []
			const container = document.createElement("div")
			container.style.backgroundColor = "rgba(0, 0, 0, 0)"
			container.style.height = "auto"
			container.style.left = "50%"
			container.style.transform = "translateX(-50%)"
			container.style.width = "auto"
			document.body.appendChild(container)
			const push = (blub) => {
				const link = () => {
					button.remove()
				}
				const button = document.createElement("button")
				button.textContent = blub.get_title()
				container.appendChild(button)
				button.onclick = () => {
					for (let i = links.length; i--;) {
						if (links[i] != link) {
							links[i]()
						}
						else {
							break
						}
					}
					env.focus(blub)
				}
				links.push(link)
				return link
			}
			push({
				title: "[local]",
				refresh_children: () => {
					env.blubs.fetch(env.get_position())
				}
			})
			chain.push = push
			return chain
		}
		Chain.create = create
	}
	Chain.link = link
}