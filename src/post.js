const post = {}
{
	if (which() === 'client') {
		post.create = function() {
			//network
		}
		post.open = function() {
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
			const create_post_element = document.createElement('button')
			create_post_element.innerHTML = 'create_post'
			form_element.appendChild(create_post_element)
			form_element.onsubmit = function(event) {
				event.preventDefault()
				container_element.remove()
				const description = post_description.value
				debug.log('submitted post with description', description)
			}
		}
		const start_writing_element = document.createElement('button')
		start_writing_element.innerHTML = 'start_writing'
		document.body.appendChild(start_writing_element)
		start_writing_element.onclick = function() {
			post.open()
		}
	}
	else if (which() === 'server') {
		network.receive('post').connect(function([peer, location]) {
			debug.log('new post by', peer)
		})
	}
}