// import TaskSorter from './TaskSorter.js'
// import TimelessDate from './TimelessDate.js'

class TodoData {

	static parse(string) {
		const imported = JSON.parse(string)
		const now = new Date()
		const uniquePrefix = String(now.getTime())
		const today = TimelessDate.today()
		return TodoData.validateImportedData(imported, today, uniquePrefix)
	}

	static stringify(data) {
		return JSON.stringify({
			...data,
			tasks: data.tasks.cascade(TaskSorter.sort)
				.map(task => {
					const copy = {...task}
					delete copy._id
					if (!copy.done) {
						delete copy.done
					}
					return copy
				})
		}, null, 4).replace(/ {4}/g, '\t')
	}
	
	static validateImportedData(data, today, uniquePrefix) {
		return {
			...data,
			tasks: data.tasks.map((task, index) => TodoData.validateImportedTask(task, index, today, uniquePrefix))
		}
	}
	
	static validateImportedTask(task, index, today, uniquePrefix) {
		task = {...task, _id: task.id == null ? (uniquePrefix + index) : task.id}
		return TaskScheduler.scheduleNextDate(task, today)
	}

}
