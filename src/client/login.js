const Login = {}
{
	Login.load = (env) => {
		Login.create = () => {
			const login = {}
			login.submit = Signal.create()
			const container = env.createElement('div')
			env.body.appendChild(container)
			const form = env.createElement('form')
			container.appendChild(form)
			const email = env.createElement('textarea')
			email.placeholder = 'email'
			email.required = true
			email.rows = 1
			form.appendChild(email)
			form.appendChild(env.createElement('br'))
			const password = env.createElement('input')
			password.placeholder = 'password'
			password.required = true
			password.rows = 1
			password.type = 'password'
			form.appendChild(password)
			const start = env.createElement('button')
			form.appendChild(env.createElement('br'))
			start.textContent = 'start'
			form.appendChild(start)
			login.remove = () => {
				container.remove()
			}
			form.onsubmit = (event) => {
				event.preventDefault()
				login.submit.call(email.value, password.value)
			}
			return login
		}
	}
}