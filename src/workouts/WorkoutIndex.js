import React, {Component} from 'react';
import WorkoutCreate from './WorkoutCreate';
import {Container, Row, Col} from 'reactstrap';
import WorkoutsTable from './WorkoutTable';
import WorkoutEdit from './WorkoutEdit';

class WorkoutIndex extends Component {
    constructor(props){
        super(props)
        this.state = {
            workouts: [],
            updatePressed: false,
            workoutToUpdate: {}
        }
    }

    fetchWorkouts = () => {
        console.log(this.props.token, 'line 18 in workoutindex');
        fetch('http://localhost:3000/api/log', {
            method: 'GET',
            headers: new Headers ({
                'Content-Type': 'application/json',
                'Authorization': this.props.token
            })
        }) .then( (res) => res.json())
           .then((logData) => {
               return this.setState({workouts: logData})
           })
    }

    workoutDelete = (event) => {
        fetch(`http://localhost:3000/api/log/${event.target.id}`, {
            method: 'DELETE',
            body: JSON.stringify({log: {id: event.target.id}}),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': this.props.token
            })
        })
        .then((res) => this.fetchWorkouts())
    }

    workoutUpdate = (event, workout) => {
        fetch(`http://localhost:3000/api/log/${workout.id}`, {
            method: 'PUT',
            body: JSON.stringify({log: workout}),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': this.props.token
            })
        }) .then((res) => {
            this.setState({updatePressed: false})
            this.fetchWorkouts();
        })
    }

    setUpdatedWorkout = (event, workout) => {
        this.setState({
            workoutToUpdate: workout,
            updatePressed: true
        })
    }

    componentDidMount(){
        this.fetchWorkouts()
    }

    render(){
        const workouts = this.state.workouts.length >= 1 ? 
        <WorkoutsTable workouts={this.state.workouts} delete={this.workoutDelete} update={this.setUpdatedWorkout}/> : 
        <h2>Log a workout to see table</h2>

        return(
            <Container>
                <Row>
                    <Col md='3'>
                        <WorkoutCreate token={this.props.token} updateWorkoutsArray={this.fetchWorkouts}/>
                    </Col>
                    <Col md='9'>
                        {workouts}
                    </Col>
                    <Col md="12">
                    {
                        this.state.updatePressed ? <WorkoutEdit t={this.state.updatePressed} update={this.workoutUpdate} workout={this.state.workoutToUpdate} /> : <div></div>
                    }
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default WorkoutIndex;