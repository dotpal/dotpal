Chain = {}
{
	link = function(env) {
		create = function(...args) {
			chain = {}
			links = []
			container = document.createElement("div")
			container.style.backgroundColor = "rgba(0, 0, 0, 0)"
			container.style.height = "auto"
			container.style.left = "50%"
			container.style.transform = "translateX(-50%)"
			container.style.width = "auto"
			document.body.appendChild(container)
			push = function(blub) {
				link = function() {
					button.remove()
				}
				button = document.createElement("button")
				button.textContent = blub.get_title()
				container.appendChild(button)
				button.onclick = function() {
					for soft i = links.length; i--; {
						if links[i] isnt link {
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
				refresh_children: function() {
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