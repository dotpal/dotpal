const Clock = {}
{
	Clock.load = (env) => {
		Clock.get_time = () => {
			return 0.001*new Date().getTime()
		}
	}
}