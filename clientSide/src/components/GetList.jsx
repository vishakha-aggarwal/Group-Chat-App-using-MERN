import React, { useEffect, useState } from 'react';
const api_base = "http://localhost:3001";

function GetList(props) {
    
    const room = props.room;
    const socket = props.socket;
    const [list, setList] = useState([]);
    
    useEffect(() => {
      setInterval(() => {
        GetUsers();
      }, 5000);
    },[]);
    
    const GetUsers = () => {
        setList([]);
        fetch(api_base + "/" + room)
            .then(res => res.json())
            .then((data) => { 
        data.map((val, idx) => {
          setList((oldList) => {
            return [...oldList, {user: val.username, userId: val.userId}];
          })
        })
      })
      .catch((err) => console.error("Not connected"));
    }

    return (
        <div>
          {list.map((user) =>{
              return (
                  <div className="username">
                      {user.user}
                  </div>
              )
          })}
        </div>
    )

}

export default GetList;