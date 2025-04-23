import { use, useEffect, useState } from 'react'
import axios from "axios"
import './App.css'
import './index.css'
import { PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/solid'

function App() {
  const [name, setName] = useState("")
  const [todos, setTodos] = useState([])
  const [editStatus, setEditStatus] = useState(false)
  const [editName, setEditName] = useState('')
  const [editUi, setEditUi] = useState(false)
  const [editTodo, setEditTodo] = useState({})

  //задание 1
  const fetchTodos = async() =>{
    const {data} = await axios.get("http://127.0.0.1:8000/todos/")
    setTodos(data)
  }

  useEffect(()=>{
    fetchTodos()
  }, [])

  //задание 2  --backend_api (view.py)
  const addTodoHandler = () =>{
    const postTodo = async()=> {
      const postTodoData = {
        name:name
      }
      const {data} = await axios.post(
        "http://127.0.0.1:8000/todos/", 
        postTodoData);
        setName("")
        fetchTodos()
    }

    postTodo();
  }

  //задание 3
  const deleteTodoHandler = (id) =>{
    const deleteTodo = async()=>{
      await axios.delete(`http://127.0.0.1:8000/todos/${id}/`)
      const newTodos = todos.filter((todo)=>todo.id!=id)
      setTodos(newTodos)
    }
    deleteTodo()
  }

  //задание 4
  const editTodoHandler = (id) => {
    const updatePatchTodo = async () => {
      const updateData = {
        name: editName,
        status: editStatus,
      }
      const {data} = await axios.patch(`http://127.0.0.1:8000/todos/${id}/`, updateData)
      const updatedTodos = todos.map((todo) =>{
        if(todo.id === id){
          todo.name = editName;
          todo.status = editStatus
        }
        return todo
      })
      setTodos(updatedTodos)
      setEditTodo({})
      setEditName('')
      setEditStatus(false)
      setEditUi(false)
    }
    updatePatchTodo()
  };
  return (
    <div className="min-h-screen w-full bg-slate-900 text-white flex justify-center items-start pt-20 px-4 relative">
      <div className="w-full max-w-xl">
        <h1 className="text-5xl text-center pb-5 font-bold">Todo App</h1>
        <div className="flex items-center bg-slate-700 rounded-xl px-4 py-2 gap-2">
          <input
            value={name}
            onChange={(e)=>setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addTodoHandler();
              }
            }}
            type="text"
            placeholder="Добавить задачу..."
            className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
          />
          <button onClick={addTodoHandler}>
            <PlusIcon className="w-6 h-6 text-white hover:opacity-70" />
          </button>
        </div>
        <div className="mt-5 flex flex-col space-y-5 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-10 lg:grid-cols-3">
          {
            todos?.map((todo, index)=>(
              <div className='max-w-md mx-auto w-full p-5 h-full rounded-xl bg-blue-500 flex items-center justify-between'>
                  <p 
                    onClick={()=>{
                      setEditStatus(todo.status)
                      setEditName(todo.name)
                      setEditUi(true)
                      setEditTodo(todo)
                    }}
                    key={todo.id} 
                    className='cursor-pointer
                  '>
                    {todo.name}
                    {" "}
                    {todo.status && (
                      <span className='test-xs text-gray-300'>(completed)</span>
                    )} 
                  </p>
                  <i onClick={()=>deleteTodoHandler(todo.id)}>
                    <TrashIcon className='icons'/>
                  </i>
              </div>
            ))
          }
        </div>
      </div>
          <div 
          className={`w-72 h-fit bg-white text-slate-900 absolute left-1/2 rounded xl px-3 py-2 -translate-x-1/2 top-60 -translate-y-1/2
            ${editUi ? "" : 'hidden'} `
          }>
            <div className='flex items justify-between'>
              <h1 className='text-xl mb-2'>Edit task</h1>
              <i onClick={()=>setEditUi(false)}>
                <XMarkIcon className='icons'/>
              </i>
            </div>
            <div className='flex items-center h-5 w-full space-x mb-4'>
              <input 
                type="checkbox" 
                className='h-5 w-5 mr-3' 
                checked={editStatus} 
                onChange={()=>setEditStatus(!editStatus)}
              /> 
              <i>Status</i>
            </div>
            <div>
              <input 
                type="text" 
                className='w-full px-3 py-2 bg-gray-300  rounded-2xl' 
                placeholder='change name' 
                value={editName}
                onChange={(e)=>setEditName(e.target.value)}
              />
            </div>
            <button 
              onClick={()=>editTodoHandler(editTodo.id)}
              className='w-full p-2 rounded-2xl bg-slate-700 text-white mt-2'
            >
                Update
            </button>
          </div>
    </div>
  )
}

export default App
