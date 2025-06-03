
import axios from 'axios';


const API_URL = 'http://localhost:3001/api/todos';


const Todos = ({ todos, setTodos }) => {

    const handleDelete = (id) => {
        axios.delete(`${API_URL}/${id}`)
            .then((response) => {
                const updatedTodos = todos.filter((todo) => todo.id !== id);
                setTodos(updatedTodos);
            })
            .catch((error) => {

                console.error("Error deleting todo:", error);
                alert(`Failed to delete todo: ${error.message}`);
            });
    }

    const handleEdit = (id) => {
        const newText = prompt("Edit todo:", todos.find(todo => todo.id === id).text);
        if (newText !== null && newText.trim() !== '') {
            axios.put(`${API_URL}/${id}`, { text: newText })
                .then((response) => {
                    const updatedTodos = todos.map(todo =>
                        todo.id === id ? { ...todo, text: response.data.text } : todo
                    );
                    setTodos(updatedTodos);
                })
                .catch((error) => {
                    console.error("Error editing todo:", error);
                    alert(`Failed to edit todo: ${error.message}`);
                });
        }
    }


    const handleToggleComplete = (id, completed) => {
        axios.put(`${API_URL}/${id}`, { completed: !completed })
            .then((response) => {
                const updatedTodos = todos.map(todo =>
                    todo.id === id ? { ...todo, completed: response.data.completed } : todo
                );
                setTodos(updatedTodos);
            })
            .catch((error) => {
                console.error("Error toggling complete:", error);
                alert(`Failed to toggle complete: ${error.message}`);
            });
    }

    return (
        <div className='todos-wrapper'>
            {Array.isArray(todos) && todos.map((todo) => (
                <div key={todo.id} className='todo-item'>
                    <input
                        type="checkbox"
                        checked={!!todo.completed}
                        onChange={() => handleToggleComplete(todo.id, todo.completed)}
                    />
                    <p className={todo.completed ? 'completed' : ''}  >{todo.text}</p>
                    <button onClick={() => handleEdit(todo.id)} className='edit-button'><i className="fa-solid fa-pen-to-square"></i></button>
                    <button onClick={() => handleDelete(todo.id)} className='delete-button'><i className="fa-solid fa-trash"></i></button>
                </div>
            ))}
        </div>
    );
};

export default Todos;
