import React from 'react'
import { useSelector } from 'react-redux'

function ChatBox({ chat }) {
    const { currentUser } = useSelector(state => state.user);
    const users = chat.userIds;
    const receiver = users.filter((item) => item._id !== currentUser._id);
    return (
        <ul className='flex items-center border bg-blue-50 p-3 cursor-pointer'>
            <img className='rounded-full w-12 h-12 m-2' src={receiver[0].avatar} alt="" />
            <ul className='ml-2'>
                <li className='font-semibold'>{receiver[0].username}</li>
                <li>{chat.lastMessage}</li>
            </ul>
        </ul>

    )
}

export default ChatBox