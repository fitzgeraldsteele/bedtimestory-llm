import React, { useState } from 'react';
import './styles.css';

function App() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMessage(`Hello ${name}!`);
  }

  function handleClear() {
    setMessage('');
  }

  return (
    <div className='container'>
      <div className='form-container'>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" value={name} onChange={handleNameChange} required />
          </label>
          <button type="button" onClick={handleSubmit}>
            Submit
          </button>
          <button type="button" onClick={handleClear}>
            Clear
          </button>
        </form>
      </div>
      
      <div className='result'>
        {message && <p>{message}</p>}
      </div>
    </div>
      
    
  );
}

export default App;