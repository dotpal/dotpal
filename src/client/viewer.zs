Viewer = {}
{
	link = function(env) {
		Utils = env.require("Utils")
		create = function(blub) {
			remove = function() {
				container.remove()
			}
			read = blub isnt nil
			container = document.createElement("div")
			document.body.appendChild(container)
			form = document.createElement("form")
			container.appendChild(form)
			if read {
				icon = document.createElement("img")
				icon.className = "icon"
				env.print(blub.user)
				icon.src = blub.user.get_icon()
				form.appendChild(icon)
				icon.onclick = function() {
					blub.user.view()
				}
			}
			title = document.createElement("textarea")
			title.cols = read and 21 or 26
			title.placeholder = "title"
			title.readOnly = read
			title.required = true
			title.rows = 1
			form.appendChild(title)
			form.appendChild(document.createElement("br"))
			description = document.createElement("textarea")
			description.cols = 26
			description.placeholder = "description"
			description.readOnly = read
			description.required = true
			description.rows = 15
			form.appendChild(description)
			form.appendChild(document.createElement("br"))
			if blub {
				title.value = blub.get_title()
				description.value = blub.get_description()
			}
			close = document.createElement("button")
			close.textContent = "close"
			form.appendChild(close)
			close.onclick = function() {
				remove()
			}
			container.onclick = function() {
				if event.target is container {
					remove()
				}
			}
			if not read {
				publish = document.createElement("button")
				publish.textContent = "publish"
				form.appendChild(publish)
				form.onsubmit = function() {
					event.preventDefault()
					env.blubs.easy_create(title.value, description.value)
					remove()
				}
			}
			else {
				reply = document.createElement("button")
				reply.textContent = "reply"
				reply.onclick = function() {
					event.preventDefault()
					// blub.comment.call(env.user, Utils.get_date(env.get_time()))
				}
				form.appendChild(reply)
				time = document.createElement("textarea")
				time.textContent = Utils.get_date(blub.get_time())
				form.appendChild(time)
				comment = function(text) {
					comment_form = document.createElement("form")
					Utils.insert_after(form, comment_form)
					description = document.createElement("textarea")
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
