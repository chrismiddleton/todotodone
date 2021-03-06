// import Comparator from './Comparator.js'

class TaskSorter {

	static compareTasks(a, b) {
		return TaskSorter._comparator.compare(a, b)
	}
	
	static getDateField(task) {
		return task.nextDue || task.nextWhen || task.due || task.when
	}

	static getTaskComparator() {
		return Comparator.comparing(task => (task.done || task.rejected) ? 2 : (task.due != null || task.when != null ? 1 : 0))
			.andThen(Comparator.comparing(task => {
				const dateField = TaskSorter.getDateField(task)
				let result
				switch (dateField && dateField.toLowerCase()) {
					case 'asap':
						// set 1 week from now
						result = Date.now() + 1000 * 60 * 60 * 24 * 7
						break
					case 'soon':
						// set 1 month from now 
						result = Date.now() + 1000 * 60 * 60 * 24 * 30
						break
					default:
						result = dateField ? (new Date(dateField)).getTime() : Infinity
						if (isNaN(result)) result = Infinity
						break
				}
				return result
			}))
			.andThen(Comparator.comparing(task => {
				return (typeof task.due === 'string' && 
					['soon', 'asap'].indexOf(task.due.toLowerCase()) !== -1) ? 0 : 1
			}))
			.andThenCompare((a, b) => {
				const af = TaskSorter.getDateField(a)
				const bf = TaskSorter.getDateField(b)
				return (af && bf) ? compare(af, bf) : (af ? -1 : (bf ? 1 : 0))
			})
			.andThen(Comparator.comparing(task => {
				return task.due === false ? 1 : 0
			}))
			.andThen(Comparator.comparing(task => task.desc ? task.desc.toLowerCase() : ""))
	}
	
	static _init() {
		TaskSorter._comparator = TaskSorter.getTaskComparator()
	}

	static sort(tasks) {
		return tasks.slice().sort((a, b) => TaskSorter.compareTasks(a, b))
	}

}

TaskSorter._init()