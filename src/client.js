'use strict'
INCLUDE(logic.js)
INCLUDE(which.js)
INCLUDE(network.js)
INCLUDE(signal.js)
INCLUDE(bubble.js)
async function digest_message(message) {
	const stream = new TextEncoder().encode(message) // encode as (utf-8) uint8array
	const hash = await crypto.subtle.digest('sha-256', stream) // hash the message
	const bytes = Array.from(new Uint8Array(hash)) // convert buffer to byte array
	const hex = bytes.map(function(b) {
		return b.toString(16).padStart(2, '0')
	}).join('') // convert bytes to hex string
	return hex
}
const debug = {}
{
	debug.point = function(px, py) {
		const [cpx, cpy, cpz] = camera.get_geometry()
		const project_scale = innerHeight/cpz
		const bubble_element = document.createElement('div')
		bubble_element.setAttribute('class', 'debug')
		bubble_element.style.left = 0.5*innerWidth + (px - cpx)*project_scale + 'px'
		bubble_element.style.top = 0.5*innerHeight + (py - cpy)*project_scale + 'px'
		bubble_element.style.width = '2px'
		bubble_element.style.height = '2px'
		document.body.appendChild(bubble_element)
	}
	debug.clear = function() {
	}
}
const camera = {}
{
	const exp = Math.exp
	let target
	let px1 = 0
	let py1 = 0
	let pz1 = 0
	let px = 0
	let py = 0
	let pz = 5
	camera.focus = function(subject) {
		target = subject
	}
	camera.get_geometry = function() {
		return [px, py, pz]
	}
	{
		const sqrt = Math.sqrt
		const max = Math.max
		const min = Math.min
		let ux = -1/0
		let uy = -1/0
		let lx = +1/0
		let ly = +1/0
		camera.push_focus_region = function(x, y, r) {
			ux = max(ux, x + r)
			uy = max(uy, y + r)
			lx = min(lx, x - r)
			ly = min(ly, y - r)
		}
		camera.pop_focus_regions = function() {
			px1 = 0.5*(lx + ux)
			py1 = 0.5*(ly + uy)
			pz1 = sqrt((ux - lx)*(ux - lx) + (uy - ly)*(uy - ly))
			ux = -1/0
			uy = -1/0
			lx = +1/0
			ly = +1/0
		}
	}
	camera.step = function(dt) {
		if (target !== undefined) {
			[px1, py1] = target.get_geometry()
		}
		else {
			camera.pop_focus_regions()
		}
		const h = exp(-4*dt)
		px = px1 + h*(px - px1)
		py = py1 + h*(py - py1)
		pz = pz1 + h*(pz - pz1)
		//update(t)
	}
}
{
	const random = Math.random
	const sqrt = Math.sqrt
	const the_network = network.create(3565)
	the_network.open.connect(function() {
		console.log('connected to network')
		const receive_cookie = signal.create()
		const login_form = document.createElement('form')
		login_form.setAttribute('id', 'login_form')
		const username_label = document.createElement('label')
		username_label.textContent = 'email'
		const username_input = document.createElement('input')
		username_input.setAttribute('id', 'username')
		username_input.setAttribute('name', 'username')
		username_input.setAttribute('required', 'true')
		username_input.setAttribute('type', 'text')
		const password_label = document.createElement('label')
		password_label.textContent = 'password'
		const password_input = document.createElement('input')
		password_input.setAttribute('id', 'password')
		password_input.setAttribute('name', 'password')
		password_input.setAttribute('required', 'true')
		password_input.setAttribute('type', 'password')
		const submit_button = document.createElement('input')
		submit_button.setAttribute('type', 'submit')
		submit_button.setAttribute('value', 'login')
		login_form.appendChild(username_label)
		login_form.appendChild(username_input)
		login_form.appendChild(password_label)
		login_form.appendChild(password_input)
		login_form.appendChild(submit_button)
		document.body.appendChild(login_form)
		document.querySelector('#login_form').addEventListener('submit', function(event) {
			event.preventDefault() // prevent the login form from submitting
			const username = document.querySelector('#username').value
			const password = document.querySelector('#password').value
			if (username === '' || password === '') {
				alert('please enter both username and password')
				return
			}
			digest_message(username + password).then(function(secret) {
				document.cookie = secret
				receive_cookie.send([secret])
			})
		})
		const get_location = function() {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					console.log(position)
				})
			}
			else {
				alert('geolocation is not supported by this browser')
			}
		}
		{
			receive_cookie.connect(function([secret]) {
				login_form.remove()
				the_network.send(['login', secret])
			})
			if (document.cookie) {
				receive_cookie.send([document.cookie])
			}
		}
		{
			const floor = Math.floor
			const min = Math.min
			const random = Math.random
			const sqrt = Math.sqrt
			function get_random_word() {
				const consonants = 'bcdfghjklmnpqrstvwxyz'
				const vowels = 'aiueo'
				const prefixes = ['a', 'ab', 'ad', 'af', 'ag', 'al', 'an', 'ante', 'anti', 'arch', 'archi', 'auto', 'bi', 'bio', 'centi', 'circum', 'co', 'com', 'con', 'contra', 'counter', 'de', 'deci', 'di', 'dis', 'em', 'en', 'eu', 'ex', 'extra', 'fore', 'hexa', 'hyper', 'hypo', 'il', 'im', 'in', 'inter', 'intra', 'intro', 'ir', 'kilo', 'macro', 'mal', 'mega', 'meta', 'micro', 'mid', 'milli', 'mini', 'mis', 'mono', 'multi', 'neo', 'non', 'ob', 'oc', 'omni', 'ortho', 'out', 'over', 'para', 'per', 'peri', 'poly', 'post', 'pre', 'preter', 'pro', 'proto', 'pseudo', 'quad', 're', 'retro', 'semi', 'sub', 'super', 'supra', 'sym', 'syn', 'tele', 'trans', 'tri', 'ultra', 'un', 'under', 'uni', 'up', 'vice']
				const suffixes = ['able', 'al', 'ally', 'ance', 'ard', 'ate', 'ation', 'dom', 'ed', 'en', 'ence', 'er', 'es', 'est', 'ful', 'hood', 'ic', 'ing', 'ion', 'ish', 'ism', 'ist', 'ity', 'ive', 'ize', 'less', 'ly', 'ment', 'ness', 'ous', 's', 'ship', 'sion', 'tion', 'ty', 'y']
				let word = consonants[random()*consonants.length | 0] + vowels[random()*vowels.length | 0] + consonants[random()*consonants.length | 0]
				if (word[word.length - 1] == 'c' && random() < 0.9) {
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
			const bubble_count = floor(6 + 32*random())
			for (let i = bubble_count; i--;) {
				bubble.create(sqrt(bubble_count)*random(), sqrt(bubble_count)*random(), 0, 0, sqrt(random()), get_random_word(), 'https://www.blocksrey.com/')
			}
			let t0 = 0.001*performance.now()
			const render = function() {
				const t = 0.001*performance.now()
				const dt = min(t - t0, 0.03)
				t0 = t
				bubble.step(dt)
				camera.step(dt)
				requestAnimationFrame(render)
			}
			requestAnimationFrame(render)
		}
	})
}