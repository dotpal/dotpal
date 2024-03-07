const login = {}
{
	// this is stupid as fuck
	const remove_cookies = function() {
		const cookies = document.cookie.split(';')
		for (let i = 0; i < cookies.length; ++i) {
			const cookie = cookies[i]
			const equal = cookie.indexOf('=')
			const name = equal > -1 ? cookie.substr(0, equal) : cookie
			document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
		}
	}
	const min = Math.min
	const random = Math.random
	const sqrt = Math.sqrt
	const PI = Math.PI
	const floor = Math.floor
	const deg = PI/180
	const mod = function(x, y) {
		return x - floor(x/y)*y
	}
	const get_location = function() {
		if (navigator.geolocation !== undefined) {
			let location
			navigator.geolocation.getCurrentPosition(function(position) {
				location = [mod(position.coords.latitude*deg, PI), mod(position.coords.longitude*deg, PI)]
				debug.log('location registered at coordinates', location)
			})
			return location
		}
		else {
			debug.log('geolocation is not supported by this browser')
		}
	}
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
	async function digest_message(message) {
		const stream = new TextEncoder().encode(message) // encode as (utf-8) uint8array
		const hash = await crypto.subtle.digest('sha-1', stream) // hash the message
		const bytes = Array.from(new Uint8Array(hash)) // convert buffer to byte array
		const hex = bytes.map(function(b) {
			return b.toString(16).padStart(2, '0')
		}).join('') // convert bytes to hex string
		return hex
	}
	login.receive_cookie = signal.create()
	login.receive_cookie.connect(function([secret]) {
		network.send(['login', secret])
		get_location()
		const bubbles_length = 6 + 32*random() | 0
		for (let i = bubbles_length; i--;) {
			bubble.create(sqrt(bubbles_length)*random(), sqrt(bubbles_length)*random(), 0, 0, sqrt(random()), get_random_word(), 'https://www.blocksrey.com/')
		}
	})
	login.finish = signal.create()
	if (document.cookie !== '') {
		login.receive_cookie.send([document.cookie])
		login.finish.send()
	}
	else {
		const form_container_element = document.createElement('container')
		document.body.appendChild(form_container_element)
		const form_element = document.createElement('form')
		form_container_element.appendChild(form_element)
		const email_label_element = document.createElement('label')
		email_label_element.innerHTML = 'email'
		form_element.appendChild(email_label_element)
		form_element.appendChild(document.createElement('br'))
		const email_input_element = document.createElement('input')
		email_input_element.type = 'text'
		email_input_element.required = true
		form_element.appendChild(email_input_element)
		form_element.appendChild(document.createElement('br'))
		const password_label_element = document.createElement('label')
		password_label_element.innerHTML = 'password'
		form_element.appendChild(password_label_element)
		const password_input_element = document.createElement('input')
		form_element.appendChild(document.createElement('br'))
		password_input_element.type = 'password'
		password_input_element.required = true
		form_element.appendChild(password_input_element)
		const login_button_element = document.createElement('button')
		form_element.appendChild(document.createElement('br'))
		login_button_element.innerHTML = 'login'
		form_element.appendChild(login_button_element)
		form_element.onsubmit = function() {
			form_container_element.remove()
			const email = email_input_element.value
			const password = password_input_element.value
			digest_message(email + password).then(function(secret) {
				document.cookie = secret
				login.receive_cookie.send([secret])
			})
		}
	}
}