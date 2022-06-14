import React from 'react';
import '../style.css';

function Other(props) {

    const details = props.details;
    return (
        <div className='other'>
            <div className='otherMessage'>
                <span className='user'>{details.user}</span>
                : {details.message}
            </div>
            <div className='date'>{details.time}</div>
        </div>
    )
}

export default Other;