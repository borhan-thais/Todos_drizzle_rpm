"use client"; 
import { AppType } from "../../server";
import {hc} from 'hono/client';
import './globals.css'
import { useEffect, useState } from 'react';
import { error } from "console";


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

    const deleteTodo=async (id:number)=>{
      try{
        await client[":id"].$delete({
          param:{id:id.toString()
          }
        })
        getTodos()
      }catch(error){
        console.error('Error fetching todos:',error)
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
      <div className="relative cardBody w-auto text-center h-auto p-10 shadow-2xl rounded-md xl:w-auto md:w-[1000px] sm:w-[700px]">
        <section className="title text-lg sm:text-4xl font-bold">
          <h1 className="mb-4 sm:-mb-4 ">Task Manager</h1>
          <span className=" text-base font-normal  text-gray-500 mt-{-4px}">Stay organized and productive with our intutive to-do app.</span>
        </section>
        <form className="pt-5" onSubmit={createTodo}>
          <input type="text" 
          placeholder="Add a new task in todo" 
          value={newTask}
          onChange={(e)=>setNewTask(e.target.value)}
          className="addInput focus:placeholder-transparent border text-xs mt-4 mr-5 h-10 w-2/5 mb-10 rounded-lg bg-gray-100 p-5 sm:mb-0 sm:text-base"></input>
          <button className="addButton border text-white bg-gray-900 w-32 h-10 rounded-lg ">Add Task</button>
        </form>
        <section className="cards justify-center items-center card flex flex-col gap-10 md:grid md:grid-cols-2 xl:flex xl:flex-row">
        

          <div className="todoCard w-56 h-50 border rounded-lg shadow-lg mt-10 mb-10 sm:w-96 sm:h-60 sm:ml-0 ">
            <section className="todoBody rounded-t-lg cardHeading h-14 bg-blue-100 text-left font-bold p-4">To Do
            </section>
            <div className="mainBody ounded-xl overflow-y-scroll h-40 flex flex-col items-start p-5">
            {todos.filter((todo)=>todo.status==='todo').map(todo=>(
              <div key={todo.id} className="gap-2 text-xs sm:text-base flex flex-row w-auto h-auto bg-stone-100 p-2 mb-2 rounded-xl">  
                <div className=" text-start w-16 h-auto sm:h-auto sm:w-48 flex p-2 bg-stone-100 ">{todo.name}
                </div>
                <div className="items-center justify-center flex flex-row gap-2 ">
                  <button onClick={()=>updateStatus(todo.id,'inProgress')} className=" hover:bg-green-300 h-8 text-xs sm:h-10 hover:text-white border rounded-xl sm:text-sm p-1">Done
                  </button>
                  <button onClick={()=>deleteTodo(todo.id)} className=" hover:bg-red-400 h-8 text-xs sm:h-10 hover:text-white border rounded-xl sm:text-sm p-1">Delete</button>
                </div>
              </div>
        
            ))}
            </div>
          </div>


          <div className="progressCard w-56 h-50 border rounded-lg shadow-lg mt-10 mb-10 sm:w-96 sm:h-60 sm:ml-0">
            <section className="rounded-t-lg cardHeading h-14 bg-purple-50 text-left font-bold p-4">In Progess
            </section>
            <div className="progressList overflow-y-scroll h-40 flex flex-col items-start  p-5">
            {todos.filter((todo)=>todo.status==='inProgress').map(todo=>(
               <div key={todo.id} className="gap-2 text-xs sm:text-base flex flex-row w-auto h-auto bg-stone-100 p-2 mb-2 rounded-xl">
                  <div  className=" text-start w-16 h-auto sm:h-auto sm:w-48 flex p-2 bg-stone-100 ">{todo.name}
                  </div>
                  <div className="items-center justify-center flex flex-row gap-2 ">
                  <button  onClick={()=>updateStatus(todo.id,'completed')} className=" hover:bg-green-300 h-8 text-xs sm:h-10 hover:text-white border rounded-xl sm:text-sm p-1" >
                    Done
                  </button>
                  <button onClick={()=>deleteTodo(todo.id)} className=" hover:bg-red-400 h-8 text-xs sm:h-10 hover:text-white border rounded-xl sm:text-sm p-1">
                    Delete
                  </button>
                  </div>
               </div>
            ))}           
            </div>
          </div>


          <div className="completedCard w-56 h-50 border rounded-lg shadow-lg mt-10 mb-10 sm:w-96 sm:h-60 sm:ml-0">
            <section className="rounded-t-lg cardHeading h-14 bg-green-100 text-left font-bold p-4">
              Completed
            </section>
            <div className="completedList flex flex-col items-start  p-5 overflow-y-scroll h-40">
            {todos.filter((todo)=>todo.status==='completed').map(todo=>(
              <div key={todo.id} className="gap-2 text-xs sm:text-base flex flex-row w-auto h-auto bg-stone-100 p-2 mb-2 rounded-xl">
                <div  className=" text-start w-24 h-auto sm:h-auto sm:w-60 flex p-2 bg-stone-100">{todo.name}               
                </div>
                <div className="items-center justify-center flex flex-row pr-2">
                  <button  onClick={()=>deleteTodo(todo.id)} className="hover:bg-red-400 h-8 text-xs sm:h-10 hover:text-white border rounded-xl sm:text-sm p-1" >Delete
                  </button>
                </div>
              </div>
            ))}
            </div>
          </div>
        </section>
       </div>
    </div>

  );
}