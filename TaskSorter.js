// import Comparator from './Comparator.js'

class TaskSorter {

	static compareTasks(a, b) {
		return TaskSorter._comparator.compare(a, b)
	}

	static getTaskComparator() {
		return Comparator.comparing(task => (task.done || task.rejected) ? 1 : 0)
			.andThen(Comparator.comparing(task => {
				let result = task.nextDue ? 
					(new Date(task.nextDue)).getTime() :
					(task.nextWhen ? 
						(new Date(task.nextWhen)).getTime() :
						(task.due ? 
							(new Date(task.due)).getTime() :
							(task.when ? 
								(new Date(task.when)).getTime() :
								Infinity)))
				if (isNaN(result)) result = Infinity
				return result
			}))
			.andThen(Comparator.comparing(task => {
				(typeof task.due === 'string' && ['soon', 'asap'].indexOf(task.due.toLowerCase()) !== -1) ? 0 : 1
			}))
			.andThen(Comparator.comparing(task => task.nextDue || task.nextWhen || task.due || task.when))
			.andThen(Comparator.comparing(task => task._id))
	}
	
	static _init() {
		TaskSorter._comparator = TaskSorter.getTaskComparator()
	}

	static sort(tasks) {
		return tasks.slice().sort((a, b) => TaskSorter.compareTasks(a, b))
	}

}

TaskSorter._init()