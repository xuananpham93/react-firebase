import React, { Component } from 'react';
import './App.css';
import firebase from 'firebase';

// connect firebase
const config = {
	apiKey: "AIzaSyDyj0XQf5wV10Y0yHuyaB-Dk9JVaBrh9-0",
	authDomain: "todo-b8bab.firebaseapp.com",
	databaseURL: "https://todo-b8bab.firebaseio.com",
	projectId: "todo-b8bab",
	storageBucket: "todo-b8bab.appspot.com",
	messagingSenderId: "344806949462"
};
firebase.initializeApp(config);

var TodoItem = React.createClass({

	actionRemove() {
		this.props.actionRemove(this.props.id);
	},
	actionComplete() {
		this.props.actionComplete(this.props.id, this.props.complete);
	},
	render() {
		var classes = 'list-group-item clearfix';

		if (this.props.complete === 1) {
			classes += ' list-group-item-success';
		}

		return React.createElement(
			'li',
			{ className: classes },
			this.props.task,
			React.createElement(
				'div',
				{ className: 'pull-right' },
				React.createElement(
					'button',
					{ className: 'btn btn-xs btn-success img-circle', onClick: this.actionComplete },
					'✓'
				),
				' ',
				React.createElement(
					'button', {
						className: 'btn btn-xs btn-danger img-circle', onClick: this.actionRemove
					},
					'X'
				)
			)
		);
	}
});

class App extends Component {

	constructor(props) {
		super(props);

		this.actionRemove = this.actionRemove.bind(this);
        this.actionComplete = this.actionComplete.bind(this);
        this.generateId = this.generateId.bind(this);
        this.actionAdd = this.actionAdd.bind(this);

		this.state = {
			items: [],
		};
	}

	componentWillMount() {
		this.firebaseRef = firebase.database().ref("guests");

		this.firebaseRef.on('value', function (snapshot) {
			var items = [];
			snapshot.forEach(function (data) {
				var todo = {
					key: data.key,
					name: data.val().name,
					complete: data.val().complete,
				}

				items.push(todo);
			});
			

			this.setState({
				items: items
			});

		}.bind(this));
	}

	generateId() {
        return Math.floor(Math.random() * 9000) + 10000;
	}
	
	actionAdd(e){
		e.preventDefault();
		var task = this.refs.task.value.trim();
		
		if (!task) {
            return;
		}
		
		var complete = 0;
		
		var newTodo = {
			name: task,
			complete: complete
		}
				
		this.firebaseRef.push(newTodo);

        this.refs.task.value = '';
        return;
		
	}

	actionComplete(key, complete){
		var complete = complete === 1 ? 0 : 1;

		this.firebaseRef.child(key).update({complete: complete});
	}

	actionRemove(key){
		this.firebaseRef.child(key).remove();
	}

	render() {
		var listItems = this.state.items.map(function (item) {
            return React.createElement(
                TodoItem, {
                    id: item.key,
                    key: item.key,
                    task: item.name,
                    complete: item.complete,
                    actionComplete: this.actionComplete,
                    actionRemove: this.actionRemove
                }
            );
        }, this);

		return (
			<div className='container'>
				<div className="app-content col-sm-8 col-sm-offset-2">
					<h1>Firebase + React</h1>
					<div className="form-elem">
						<form className="form-inline" onSubmit={this.actionAdd} >
							<input type='text' ref="task" className='form-control margin-right-15' placeholder='What do you need to do?' />
							<button type='submit' className='btn btn-success' >Save</button>
						</form>
					</div>
					
					<div className="clearfix margin-bot-10"></div>

					<ul className="list-group">
						{listItems}
					</ul>
				</div>
			</div>
		);
	}
}

export default App;
