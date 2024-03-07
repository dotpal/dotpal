const post = {}
{
	if (which() === 'client') {
		const create_element = document.createElement('button')
		create_element.innerHTML = 'create'
		document.body.appendChild(create_element)
		create_element.onclick = function() {
			const container_element = document.createElement('container')
			document.body.appendChild(container_element)
			const form_element = document.createElement('form')
			container_element.appendChild(form_element)
			const post_description = document.createElement('textarea')
			post_description.required = true
			post_description.rows = 28
			post_description.cols = 32
			form_element.appendChild(post_description)
			form_element.appendChild(document.createElement('br'))
			const publish_element = document.createElement('button')
			publish_element.innerHTML = 'publish'
			form_element.appendChild(publish_element)
			form_element.onsubmit = function(event) {
				event.preventDefault()
				container_element.remove()
				const description = post_description.value
				network.send(['post', description])
			}
			const cancel_element = document.createElement('button')
			cancel_element.innerHTML = 'cancel'
			form_element.appendChild(cancel_element)
			cancel_element.onclick = function(event) {
				container_element.remove()
			}
		}
	}
	else if (which() === 'server') {
		const fs = require('fs')
		network.receive('post').connect(function([peer, description]) {
			fs.writeFileSync('store/post', description)
		})
	}
}