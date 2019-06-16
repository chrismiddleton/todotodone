class TaskScheduler {

	static nextTaskOccurrence(pattern, today, lastCompleted) {
		pattern = pattern.toLowerCase()
		const match = pattern.match(/^(?:every|each)\s+(.+)$/i)
		if (!match) return null
		const frequency = match[1]
		// TODO: handle other frequency types
		return TaskScheduler.parseEveryMonthDate(frequency, today, lastCompleted)
	}
	
	static parseEveryMonthDate(frequency, today, lastCompleted) {
		const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
		const monthAbbrevs = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
		const monthDayRegex = /^(\w+)\s+0*([1-9][0-9]?)/i
		const monthMatch = frequency.match(monthDayRegex)
		if (!monthMatch) return null
		const monthName = monthMatch[1]
		const day = monthMatch[2]
		let month = months.indexOf(monthName)
		if (month === -1) month = monthAbbrevs.indexOf(monthName)
		// no match
		if (month === -1) return null
		let date = new TimelessDate((lastCompleted ? (lastCompleted.year + 1) : today.year), month, day)
		if (date.compareTo(today) < 0) {
			// TODO: handle leap years - should just use moment.js
			date = new TimelessDate(today.year + 1, month, day)
		}
		return date.toString()
	}

	static scheduleNextDate(task, today, reschedule = false) {
		const lastCompleted = task.lastCompleted && TimelessDate.parse(task.lastCompleted)
		if (task.due && (!task.nextDue || reschedule)) {
			const nextDue = TaskScheduler.nextTaskOccurrence(task.due, today, lastCompleted)
			if (nextDue) {
				task = {...task, nextDue: nextDue}
			}
		}
		if (task.when && (!task.nextWhen || reschedule)) {
			const nextWhen = TaskScheduler.nextTaskOccurrence(task.when, today, lastCompleted)
			if (nextWhen) {
				task = {...task, nextWhen: nextWhen}
			}
		}
		return task
	}

}
