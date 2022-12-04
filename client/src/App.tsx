import React, { useEffect, useState } from "react";
import TodoItem from "./todo-items";
import "./App.css";
import axios from "axios";
import { BsTrash } from "react-icons/bs";
// import { isTemplateMiddle } from "typescript";
import { AiOutlineEdit } from "react-icons/ai";

axios.defaults.baseURL = process.env.REACT_APP_TODO_API || 'https://localhost:7254'

const fetchTodos = async (): Promise<TodoItem[]> => {
  const response = await axios.get<TodoItem[]>('/api/Todos')
  // console.log(response.data)
  return response.data
}

function App() {
  const [todoText, setTodoText] = useState<string>('')
  const [newtodoText, setNewTodoText] = useState<string>('')
  const [roomRent, setRoomRent] = useState<string>('')
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [error, setError] = useState<string | undefined>();

  const createTodo = async (todoText: string): Promise<void> => {
    const todoItem: TodoItem = {
      bookName: todoText,
      timeStamp: new Date()
    }

    try {
      await axios.post<TodoItem[]>('/api/todos', todoItem)
      const response = await axios.get<TodoItem[]>('/api/todos')
      setTodos(response.data)
      setTodoText('')
    } catch (err) {
      setTodos([])
      setError('Error creating todo')
    }
  }

  const updateTodo = async (todoItem: TodoItem): Promise<void> => {
    // const todoItem: TodoItem = {
    //   id: id,
    //   bookName: bookName
    // }
    try {
      console.log(todoItem)
      await axios.put<TodoItem[]>(`/api/todos/${todoItem.id}`, todoItem)
      const response = await axios.get<TodoItem[]>('/api/todos')
      setTodos(response.data)
    } catch (err) {
      setTodos([])
      setError('Error updating todo')
    }
  }

  const deleteTodo = async (todo: TodoItem): Promise<void> => {
    try {
      await axios.delete<TodoItem[]>(`/api/todos/${todo.id}`)
      const response = await axios.get<TodoItem[]>('/api/todos')
      setTodos(response.data)
    } catch (err) {
      setTodos([])
      setError('Error deleting todo')
    }
  }

  useEffect(() => {

    fetchTodos()
      .then(setTodos)
      .catch((error) => {
        setTodos([])
        setError('Something went wrong while searching for my todos...')
      })
  }, [])

  const handleroom = (bookName: string, id: string) => {
    // var result = [...roomRent]; //<- copy roomRent into result
    // result = result.map((x) => { //<- use map on result to find element to update using id
    //   if (x.id === id) x.room = bookName;
    //   return x;
    // });
    // setRoomRent(result); //<- update roomRent with value edited
  };

  const output = () => {
    if (error) {
      return (<div>{error}</div>)
    } else if (todos) {
      return (<div>{
        todos.map((item, index) => {
          // console.log(item)
          return (
            <>
              <div key={index} className="Todo">
                <button
                  className="Delete_Button"
                  onClick={() => deleteTodo(item)}> < BsTrash />
                </button>
                <input
                  type="text"
                  placeholder={item.bookName}
                  value={newtodoText}
                  onChange={(e) => setNewTodoText(e.target.value)} />
                <button
                  className="Edit_Button"
                  onClick={() => updateTodo(item)}> < AiOutlineEdit />
                </button>
              </div>
            </>
          )
        })
      }</div>)
    } else
      (<div>'Waiting for todos'</div>)
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="Header">
          <br />
          My todos...
        </div>
        <div className="Output-box">
          {output()}
        </div>
      </header>
      <div className="Bottom_Field">
        <input
          className="Input_Field"
          placeholder={`Your new todo item...`}
          minLength={1} maxLength={20}
          type="text"
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)} />
        <br />
        <button
          disabled={!todoText}
          className="Create_Button"
          onClick={(e) => createTodo(todoText)}>Create todo</button>
      </div>
    </div>
  );
}

export default App;
