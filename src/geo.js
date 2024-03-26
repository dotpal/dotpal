const Geo = {}
{
	Geo.get_location = function() {
		if (navigator.geolocation !== undefined) {
			navigator.geolocation.getCurrentPosition(function(position) {
				const cx = mod(position.coords.latitude*deg, PI)
				const cy = mod(position.coords.longitude*deg, 2*PI)
				const pin = document.createElement('img')
				pin.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAABACAYAAACdp77qAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAABm9JREFUaN7NmFuMG9UZx38ztnd92SReyGaFQiBEolEvJCRICAkyIIRTHlAFEkVIrfLGA31oUBUqFSRyhBBFvQAPkAgIVyEhLqJqSwTZUaLiQJFIlS1EzZZQiCDLKth789qei8cz04edY5tNdj3j9Tr8n3aOz+W/3/ku/+8oREQ+JzLATuAm4DrgCmAo+NkDPgW+BI4B72q6+CTqGUoEMj8Cfgv8HEhHOONzYD9wQNNFuSuk8jlxKfAY8As5FlNV0okkqUQ/fbEEqqI25tdch5rrYDg2lmO3bjUDPKIoyr4dI3utjknlc2JX8F+mAdKJJNnUKjJ9yVAmcj2XOdtgxizjeq4cHgN+qenieCRSH+wUcc9nH3APQF8swbqBQVKJfjqB7/uUrApTRgnP9wFMYLemi+dCkcrnRBo4GDgy2dQq1qbXoCgKy0XdczlbnsJsXuufNF3cv3Ceep61r0pCw6suYiiT7QohgLgaY/2aIbKpATm0J58Te5ckFUy4QxJa3Z+h21BQGMoMkk2tkkMinxN3nvf68jmxHfgXoKzNZBlsLloxfFuZZs6qAlSAH2q6GF9oqacBJZXo7wkhgHWZQRKxOMAA8MfvXF8+J24LsjPDAxfRKyiKwrqBQfl5d3BbDUvdB7A6mZHMI0VUwZhlbOoMBWOWejMfhUI6kSSdaOS93wAo+ZzYAHwNsCE7TDLeF2ozq17jH2c+5dDnH1O1zMZ4Jpnip1dey00btoTeq1qzmJgrAtgoyiVx4GcAiVg89CazdoX9x9/hdPGbcw+wTN4+8T6jZ//HvdtvI9s/0Ha/TF+SmBrD9dx+fD+nAjvmf0iFIuR4dZ4ZPXheQq04XfyGZ0YP4nj1UPu2lK6dKvADgP54ItTijybG+KIwHmruF4VxPpoYCzU3GW+UsKtVYAtAfywcqSOnRyM5ctj5fc0A26wCsbDSquJYTMwUI5GamClSday281rkz4Aa5QCrXusoH5kR16mABeDjt508GCKSzrsuGWmdrwInpWJsh5iqcsOmrZEIXb9pCzGl/YW0nH9CBcYBHDdc6GqXXRWJ1I2XbQldGQIUVeDfAHbIe9+4epi7tt4cau5dW29m4+rhqP46qgIfABg1W0rVtrjl8m3suubWJefsuuZWbrl8W2iLGrVGhH4YJ6YexvVmffys4VgMhMzsN6z/MT9Zu5FPCl/y2dSZxvjmizewdd0mshEEouHYeL4H4ACHlUC6PAvck04kWb9miF7jbHmasl0F+Kumi9tlWDw3z9jCrjs9JVT3XEmowUMF0HRxDDgKMG2Wekpqxmw0zWOaLg4ulMMPAlRss+PMHRWOW6dkVuTno+d0M5oujgI6QLE62xNSU8acrCQnNV28uljftxvAcmzKtrGihKx6rdWXfr1o36fpYgx4SlorbN7qBIXKtPzz75ouDrfrkB8CJl3PZdqcWxFCJasio9wE9rRt2zVdzAAPAMwYc6FrYli4vsdktRHhT2q6OBXmLYHgNeQ4QKE6013nrpZk9h4HHllMTy2Ge2VNqtbMrhCy6w4lq5EC9mi6MCKR0nTxMfAKwGS1hN8Fpy82rZ7XdPH6UspzKdwPGDXXodQM345QqZmt71K/aieHWcJaBeD30hfceV/o6CVvquncz2u6+E/HpAI8Dnzr+V5rnYqEObsq5a4B/C5M40AbaxkyRZTMMq4XzVqe7zNlNPLdnzVdFJdNKiD2AnDK831mrWjWKttV+TI8iaI8FrbFCot989m4GikSZ5sq4IA2stfoKikFDgAV13OphMxbhmNJX/JReCJKMxoKO3RRBV4EmG0mwKVrXNNKb2gjotB1UgH2S2nTTjbXv2vR/VHb9tAIpM1RGebt0kCA/2q6eH/FSEmHBZhr4/AtV/d81AM6IfUWUPZ8b9EnHsOxZRvuAS+tOKkgmb4OULaqi+amFlU52QtLAbwpi+zCeuj7PpWmvn+5k807IqXpYgQoAOdoLcOxpLavgPJez0i1+BYV21xwdQ0rvavpe81ek/qbtFQgb/GZf6gP8FqnG3dMStPFIWAKaIg3s/l6YgGHek4qwBHp8NKf5Phi+rsXpP7S+uDVEnXvLWfT5ZI6LOuc4VitPeI7F4xUoOFPyo4nwNeaLk5fSEs1rqrlIffIcjfsBqn8gu+R7wOpDxd8//OCkwoK7ong8ytNF199HywF8Afmn5sf7sZm/wd7aevUwby5fgAAAABJRU5ErkJggg=='
				pin.style.left = 100*(-1 + IP*cy) + 'vh'
				pin.style.top = 100*(0.5 - IP*cx) + 'vh'
				pin.style.position = 'fixed'
				pin.style.transform = 'translate(-50%, -100%)'
				document.body.appendChild(pin)
			})
		}
		else {
			Debug.log('geolocation is not supported by this browser') // this sounds like a bad assumption
		}
	}
}