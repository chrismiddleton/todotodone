// import Comparator from './Comparator.js'

// TODO: Add interface for adding new records through the UI
// TODO: Put when and due events together
// TODO: Add facilities for marking events as done - maybe calculate a "nextDue" for such events so that when they're marked as done, they don't really go away, but just move down in the list
// TODO: Allow importing and exporting from a file instead of just copy/paste
// TODO: handle other due/when phrases like "2020 and every _ years thereafter" or "every feb 23"

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
		this.taskComparator = Comparator.comparing(task => task.done ? 1 : 0)
			.andThen(Comparator.comparing(task => task.due ? (new Date(task.due)).getTime() : Infinity))
			.andThen(Comparator.comparing(task => task.when ? (new Date(task.when)).getTime() : Infinity))
				
	}
	
	exportData() {
		return JSON.stringify({
			...this.state.data,
			tasks: this.state.data.tasks.slice()
				.sort((a, b) => this.taskComparator.compare(a, b))
				.map(task => {
					const copy = {...task}
					delete copy._id
					if (!copy.done) {
						delete copy.done
					}
					return copy
				})
		}, null, 4)
	}
	
	exportDataToBox() {
		const box = document.getElementById("importExportBox")
		box.value = this.exportData()
		box.select()
	}
	
	importData(string) {
		const imported = JSON.parse(string)
		const uniquePrefix = String(Date.now())
		this.setState((state, props) => {
			return {
				...state,
				data: {
					...imported,
					tasks: imported.tasks.map((task, index) => {
						return {...task, _id: task.id == null ? (uniquePrefix + index) : task.id}
					})
				}
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
		this.setState((state, props) => {
			return {
				...state,
				data: {
					...state.data,
					tasks: state.data.tasks.map(task => {
						if (task === targetTask) {
							return {...task, done: !targetTask.done}
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
				<h2>Todos:</h2>
				<p><textarea id="importExportBox" rows="5" cols="60"></textarea></p>
				<p>
					<input type="button" value="Import" onClick={() => this.importDataFromBox()} />
					<input type="button" value="Export" onClick={() => this.exportDataToBox()} />
				</p>
				<ol>
				{this.state.data.tasks.slice().sort((a, b) => this.taskComparator.compare(a, b)).map(task => (
					<li key={task._id} className={task.done ? "done" : ""}>
						<label>
							<input type="checkbox" defaultChecked={task.done} onClick={(event) => this.toggleDone(event, task)} /> 
							<span>{this.renderTaskDesc(task)}</span>
							<span className="due-date">{task.due ? ` (due ${task.due})` : ""}</span>
							<span className="when">{task.when ? ` (${task.when})` : ""}</span>
						</label>
					</li>
				))}
				</ol>
			</div>
		)
	}
}

// export default AppView