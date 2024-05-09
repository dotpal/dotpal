const Viewer = {}
{
	Viewer.load = (env) => {
		Viewer.create = (blub, blubs, parent) => {
			const remove = () => {
				container.remove()
			}
			let read = true
			if (!blub) {
				read = false
			}
			const container = env.createElement('div')
			env.body.appendChild(container)
			const form = env.createElement('form')
			container.appendChild(form)
			if (read) {
				const icon = env.createElement('img')
				icon.src = blub.user.icon
				form.appendChild(icon)
				icon.onclick = () => {
					blub.user.view()
				}
			}
			const title = env.createElement('textarea')
			title.cols = read && 21 || 26
			title.placeholder = 'title'
			title.readOnly = read
			title.required = true
			title.rows = 1
			form.appendChild(title)
			form.appendChild(env.createElement('br'))
			const description = env.createElement('textarea')
			description.cols = 26
			description.placeholder = 'description'
			description.readOnly = read
			description.required = true
			description.rows = 20
			form.appendChild(description)
			form.appendChild(env.createElement('br'))
			if (blub) {
				title.value = blub.title
				description.value = blub.description
			}
			const close = env.createElement('button')
			close.textContent = 'close'
			form.appendChild(close)
			close.onclick = () => {
				remove()
			}
			container.onclick = (event) => {
				if (event.target == container) {
					remove()
				}
			}
			if (!read) {
				const publish = env.createElement('button')
				publish.textContent = 'publish'
				form.appendChild(publish)
				form.onsubmit = (event) => {
					event.preventDefault()
					blubs.publish(title.value, description.value, parent)
					remove()
				}
			}
			else {
				/*
				const comments = env.createElement('form')
				container.appendChild(comments)
				const comment = env.createElement('p')
				comment.textContent = 'comment'
				comments.appendChild(comment)
				*/
				const reply = env.createElement('button')
				reply.textContent = 'reply'
				reply.onclick = (event) => {
					event.preventDefault()
					// class functions should affect state, but this does affect state, therefore its wrong maybe
					// maybe instead it should be like viewer_manager.create or something idk
					Viewer.create(undefined, blubs, blub.id)
				}
				form.appendChild(reply)
			}
		}
	}
}