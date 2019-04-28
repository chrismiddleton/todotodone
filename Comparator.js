// import compare from './compare.js'

class Comparator {
	constructor(comparator) {
		this.comparator = comparator
	}
	andThen(comparator) {
		return new Comparator((a, b) => this.comparator(a, b) || comparator.compare(a, b))
	}
	andThenComparing(func) {
		return new Comparator((a, b) => this.comparator(a, b) || compare(func(a), func(b)))
	}
	static comparing(func) {
		return new Comparator((a, b) => compare(func(a), func(b)))
	}
	compare(a, b) {
		return this.comparator(a, b)
	}
	reverse() {
		return new Comparator((a, b) => -this.comparator(a, b))
	}
}

// export default Comparator