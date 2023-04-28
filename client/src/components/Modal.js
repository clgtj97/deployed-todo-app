import { useState } from "react"
import { useCookies } from "react-cookie"

const Modal = ({mode, setShowModal, getData, task}) => {
  // passing setShowModal and task as a prop to manifest data as wanted
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const editMode = mode === 'edit' ? true : false
  /* if mode equals 'edit' then we know where in edit mode or true,
   if not equal then set false */
  const [data, setData] = useState({
    user_email: editMode ? task.user_email : cookies.Email,
    title: editMode ? task.title : null,
    progress: editMode ? task.progress : 50,
    date: editMode ? task.data : new Date()
  })
//   IF ( editMode ? )editMode is true then pull (task.example) data from 'task' other wise ( : ) output 'null'
//   IF 'task' exist, manifest in user_email and pull the user_email from task if we're in editMode if not post null
/* if we are in editMode, and this is true 
  then we get the string from the object that were parsing 
  through, if not just pull current date with new Date() */
/* to save what ever the data is use useState, we const data,
   and setData to modify the data */

  const postData = async (e) => {
    e.preventDefault()
    try{
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
        // we use 'await' since it's a async function
        // parse over 'data' as a JSON object ( data is all our props from db) 
      })
      if (response.status === 200) {
        console.log('WORKED!')
        setShowModal(false)
        getData()
      }
    }catch(err) {
      console.error(err)
    }
  }

  const editData = async(e) => {
    e.preventDefault()
    try{
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${task.id}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (response.status === 200){
        setShowModal(false)
        getData()
      }
    }catch(err) {
      console.log(err)
    }
  }



  const handleChange = (e) => {
    const { name, value } = e.target
    // getting the "name" and "value" values from the object "target"
    setData(data => ({
      ...data,
      [name] : value
      // get whatever exists in there and deconstructing the date found
      // the we over-write data by getting "name" and creating a property
      // and will give it a value
    }))
    console.log(data)
  }
  
  return (
      <div className="overlay">
      <div className="modal">
        <div className="form-title-container">
          <h3>Let's {mode} your task</h3>
          <button onClick={() => setShowModal(false)}>X</button>
        </div>

        <form>
          <input
            required
            maxLength={30}
            placeholder="Your task goes here"
            name="title"
            value={data.title}
            onChange={handleChange}
          />
          <br/>
          <label for="range">Drag to select your current progress</label>
          {/* id of 'range' to be inputed into label as 'for' attribute */}
          <input
            required
            type="range"
            id="range"
            min="0"
            max="100"
            name="progress"
            value={data.progress}
            onChange={handleChange}
          />
          <input className={mode} type="submit" onClick={editMode ? editData: postData}/>
        </form>

      </div>
      </div>
    );
  }
  
  export default Modal
  