import { useState, useEffect } from 'react'
import './style.css' // Import the new CSS file
import Todos from './components/Todos'
import axios from 'axios';


function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:3001/api/todos';

  useEffect(() => {
    axios.get(API_URL)
      .then((response) => {
        setTodos(response.data);
        setLoading(false);
      })
      
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
      console.log(todos)
  }, []);


  const addToDo = (e) => {
    e.preventDefault();
    if (newTodo.trim() !== '') {
     
      setError(null);
      axios.post(API_URL, { text: newTodo, completed: false })
        .then((response) => {
          setTodos([...todos, response.data]);
          setNewTodo('');
        })
        .catch((err) => {
          console.error("Error adding todo:", err);
          setError(err);
        });
    } else {
      alert("Please enter a todo item."); 
    }
  }

  if (loading) return <p className="loading-text">Loading...</p>;

  if (error) return <p className="error-text">Error: {error.message || 'Could not fetch todos.'}</p>;

  return (
    <div className="app-container">
      <div className='header-container'>
        <h1 className='app-title'>Todo List</h1>
      </div>

      <div className='add-todo-container'>
        <form onSubmit={addToDo} className="add-todo-form">
          <input
            type="text"
            placeholder="Add a new todo"
            className='todo-input'
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)} />
          <button type="submit" className='add-button'>Add</button>
        </form>
      </div>


      <div className='todos-list-container'>
        <Todos todos={todos} setTodos={setTodos} />
      </div>
    </div>
  )
}

export default App
