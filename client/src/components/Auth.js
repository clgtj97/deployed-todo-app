import { useState } from "react";
import { useCookies } from "react-cookie";

const Auth = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const [isLogIn, setIsLogin] = useState(true)
  const [email, setEmail] =  useState(null)
  const [password, setPassword] =  useState(null)
  const [confirmPassword, setconfirmPassword] =  useState(null)
  const [error, setError] = useState(null)
  // store data


  const viewLogin = (status) => {
    setError(null)
    setIsLogin(status)
  }

const handleSubmit = async (e, endpoint) => {
  e.preventDefault()
  if (!isLogIn && password !== confirmPassword){
    // IF where in the sign up page and the password does not match send error
    setError('Make sure passwords match!')
    return
  }

  const response = await fetch(`${process.env.REACT_APP_SERVERURL}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({email, password})
    // wrapped our object in json in order to pass that data
  })

  const data = await response.json()
  
  console.log(data)
  
  if (data.detail) {
    setError(data.detail)
    // IF data.detail exist, show it here
  } else {
    setCookie('Email', data.email)
    setCookie('AuthToken', data.token)
    // IF NOT just set data in cookies
    window.location.reload()
  } 
  // When we send over email and pswd, I want to return my hashed pswd & email
}
  // Log in and Sign up woth data stores in const with useState(null) to start

  //change the status of log in & also clear the error value to null
    return (
      <div className="auth-container">
        <div className="auth-container-box">
          <form>
              <h2>{isLogIn ? 'Please log in' : 'Please sign up!'}</h2>
              <input 
                type="email" 
                placeholder="email" 
                onChange={(e) => setEmail(e.target.value)}
              />
              <input 
                type="password" 
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              {!isLogIn && <input 
                type="password"
                placeholder="confirm password"
                onChange={(e) => setconfirmPassword(e.target.value)}
              />}
              {/* IF isLogIn is not true, post <input /> */}
              <input type="submit" className="create" onClick={(e) => handleSubmit(e, isLogIn ? 'login' : 'signup')}/>
              { error && <p>{error}</p> }
          </form>
          <div className="auth-options">
             <button 
                onClick={() => viewLogin(false)}
                style={{backgroundColor : !isLogIn ? 'rgb(255, 255, 255)' : 'rgb(188, 188, 188'}}
              >Sign Up</button>
             <button 
              onClick={() => viewLogin(true)}
              style={{backgroundColor : isLogIn ? 'rgb(255, 255, 255)' : 'rgb(188, 188, 188'}}
            >Log In</button>
          </div>

        </div>
      </div>
    );
  }
  
  export default Auth
  