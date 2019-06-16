class TimelessDate {
	constructor(year, month, day) {
		this.year = Number(year)
		this.month = Number(month)
		this.day = Number(day)
	}
	static fromDate(date) {
		return new TimelessDate(date.getFullYear(), date.getMonth(), date.getDate())
	}
	static parse(string) {
		const pieces = string.split('-')
		const year = Number(pieces[0])
		const month = Number(pieces[1])
		const date = Number(pieces[2])
		return new TimelessDate(year, month, date)
	}
	static today() {
		return TimelessDate.fromDate(new Date())
	}
	compareTo(td) {
		const us = this.toString()
		const them = td.toString()
		return us < them ? -1 : (us > them ? 1 : 0)
	}
	toString() {
		return String(this.year) + "-" + String(this.month + 1).padStart(2, '0') + "-" + String(this.day).padStart(2, '0')
	}
}
