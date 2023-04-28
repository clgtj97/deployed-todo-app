import { useState } from "react";
import Modal from "./Modal";
import { useCookies } from "react-cookie";


const ListHeader = ({ listName, getData }) => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const [showModal, setShowModal] = useState(false)

  const signOut = () =>{
    console.log('sign out')
    removeCookie('Email')
    // delete Email cookie
    removeCookie('AuthToken')
    // delete AuthToken Cookie
    window.location.reload()
    // refresh page
  }



    return (
      <div className="list-header">
        <h1>{listName}</h1>
        <div className="button-container">
          <button className="create" onClick={() => setShowModal(true)}>ADD NEW</button>
          <button className="signout" onClick={signOut}>SIGN OUT</button>
        </div>
        {showModal && <Modal mode={'create'} setShowModal={setShowModal} getData={getData}/>}
        {/* --> parsing the mode of 'create' throgh the Modal div atribute of 'mode'.
            --> also parsing the setShowModal to be ables to close the modal from Modal*/}
      </div>
    )
  }
  
  export default ListHeader
  
  