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
	
	taskClassName(task) {
		const classes = ['row']
		if (task.done) classes.push("done")
		else if (task.rejected) classes.push("rejected")
		else classes.push('incomplete')
		if (task.due === false) classes.push("no-due-date")
		else if (task.when == null && task.due == null) classes.push("unknown-due-date")
		return classes.join(" ")
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
	
	toggleNoDueDate(event, targetTask) {
		this.setState((state, props) => {
			return {
				...state,
				data: {
					...state.data,
					tasks: state.data.tasks.map(task => {
						if (task === targetTask) {
							return {
								...task,
								due: targetTask.due === false ? undefined : false
							}
						} else {
							return task
						}
					})
				}
			 }
		})
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
				<ol className='table todos'>
					<li className='row'>
						<div className='cell header-cell'>Done</div>
						<div className='cell recurring-cell header-cell'>⟲</div>
						<div className='cell no-due-date-cell header-cell'>Any Time ⛱️</div>
						<div className='cell header-cell'>Description</div>
					</li>
				{this.state.data.tasks.cascade(TaskSorter.sort).map(task => (
					<li key={task._id} className={this.taskClassName(task)}>
						<div className='cell'>
							<input type="checkbox"
								defaultChecked={task.done || task.rejected}
								onClick={(event) => this.toggleDone(event, task)} />
						</div>
						<div className='cell icon-cell recurring-cell'>
							<span
								className={'recurring-icon' + ((task.nextDue || task.nextWhen) ? ' checked' : '')}
								>⟲</span>
						</div>
						<div className='cell icon-cell no-due-date-cell'>
							<span className={'no-due-date-icon' + (task.due === false ? ' checked' : '')}
								onClick={(event) => this.toggleNoDueDate(event, task)}
								>⛱️</span>
						</div>
						<div className='cell desc'>
							{this.renderTaskDesc(task)}
							<span className="due-date">{task.due ? ` (due ${task.due})` : ''}</span>
							<span className="when">{task.when ? 
								` (${task.when + (task.where ? (' @ ' + task.where) : '')})` :
								''
							}</span>
							<span className="at">{task.at ? ` (complete @ ${task.at})` : ''}</span>
						</div>
					</li>
				))}
				</ol>
			</div>
		)
	}
	
}

// export default AppView