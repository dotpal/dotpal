const cast = {}
{
	const sqrt = Math.sqrt
	cast.get_circle_onto_circle_intersection_time = function(apx, apy, avx, avy, ar, bpx, bpy, bvx, bvy, br) {
		const avav = avx*avx + avy*avy
		const avap = avx*apx + avy*apy
		const avbv = avx*bvx + avy*bvy
		const avbp = avx*bpx + avy*bpy
		const apap = apx*apx + apy*apy
		const apbp = apx*bpx + apy*bpy
		const bvap = bvx*apx + bvy*apy
		const bvbv = bvx*bvx + bvy*bvy
		const bvbp = bvx*bpx + bvy*bpy
		const bpbp = bpx*bpx + bpy*bpy
		/*
		const a = avav + 2*avbv + bvbv
		const b = avbp - bvap + bvbp - avap
		const c = 0.25*(apap - 2*apbp + bpbp - (ar + br)*(ar + br))
		const t = zeros.solve(a, -b, c)[0]
		//if (t < 0) console.log('uhhh t < 0')
		//*/
		const t = (-avap + avbp - bvap + bvbp - sqrt((avap - avbp + bvap - bvbp)*(avap - avbp + bvap - bvbp) - (avav + 2*avbv + bvbv)*(apap - 2*apbp + bpbp - (ar + br)*(ar + br))))/(avav + 2*avbv + bvbv)
		return t
	}
}