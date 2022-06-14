import React, { useState } from 'react';
import '../style.css';
import Chat from './Chat';
import Login from './Login';
import GetList from './GetList';

function Container(props){
    const socket = props.socket;
    const [showChat, setShowChat] = useState(false);
    const [user, setUser] = useState("");
    const [roomId, setRoomId] = useState("");

    const logout = () => {
        socket.emit("leave", {room: roomId, user: user});
        setShowChat(false);
    }

    return (
        <div>
            {showChat? 
            ( <div>
                <div className='people'>
                    List of people<hr></hr>
                    <GetList room = {roomId} socket = {socket}/>
                </div>
                <div className='logout' onClick={logout}>Leave Room [{roomId}]</div>
                <Chat socket = {socket} user = {[user, setUser]} room = {[roomId, setRoomId]}  />
                </div>
            ):<Login showChat = {[showChat, setShowChat]} socket = {socket} user = {[user, setUser]} room = {[roomId, setRoomId]} />}
        </div>
    )
}
export default Container;