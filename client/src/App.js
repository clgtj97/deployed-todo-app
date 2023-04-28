import ListHeader from './components/ListHeader'
import ListItem from './components/ListItem'
import Auth from './components/Auth'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const authToken = cookies.AuthToken
  const userEmail = cookies.Email
  const [ tasks, setTasks] = useState(null)
  // save json to the with useState


  const getData = async () => {
    try{
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${userEmail}`)
      const json = await response.json()
      setTasks(json)
    }catch (err) {
      console.error(err)
    }
  }
  // fetch is an async method, returns a promise , gives a result
  // Backticks `` are used to parce a parameter, in this case user_email

  useEffect(() => { 
    if (authToken) {
      getData()
    }}
  , [])
  // parsed empty dependencie, runs twice but helps us get our data
  // add empty dependecie to run once

  console.log(tasks)
// Sort taks by date
 const sortedTasks = tasks?.sort((a,b) => new Date(a.date) - new Date(b.date))

  return (
    <div className='app'>
      {!authToken && <Auth />}
      {authToken &&
        <>
        <ListHeader listName={'🏝 Holiday tick list'} getData={getData}/>
        <p className="user-email">Welcome back {userEmail}</p>
        {sortedTasks?.map((task) => <ListItem className="list-item" key={task.id} task={task} getData={getData}/>)}
        </>}
        <p className="copyright">Creative Coding LLC</p>
    </div>
  );
}

export default App
