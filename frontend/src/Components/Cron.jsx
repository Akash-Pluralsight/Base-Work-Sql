
import React, { useState } from 'react';
import cronstrue from 'cronstrue';

export default function Cron() {
    const [schedule, setSchedule] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            cronstrue.toString(schedule);
        } catch (error) {
            setErrorMessage('Invalid cron expression');
            return;
        }
        setErrorMessage('');

        try {
            const response = await fetch('http://localhost:5000/schedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ schedule })
            });

            if (!response.ok) {
                throw new Error('Failed to schedule task');
            }
        } catch (error) {
            console.error('Error scheduling task:', error);
        }
    };
    return (
        <div>
            <form onSubmit={handleSubmit} className='cronform'>
                <label htmlFor="scheduleInput">Enter Schedule (Cron Expression):</label>
                <div>
                    <input
                        className='cornFormInput'
                        type="text"
                        id="scheduleInput"
                        name="schedule"
                        placeholder="* * * * *"
                        value={schedule}
                        onChange={(e) => setSchedule(e.target.value)}
                        required
                    />
                </div> 
                {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

                <button type="submit">Schedule Task</button>
            </form>
        </div>
    );
}

 
