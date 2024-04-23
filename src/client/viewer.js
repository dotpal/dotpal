const Viewer = {}
{
	Viewer.create = (blub) => {
		const viewer = {}
		viewer.close = Signal.create()
		viewer.reply = Signal.create()
		viewer.submit = Signal.create()
		let editor
		if (!blub) {
			editor = true
		}
		else {
			editor = false
		}
		const container = document.createElement('div')
		document.body.appendChild(container)
		const form = document.createElement('form')
		container.appendChild(form)
		if (!editor) {
			const icon = document.createElement('img')
			icon.src = blub.user.icon
			form.appendChild(icon)
		}
		const title = document.createElement('textarea')
		title.cols = 24
		title.placeholder = 'title'
		title.readOnly = !editor
		title.required = true
		title.rows = 1
		form.appendChild(title)
		form.appendChild(document.createElement('br'))
		const description = document.createElement('textarea')
		description.cols = 32
		description.placeholder = 'description'
		description.readOnly = !editor
		description.required = true
		description.rows = 24
		form.appendChild(description)
		form.appendChild(document.createElement('br'))
		if (blub) {
			title.value = blub.title
			description.value = blub.description
		}
		viewer.close.tie(() => {
			container.remove()
			// viewer.close.remove()
			viewer.submit.remove()
		})
		const close = document.createElement('button')
		close.textContent = 'close'
		form.appendChild(close)
		close.onclick = () => {
			viewer.close.call()
		}
		container.onclick = (event) => {
			if (event.target == container) {
				viewer.close.call()
			}
		}
		if (editor) {
			const publish = document.createElement('button')
			publish.textContent = 'publish'
			form.appendChild(publish)
			form.onsubmit = (event) => {
				event.preventDefault()
				const options = {}
				options.description = description.value
				options.title = title.value
				viewer.submit.call(options)
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
				viewer.reply.call()
			}
			form.appendChild(reply)
		}
		return viewer
	}
}