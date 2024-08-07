const Viewer = {}
{
	const link = (env) => {
		const Utils = env.require("Utils")
		const create = (blub) => {
			const remove = () => {
				container.remove()
			}
			let read = blub != undefined
			const container = document.createElement("div")
			document.body.appendChild(container)
			const form = document.createElement("form")
			container.appendChild(form)
			if (read) {
				const icon = document.createElement("img")
				icon.className = "icon"
				env.print(blub.user)
				icon.src = blub.user.get_icon()
				form.appendChild(icon)
				icon.onclick = () => {
					blub.user.view()
				}
			}
			const title = document.createElement("textarea")
			title.cols = read && 21 || 26
			title.placeholder = "title"
			title.readOnly = read
			title.required = true
			title.rows = 1
			form.appendChild(title)
			form.appendChild(document.createElement("br"))
			const description = document.createElement("textarea")
			description.cols = 26
			description.placeholder = "description"
			description.readOnly = read
			description.required = true
			description.rows = 15
			form.appendChild(description)
			form.appendChild(document.createElement("br"))
			if (blub) {
				title.value = blub.get_title()
				description.value = blub.get_description()
			}
			const close = document.createElement("button")
			close.textContent = "close"
			form.appendChild(close)
			close.onclick = () => {
				remove()
			}
			container.onclick = () => {
				if (event.target == container) {
					remove()
				}
			}
			if (!read) {
				const publish = document.createElement("button")
				publish.textContent = "publish"
				form.appendChild(publish)
				form.onsubmit = () => {
					event.preventDefault()
					env.blubs.easy_create(title.value, description.value)
					remove()
				}
			}
			else {
				const reply = document.createElement("button")
				reply.textContent = "reply"
				reply.onclick = () => {
					event.preventDefault()
					// blub.comment.call(env.user, Utils.get_date(env.get_time()))
				}
				form.appendChild(reply)
				const time = document.createElement("textarea")
				time.textContent = Utils.get_date(blub.get_time())
				form.appendChild(time)
				const comment = (text) => {
					const comment_form = document.createElement("form")
					Utils.insert_after(form, comment_form)
					const description = document.createElement("textarea")
					description.cols = 26
					description.placeholder = "description"
					description.readOnly = read
					description.required = true
					description.rows = 10
					description.textContent = text
					comment_form.appendChild(description)
				}
				// blub.comment.tie(comment)
			}
		}
		Viewer.create = create
	}
	Viewer.link = link
}
