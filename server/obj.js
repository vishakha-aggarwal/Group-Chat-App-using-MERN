let userList = [];

function insert(room, user, userid)
{
    let idx = userList.findIndex(userObj => userObj.room === room);
    if(idx == -1 || idx == userList.length) {
        idx = userList.length;
        userList.push({
            "room": room,
            "users": []
        })
    }
    userList[idx].users.push({
        username: user,
        userId: userid
    })
}

function deleteUserFromRoom(room, userid)
{
    let idx = userList.findIndex(userObj => userObj.room === room);
    let index = userList[idx].users.findIndex(users => users.userId === userid);
    
    userList[idx].users.splice(index, 1);
}

function deleteUser(userId)
{
    for(let idx = 0; idx < userList.length; idx++) 
    {
        let index = userList[idx].users.findIndex(users => users.userId === userId);
        if(index != -1 && index != userList[idx].users.length)
        {
            userList[idx].users.splice(index, 1);
            if(userList[idx].users.length == 0)
                userList.splice(idx, 1);
            return;
        }
    }
}

// insert(123, "A", 123);
// insert(123, "B", 124);
// insert(123, "C", 125);
// insert(124, "A", 126);
// insert(124, "B", 127);
// deleteUser(123);
// deleteUser(126);
// deleteUser(125);
// deleteUser(127);

console.log(userList);

// deleteUserFromRoom(123, 123);
// deleteUserFromRoom(123, 124);
// deleteUserFromRoom(124, 126);

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
if(h == "00")
    h = "12";
ans = date + " " + monthName[month] + " " + h + ":" + min;
if(hr > 12)
    ans+= " pm";
else
    ans+= " am";

console.log(ans);