Cast = {}
{
	sqrt = Math.sqrt
	get_circle_onto_circle_intersection_time = function(apx, apy, avx, avy, ar, bpx, bpy, bvx, bvy, br) {
		avav = avx*avx + avy*avy
		avap = avx*apx + avy*apy
		avbv = avx*bvx + avy*bvy
		avbp = avx*bpx + avy*bpy
		apap = apx*apx + apy*apy
		apbp = apx*bpx + apy*bpy
		bvap = bvx*apx + bvy*apy
		bvbv = bvx*bvx + bvy*bvy
		bvbp = bvx*bpx + bvy*bpy
		bpbp = bpx*bpx + bpy*bpy
		// a = avav + 2*avbv + bvbv
		// b = avbp - bvap + bvbp - avap
		// c = 0.25*(apap - 2*apbp + bpbp - (ar + br)*(ar + br))
		// t = zeros.solve(a, -b, c)[0]
		// if t < 0 env.whine("uhhh t < 0")
		t = (-avap + avbp - bvap + bvbp - sqrt((avap - avbp + bvap - bvbp)*(avap - avbp + bvap - bvbp) - (avav + 2*avbv + bvbv)*(apap - 2*apbp + bpbp - (ar + br)*(ar + br))))/(avav + 2*avbv + bvbv)
		return t
	}
	Cast.get_circle_onto_circle_intersection_time = get_circle_onto_circle_intersection_time
}