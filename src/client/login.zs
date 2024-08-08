Login = {}
{
	link = function(env) {
		Signal = env.require("Signal")
		create = function(...args) {
			login = {}
			submit = Signal.create()
			remove = function() {
				container.remove()
			}
			container = document.createElement("div")
			document.body.appendChild(container)
			form = document.createElement("form")
			container.appendChild(form)
			email = document.createElement("textarea")
			email.placeholder = "email"
			email.required = true
			email.rows = 1
			form.appendChild(email)
			form.appendChild(document.createElement("br"))
			password = document.createElement("input")
			password.placeholder = "password"
			password.required = true
			password.rows = 1
			password.type = "password"
			form.appendChild(password)
			start = document.createElement("button")
			form.appendChild(document.createElement("br"))
			start.textContent = "start"
			form.appendChild(start)
			form.onsubmit = function() {
				event.preventDefault()
				submit.call(email.value, password.value)
			}
			login.remove = remove
			login.submit = submit
			return login
		}
		Login.create = create
	}
	Login.link = link
}