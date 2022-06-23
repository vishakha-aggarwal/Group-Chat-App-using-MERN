import React, { useEffect, useRef, useState } from 'react';
import You from './You';
import Other from './Other';
import '../style.css';
const api_base = "https://chat-in-group.netlify.app/";

function Chat(props){

    const socket = props.socket;
    const [user, setUser] = props.user;
    const [roomId, setRoomId] = props.room;
    const [msg, setMsg] = useState("");
    const [msgList, setMsgList] = useState([]);
    const msgEndRef = useRef(null);


    //call the database
    const GetChat = () => {
    
        setMsgList([]);
		fetch(api_base + '/prevChat/' + roomId)
			.then(res => res.json())
			.then((data) => { 
        data.map((val, idx) => {
          setMsgList((oldList) => {
            return [...oldList, {room: roomId, user: val.username, message: val.message, time: val.date}];
          })
        })
      })
      .catch((err) => console.error("not connected"));
    }

    function getDate()
    {     
        const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
        let date = new Date(Date.now()).getDate();
        let month = new Date(Date.now()).getMonth();
        let hr = new Date(Date.now()).getHours();
        let min = new Date(Date.now()).getMinutes();
   
        let ans;
        let h = hr;
        if(hr > 12)
            h = hr%12;
        if(h < 10)
            h = "0" + h;
        if(min < 10)
            min = "0" + min;
        if(h === "00")
            h = "12";
        ans = date + " " + monthName[month] + " " + h + ":" + min;
        if(hr > 12)
            ans+= " pm";
        else
            ans+= " am";

        return ans;
    }

    function addChat(details, id) {
        fetch(api_base + '/newChat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ room: details.room,
            message: details.message,
            userId: id,
            username: details.user,
            date: details.time
            })
        })
        .then(res => res.json())
        .catch((err) => console.error("Not connected"));
    }

    const sendMsg = async () => {
        if (msg !== "") {
            const messageData = {
                room: roomId,
                user: user,
                message: msg,
                time: getDate()
            };
            await socket.emit("send", messageData);
            setMsgList((oldlist) => [...oldlist, messageData]);
            document.getElementsByClassName("inpMsg").msg.value = "";
            setMsg("");
            //here post request to be made
            
            addChat(messageData, socket.id);
            
        }
    };
    
    useEffect(() => {
        socket.off("receive").on("receive", (data) => {
          setMsgList((list) => [...list, data]);
        });
        GetChat();
      }, [socket]);
     
    function scrollIntoView(){

    }

    useEffect(() => {
        let ele = document.querySelector(".msg");
        ele.scrollTop = ele.scrollHeight;
        // msgEndRef.current?.scrollIntoView();
    }, [msgList]);

    return (

        <div className='container'>
            <div className = "msg" >      
                {msgList.map((details) => {
                    return details.user === user? <You details = {details} /> : <Other details = {details} />
                })}
                <div ref={msgEndRef} />
            </div>
            

            <div className = "sendBox">
                <input className = "inpMsg" type = "text" name = "msg" placeholder = "Enter the message" onChange={e => setMsg(e.target.value)} onKeyPress={(e) => {
                    if (e.key === "Enter") 
                        {sendMsg()}
                    }}  
                />
                <button className='send' onClick={sendMsg} >Send</button>
            </div>
        </div>
    )
}
export default Chat;