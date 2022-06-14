import React from 'react';
import '../style.css';

function You(props) {

    const details = props.details;
    return (
        <div className='you'>
            <div className='yourMessage'>
                <span className='user'>You</span>
                : {details.message}
            </div>
            <div className='date'>{details.time}</div>
        </div>
    )
}

export default You;