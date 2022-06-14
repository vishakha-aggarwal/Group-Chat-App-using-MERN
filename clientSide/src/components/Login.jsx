import React from 'react';
import '../style.css';

function Login(props){

    const socket = props.socket;
    const [showChat, setShowChat] = props.showChat;
    const [user, setUser] = props.user;
    const [roomId, setRoomId] = props.room;

    const joinRoom = async () => {

        if(user !== "" && roomId !== "")
        {
            await socket.emit("join", {room: roomId, user: user});
            setShowChat(true);
        }
    }

    return (
        <div className = "login">
            Fill the details to enter the chat <br/>
            <div className='details'>
                Username<br />
                <input className = "inpLogin" type = "text" name = "userName" placeholder = "Enter username" onChange={e => setUser(e.target.value)}/><br />
                Room Id<br />
                <input className = "inpLogin" type = "text" name = "roomId" placeholder = "Enter Room Id" onChange={e => setRoomId(e.target.value)}/><br />
                <button  className = "join" onClick={joinRoom}>Join the chat</button>
            </div>
        </div>
    )
}
export default Login;