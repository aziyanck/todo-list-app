import { useState, useEffect } from 'react'
import './style.css' // Import the new CSS file
import Todos from './components/Todos'
import axios from 'axios';
import loginService from './services/login'

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [user, setUser] = useState(null)

  const API_URL = 'http://localhost:3001/api/todos';

  let token = null

  const setToken = newToken => {
    token = `Bearer ${newToken}`
  }


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

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('user')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      setToken(user.token)
    }


  },[])

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem('user', JSON.stringify(user))

      //token stored
      setToken(user.token)
      console.log(user.token)

      setUser(user)
      console.log("done", user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

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

  const loginForm = () => (
    <div className="login">
      <form action="" onSubmit={handleLogin} className="login-form">

        <div>
          Username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>

        <div>
          Password
          <input type="passssword"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)} />
        </div>
        <div>
          <button type="submit" className='login-button'>Login</button>
        </div>

      </form>
    </div>
  )

  const doForm = () => (
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
  )

  if (loading) return <p className="loading-text">Loading...</p>;

  if (error) return <p className="error-text">Error: {error.message || 'Could not fetch todos.'}</p>;

  return (
    <div className="app-container">

      <div className='header-container'>
        <h1 className='app-title'>Todo List</h1>
      </div>

      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged in</p>
          {doForm()}
        </div>

      }





      <div className='todos-list-container'>
        <Todos todos={todos} setTodos={setTodos} />
      </div>
    </div>
  )
}

export default App
