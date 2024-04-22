const Login = {}
{
	Login.create = () => {
		const login = {}
		login.submit = Signal.create()
		const container = document.createElement('div')
		document.body.appendChild(container)
		const form = document.createElement('form')
		container.appendChild(form)
		const email = document.createElement('textarea')
		email.placeholder = 'email'
		email.required = true
		email.rows = 1
		form.appendChild(email)
		form.appendChild(document.createElement('br'))
		const password = document.createElement('textarea')
		password.placeholder = 'password'
		password.required = true
		password.rows = 1
		form.appendChild(password)
		const start = document.createElement('button')
		form.appendChild(document.createElement('br'))
		start.textContent = 'start'
		form.appendChild(start)
		login.remove = () => {
			container.remove()
		}
		form.onsubmit = (event) => {
			event.preventDefault()
			login.submit.call([email, password])
		}
		return login
	}
}