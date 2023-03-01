import {useState,useEffect} from "react"
import axios from "axios"
import {AiOutlineClose} from "react-icons/ai"

export default function Home(){
    let token = localStorage.getItem("token")
    let [tasks, setTasks] = useState([])
    let [taskData, setTaskData] = useState({
        description:"",
        important:false,
        date:new Date().toISOString().split("T")[0]
    })
    let [taskDataUpdate, setTaskDataUpdate] = useState({
        description:"",
        important:false,
        date:new Date().toISOString().split("T")[0]
    })
    let [setError] = useState("")
    useEffect(()=>{
        function getTasks(){
            axios.get("/tasks",{
                headers:{
                    "token":token
                }
            })
            .then(res=>{
                if(res.data.auth === false){
                    window.location="/login"
                }else{
                    console.log(res.data)
                    let updatedItems = res.data.tasks.map(task=>{
                        task["update"] = false
                        return task
                    })
                    setTasks(updatedItems)
                }
            })
            .catch(err=>{
                console.log(err)
            })
        }
        getTasks()
    },[token])
    console.log(tasks)
    function addTask(){
        axios.post("/tasks/add",taskData,{
            headers:{
                "token":localStorage.getItem("token")
            }
        })
        .then(res=>{
            if(res.data.auth===false){
                window.location="/login"
            }else if(res.data.imported === true){
                setTasks([...tasks, taskData])
                setTaskData({description:""})
                setError(undefined)
            }else{
                setError("Invalid data, try again")
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }

    function deleteTask(id){
        console.log(id)
        axios.get(`/tasks/delete/${id}`,{
            headers:{
                "token":localStorage.getItem("token")
            }
        })
        .then(res=>{
            if(res.data.deleted){
                setTasks(tasks.filter(task=>task.id !== id))
            }else if(!res.data.deleted){
                setError(res.data.error)
            }else{
                window.location = "login"
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }

    function updateTask(id){
        console.log(taskData)
        axios.post(`/tasks/update/${id}`, taskDataUpdate, {
            headers:{
                "token":localStorage.getItem("token")
            }
        })
        .then(res=>{
            if(res.data.updated === true){
                
                let updatedData = tasks.map(task=>{
                    if(task.id === id){
                        task.description = taskDataUpdate.description
                        task.important = taskDataUpdate.important
                        task.update = false
                    }
                    return task
                })
                setTasks(updatedData)
                
            }else{
                setError(res.data.error)
                console.log(res.data)
            }
            setTaskDataUpdate({description:"", important:false})
        })
        .catch(err=>{
            console.log(err)
        })
    }
    function changeTaskMode(id,tasks, value){
        let updatedTasks = tasks.map(task=>{
            if(task.id === id){
                task.update = value
                setTaskDataUpdate({...taskDataUpdate, description:task.description, important:task.important})
            }else{
                task.update = false
            }
            
            return task

        })
        setTasks(updatedTasks)
    }
    return <div id="home">
        <div id="task-form">
            <label htmlFor="task-desc">Task desctiption</label>
            <input id="task-desc" type="text" value={taskData.description} onChange={(e)=>setTaskData({...taskData,description:e.target.value})}/>

            <label htmlFor="important">Important</label>
            <input type="checkbox" value={taskData.important} onClick={()=>setTaskData({...taskData,important:!taskData.important})}/>

            <button className="task-btn" id="task-btn" onClick={()=>addTask()}>Add</button>
        </div>
        {tasks.map(task=>{
            let taskDate = task.date.split("T")[0]
            return <div className="task" key={task.id}>
            {task.update ? 
            <div class="task-wrap" id="update-form">
                <input type="text" id="update-desc" value={taskDataUpdate.description} onChange={e=>setTaskDataUpdate({...taskDataUpdate, description:e.target.value})}/>
                <label htmlFor="important">Important </label>
                <input id="important" type="checkbox" defaultChecked={taskDataUpdate.important} value={task.important} onClick={()=>setTaskDataUpdate({...taskDataUpdate, important:!task.important})}/>
                <AiOutlineClose onClick={()=>changeTaskMode(task.id,tasks,false)}/>
            </div>
            : 
            <div class="task-wrap" onClick={()=>changeTaskMode(task.id,tasks,true)} id="task-text"><p className={task.important ? "important":""} id="task-p">{task.description}</p></div>
            
            }
           
            <div id="task-date">{taskDate}</div>
            <button className="task-btn" id="update-btn" onClick={()=>updateTask(task.id)}>Update</button>
            <button className="task-btn" id="delete-btn" onClick={()=>deleteTask(task.id)}>Delete</button>
        </div>
        })}

    </div>
}