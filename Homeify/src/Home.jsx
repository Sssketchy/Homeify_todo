import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Create from './Create';
import { FaTrash, FaCheckCircle, FaRegCheckCircle } from 'react-icons/fa';
import './Home.css';

function Home() {
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = () => {
        axios.get('http://localhost:3001/get')
            .then(result => setTodos(result.data))
            .catch(err => console.log(err));
    };

    const handleToggleDone = (id, currentDoneStatus) => {
        axios.put(`http://localhost:3001/update/${id}`, { done: !currentDoneStatus })
            .then(() => {
                // Update the local todos state to reflect the change
                setTodos(todos.map(todo => 
                    todo._id === id ? { ...todo, done: !currentDoneStatus } : todo
                ));
            })
            .catch(err => console.log(err));
    };

    const handleEdit = (id, newTask, newDateTime) => {
        axios.put(`http://localhost:3001/update/${id}`, { task: newTask, dateTime: new Date(newDateTime).toISOString() })
            .then(() => fetchTodos())
            .catch(err => console.log(err));
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:3001/delete/${id}`)
            .then(() => fetchTodos())
            .catch(err => console.log(err));
    };

    const formatDateTime = (isoDateTime) => {
        const date = new Date(isoDateTime);
        return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    };

    return (
        <div className="home">
            <h2>Homeify</h2>
            <Create setTodos={setTodos} />
            {
                todos.length === 0 ?
                    <div><h2>No Records</h2></div>
                    :
                    todos.map(todo => (
                        <div className={`task ${todo.done ? 'done' : ''}`} key={todo._id}>
                            <div className="checkbox" onClick={() => handleToggleDone(todo._id, todo.done)}>
                                {todo.done ? <FaCheckCircle className='icon' /> : <FaRegCheckCircle className='icon' />}
                                <p>{todo.task}</p>
                            </div>
                            <div>
                                <span onClick={() => handleDelete(todo._id)}>
                                    <FaTrash className='icon'/>
                                </span>
                            </div>
                            <input
                                type="datetime-local"
                                value={formatDateTime(todo.dateTime)}
                                onChange={(e) => handleEdit(todo._id, todo.task, e.target.value)}
                            />
                        </div>
                    ))
            }
        </div>
    );
}

export default Home;
