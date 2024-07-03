import React, { useState } from 'react';
import axios from 'axios';

function Create({ setTodos }) {
    const [task, setTask] = useState('');
    const [dateTime, setDateTime] = useState('');

    const handleAdd = () => {
        axios.post('http://localhost:3001/add', { task, dateTime })
            .then(() => {
                // Fetch updated list of todos
                axios.get('http://localhost:3001/get')
                .then(result => setTodos(result.data))
                .catch(err => console.log(err));
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="create_form">
            <input
                type="text"
                placeholder="Enter task"
                onChange={(e) => setTask(e.target.value)}
            />
            <input
                type="datetime-local"
                onChange={(e) => setDateTime(e.target.value)}
            />
            <button type="button" onClick={handleAdd}>+</button>
        </div>
    );
}

export default Create;
