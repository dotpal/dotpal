const Chain = {}
{
	Chain.link = (env) => {
		Chain.create = () => {
			const chain = {}
			const links = []
			const container = document.createElement('div')
			container.style.backgroundColor = 'rgba(0, 0, 0, 0)'
			container.style.height = 'auto'
			container.style.left = '50%'
			container.style.transform = 'translateX(-50%)'
			container.style.width = 'auto'
			document.body.appendChild(container)
			chain.push = (blub) => {
				const link = () => {
					button.remove()
				}
				const button = document.createElement('button')
				button.textContent = blub.title
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
			chain.push({
				title: '[local]',
				refresh_children: () => {
					env.blubs.fetch(env.geo.position.get())
				}
			})
			return chain
		}
	}
}