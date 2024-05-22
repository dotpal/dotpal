const Clock = {}
{
	Clock.link = (env) => {
		Clock.get_time = () => {
			return 0.001*new Date().getTime()
		}
	}
}