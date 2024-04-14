const Viewer = {}
{
	const pow = Math.pow
	const pi = Math.PI
	const min = Math.min
	const sqrt = Math.sqrt
	const exp = Math.exp
	const or = Logic.or
	Viewer.create = () => {
		const viewer = {}
		viewer.close = Signal.create()
		viewer.open = Signal.create()
		viewer.submit = Signal.create()
		viewer.open.tie((bubble) => {
			let editor
			// more likely to view posts than create them
			if (!bubble) {
				editor = true
			}
			else {
				editor = false
			}
			const container = document.createElement('div')
			document.body.appendChild(container)
			const form = document.createElement('form')
			container.appendChild(form)
			const icon = document.createElement('img')
			icon.src = 'https://qph.cf2.quoracdn.net/main-qimg-407c4b6f60302d6e9c55695adef129e0-pjlq'
			form.appendChild(icon)
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
			if (bubble) {
				title.value = bubble.get_title()
				description.value = bubble.get_description()
			}
			viewer.close.tie(() => {
				container.remove()
			})
			const close = document.createElement('button')
			close.textContent = 'close'
			form.appendChild(close)
			close.onclick = (event) => {
				viewer.close.call(bubble)
			}
			container.onclick = (event) => {
				if (event.target === container) {
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
				}
				form.appendChild(reply)
			}
		})
		return viewer
	}
}