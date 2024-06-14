const Login = {}
{
	Login.link = (env) => {
		const Signal = env.require("Signal")
		Login.create = (...args) => {
			const login = {}
			login.submit = Signal.create()
			const container = document.createElement("div")
			document.body.appendChild(container)
			const form = document.createElement("form")
			container.appendChild(form)
			const email = document.createElement("textarea")
			email.placeholder = "email"
			email.required = true
			email.rows = 1
			form.appendChild(email)
			form.appendChild(document.createElement("br"))
			const password = document.createElement("input")
			password.placeholder = "password"
			password.required = true
			password.rows = 1
			password.type = "password"
			form.appendChild(password)
			const start = document.createElement("button")
			form.appendChild(document.createElement("br"))
			start.textContent = "start"
			form.appendChild(start)
			login.remove = () => {
				container.remove()
			}
			form.onsubmit = () => {
				event.preventDefault()
				login.submit.call(email.value, password.value)
			}
			return login
		}
	}
}