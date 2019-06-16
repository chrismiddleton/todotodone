// import TaskScheduler from './TaskScheduler.js'
// import TaskSorter from './TaskSorter.js'
// import TimelessDate from './TimelessDate.js'
// import TodoData from './TodoData.js'

class AppView extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			// add the IDs if they are missing
			data: {
				...props.data,
				tasks: props.data.tasks.map((task, index) => {
					return {...task, _id: task.id == null ? index : task.id}
				})
			}
		}
	}
	
	exportData() {
		return TodoData.stringify(this.state.data)
	}
	
	exportDataToBox() {
		const box = document.getElementById("importExportBox")
		box.value = this.exportData()
		box.select()
	}
	
	importData(string) {
		this.setState((state, props) => {
			return {
				...state,
				data: TodoData.parse(string)
			}
		})
	}
	
	importDataFromBox() {
		this.importData(document.getElementById("importExportBox").value)
	}
	
	renderTaskDesc(task) {
		if (Array.isArray(task.desc)) {
			return task.desc.join("\n")
		} else {
			return task.desc
		}
	}
	
	toggleDone(event, targetTask) {
		let flipDone = true
		const today = TimelessDate.today()
		this.setState((state, props) => {
			return {
				...state,
				data: {
					...state.data,
					tasks: state.data.tasks.map(task => {
						if (task === targetTask) {
							flipDone = !task.nextDue && !task.nextWhen
							const done = flipDone ? !targetTask.done : targetTask.done
							let newTask = {...task,
								done: done,
								lastCompleted: today.toString()
							}
							if (!done && newTask.rejected) {
								delete newTask.rejected
							}
							newTask = TaskScheduler.scheduleNextDate(newTask, today, true)
							return newTask
						} else {
							return task
						}
					})
				}
			 }
		})
		if (!flipDone) {
			event.preventDefault()
		}
	}
	
	render() {
		return (
			<div>
				<h3>Todos:</h3>
				<p><textarea id="importExportBox" rows="5" cols="60"></textarea></p>
				<p>
					<input type="button" value="Import" onClick={() => this.importDataFromBox()} />
					<input type="button" value="Export" onClick={() => this.exportDataToBox()} />
				</p>
				<ol>
				{this.state.data.tasks.cascade(TaskSorter.sort).map(task => (
					<li key={task._id} className={task.done ? "done" : task.rejected ? "rejected": ""}>
						<input type="checkbox" defaultChecked={task.done || task.rejected} onClick={(event) => this.toggleDone(event, task)} />
						<span>{' '}</span>
						<span>{this.renderTaskDesc(task)}</span>
						<span className="due-date">{task.due ? ` (due ${task.due})` : ""}</span>
						<span className="when">{task.when ? ` (${task.when})` : ""}</span>
					</li>
				))}
				</ol>
			</div>
		)
	}
	
}

// export default AppView