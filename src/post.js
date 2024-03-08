const post = {}
{
	const random = Math.random
	const get_random_word = function() {
		const consonants = 'bcdfghjklmnpqrstvwxyz'
		const vowels = 'aiueo'
		const prefixes = ['a', 'ab', 'ad', 'af', 'ag', 'al', 'an', 'ante', 'anti', 'arch', 'archi', 'auto', 'bi', 'bio', 'centi', 'circum', 'co', 'com', 'con', 'contra', 'counter', 'de', 'deci', 'di', 'dis', 'em', 'en', 'eu', 'ex', 'extra', 'fore', 'hexa', 'hyper', 'hypo', 'il', 'im', 'in', 'inter', 'intra', 'intro', 'ir', 'kilo', 'macro', 'mal', 'mega', 'meta', 'micro', 'mid', 'milli', 'mini', 'mis', 'mono', 'multi', 'neo', 'non', 'ob', 'oc', 'omni', 'ortho', 'out', 'over', 'para', 'per', 'peri', 'poly', 'post', 'pre', 'preter', 'pro', 'proto', 'pseudo', 'quad', 're', 'retro', 'semi', 'sub', 'super', 'supra', 'sym', 'syn', 'tele', 'trans', 'tri', 'ultra', 'un', 'under', 'uni', 'up', 'vice']
		const suffixes = ['able', 'al', 'ally', 'ance', 'ard', 'ate', 'ation', 'dom', 'ed', 'en', 'ence', 'er', 'es', 'est', 'ful', 'hood', 'ic', 'ing', 'ion', 'ish', 'ism', 'ist', 'ity', 'ive', 'ize', 'less', 'ly', 'ment', 'ness', 'ous', 's', 'ship', 'sion', 'tion', 'ty', 'y']
		let word = consonants[random()*consonants.length | 0] + vowels[random()*vowels.length | 0] + consonants[random()*consonants.length | 0]
		if (word[word.length - 1] === 'c' && random() < 0.9) {
			word += 'k'
		}
		if (random() < 0.707107) {
			word = word + suffixes[random()*suffixes.length | 0]
		}
		if (random() < 0.707107) {
			word = prefixes[random()*prefixes.length | 0] + word
		}
		return word
	}
	if (which() === 'client') {
		post.create = function(description, dont_bounce) {
			const self = {}
			self.get_description = function() {
				return description
			}
			if (dont_bounce === undefined) {
				network.send(['post', description])
			}
			bubble.create(self)
			self.view = function() {
				const container_element = document.createElement('container')
				document.body.appendChild(container_element)
				const form_element = document.createElement('form')
				container_element.appendChild(form_element)
				const post_description = document.createElement('textarea')
				post_description.readOnly = true
				post_description.rows = 28
				post_description.cols = 32
				post_description.value = description
				form_element.appendChild(post_description)
				form_element.appendChild(document.createElement('br'))
				const exit_element = document.createElement('button')
				exit_element.innerHTML = 'exit'
				form_element.appendChild(exit_element)
				exit_element.onclick = function(event) {
					container_element.remove()
					camera.focus(undefined)
				}
			}
			return self
		}
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
				post.create(description)
			}
			const exit_element = document.createElement('button')
			exit_element.innerHTML = 'exit'
			form_element.appendChild(exit_element)
			exit_element.onclick = function(event) {
				container_element.remove()
			}
		}
		network.receive('post').subscribe(function([peer, description]) {
			post.create(description, true)
		})
	}
	else if (which() === 'server') {
		const fs = require('fs')
		const path = require('path')
		network.receive('post').subscribe(function([peer, description]) {
			//debug.log(peer.get_id())
			fs.writeFileSync('posts/' + Math.random(), description)
			network.send_but(peer, ['post', description])
		})
		network.connect.subscribe(function([peer]) {
			const directory_path = 'posts'
			const files = fs.readdirSync(directory_path)
			files.forEach(file => {
				const file_path = path.join(directory_path, file)
				const description = fs.readFileSync(file_path, 'utf8')
				network.share(peer, ['post', description])
			})
		})
	}
}