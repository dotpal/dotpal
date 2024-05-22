const Viewer = {}
{
	Viewer.link = (env) => {
		Viewer.create = (blub, parent) => {
			const blubs = env.blubs
			const remove = () => {
				container.remove()
			}
			let read = true
			if (!blub) {
				read = false
			}
			const container = document.createElement('div')
			document.body.appendChild(container)
			const form = document.createElement('form')
			container.appendChild(form)
			if (read) {
				const icon = document.createElement('img')
				icon.src = blub.user.icon
				form.appendChild(icon)
				icon.onclick = () => {
					blub.user.view()
				}
			}
			const title = document.createElement('textarea')
			title.cols = read && 21 || 26
			title.placeholder = 'title'
			title.readOnly = read
			title.required = true
			title.rows = 1
			form.appendChild(title)
			form.appendChild(document.createElement('br'))
			const description = document.createElement('textarea')
			description.cols = 26
			description.placeholder = 'description'
			description.readOnly = read
			description.required = true
			description.rows = 20
			form.appendChild(description)
			form.appendChild(document.createElement('br'))
			if (blub) {
				title.value = blub.title
				description.value = blub.description
			}
			const close = document.createElement('button')
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
				const publish = document.createElement('button')
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
				const comments = document.createElement('form')
				container.appendChild(comments)
				const comment = document.createElement('p')
				comment.textContent = 'comment'
				comments.appendChild(comment)
				*/
				const reply = document.createElement('button')
				reply.textContent = 'reply'
				reply.onclick = (event) => {
					event.preventDefault()
					// class functions should affect state, but this does affect state, therefore its wrong maybe
					// maybe instead it should be like viewer_manager.create or something idk
					Viewer.create(undefined, blub.id)
				}
				form.appendChild(reply)
			}
		}
	}
}