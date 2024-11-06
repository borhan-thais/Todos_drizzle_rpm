"use client"; 
import { AppType } from "../../server";
import {hc} from 'hono/client';
import './globals.css'
import { useEffect, useState } from 'react';


const client = hc<AppType>('http://localhost:8000/')



interface Todo {
  id: number;
  name: string;
  status: 'todo' | "inProgress" | "completed";
}


export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);  
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    getTodos();
  }, []);
  const getTodos = async () => {
    try{
      const res = await client.index.$get()
      const todos =await res.json();
      console.log('todos:',todos)
      setTodos(todos);
    }catch(error){
      console.error('Error fetching todos:', error)
    }
    }


    const updateStatus= async (id:number,status:'inProgress' | 'completed')=>{
      try{
        await client[":id"].$put({
          param:{id: id.toString()},
          json: { status },
        });
        getTodos()
      }catch(error){
        console.error('Error Updating task:', error);
      }
    }


    const createTodo = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newTask) return;
      try {
        await client.index.$post({
          json: {
            name: newTask,
            status: 'todo' 
          }
        });
        setNewTask('');
        getTodos();
      } catch (error) {
        console.error('Error adding task:', error);
      }
    };
  
return (
<div className="outerDiv flex items-center min-h-screen justify-center">
      <div className="cardBody w-3/4 text-center h-auto p-10 shadow-2xl rounded-md">
        <section className="title text-lg sm:text-4xl font-bold">
          <h1 className="mb-4 sm:-mb-4 ">Task Manager</h1>
          <span className=" text-base font-normal  text-gray-500 mt-{-4px}">Stay organized and productive with our intutive to-do app.</span>
        </section>
        <form className="pt-5" onSubmit={createTodo}>
          <input type="text" 
          placeholder="Add a new task in todo" 
          value={newTask}
          onChange={(e)=>setNewTask(e.target.value)}
          className="addInput focus:placeholder-transparent border mt-4 mr-5 h-10 w-2/5 mb-10 rounded-lg bg-gray-100 p-5 sm:mb-0"></input>
          <button className="addButton border text-white bg-gray-900 w-32 h-10 rounded-lg ">Add Task</button>
        </form>
        <section className="cards justify-center card flex flex-col gap-10 sm:flex-row">
        

          <div className="todoCard w-56 h-50 border rounded-lg shadow-lg mt-10 mb-10 sm:w-96 sm:h-60 sm:ml-0">
            <section className="todoBody rounded-t-lg cardHeading h-14 bg-blue-100 text-left font-bold p-4">To Do
            </section>
            <div className="mainBody overflow-y-scroll h-40 flex flex-col items-start  p-5">
            {todos.filter((todo)=>todo.status==='todo').map(todo=>(
              <button key={todo.id} onClick={()=>updateStatus(todo.id,'inProgress')} className="w-full p-2 mb-2 bg-gray-50 rounded">{todo.name}
        </button>
            ))}
            </div>
          </div>


          <div className="progressCard w-56 h-50  border rounded-lg shadow-lg mt-10 mb-10 sm:w-96 sm:h-60">
            <section className="rounded-t-lg cardHeading h-14 bg-purple-50 text-left font-bold p-4">In Progess
            </section>
            <div className="progressList overflow-y-scroll h-40 flex flex-col items-start  p-5">
            {todos.filter((todo)=>todo.status==='inProgress').map(todo=>(
              <button key={todo.id} onClick={()=>updateStatus(todo.id,'completed')} className="w-full p-2 mb-2 bg-gray-50 rounded">{todo.name}
        </button>
            ))}
            </div>
          </div>


          <div className="completedCard w-56 h-50  border rounded-lg shadow-lg mt-10 mb-10 sm:w-96 sm:h-60">
            <section className="rounded-t-lg cardHeading h-14 bg-green-100 text-left font-bold p-4">Completed</section>
            <div className="completedList flex flex-col items-start  p-5 overflow-y-scroll h-40">
            {todos.filter((todo)=>todo.status==='completed').map(todo=>(
              <button key={todo.id} className="w-full p-2 mb-2 bg-gray-50 rounded">{todo.name}
        </button>
            ))}
            </div>
          </div>
        </section>
       </div>
    </div>

  );
}