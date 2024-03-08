'use strict'
_include(which.js)
_include(signal.js)
_include(hash.js)
_include(debug.js)
_include(logic.js)
_include(bubble.js)
_include(network.js)
_include(post.js)
_include(camera.js)
// update
{
	const min = Math.min
	let t0 = 0.001*performance.now()
	const render = function() {
		const t = 0.001*performance.now()
		const dt = min(t - t0, 0.03)
		t0 = t
		camera.step(dt)
		bubble.step(dt)
		requestAnimationFrame(render)
	}
	requestAnimationFrame(render)
}