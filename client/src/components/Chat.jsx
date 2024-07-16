import React, { useEffect, useState } from 'react'
import { BiSend } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

const socket = io("http://localhost:3000");

function Chat({ chatConversation }) {
    const [chat, setChat] = useState(chatConversation);
    const { currentUser } = useSelector(state => state.user);
    const [text, setText] = useState("");
    const users = chat.userIds;
    const receiver = users.filter((item) => item._id !== currentUser._id);

    const handleChange = (e)=>{
        setText(e.target.value);
    }

    useEffect(()=>{
        socket.emit('joinChat', chat._id);

        socket.on('receiveMessage', (message) => {
            setChat((prev) => ({
                ...prev,
                messages: [...prev.messages, message]
            }));
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [chat]);

    const handleSendMessage = async (e)=>{
        e.preventDefault();
        if(text === "" || text === undefined ){
            return;
        }

        const newMessage = {
            chatId: chat._id,
            userId: currentUser._id,
            message: text,
        };
        socket.emit('sendMessage', newMessage);
        setText("");


        // try {
        //     const response = await fetch(`/api/chats/sendMessage/${chat._id}/${currentUser._id}`,{
        //         method: 'POST',
        //         headers:{
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({"message":text})
        //     })

        //     const data = await response.json();
        //     console.log("data", data);
        //     if(data.success === false){
        //         console.log(data.message);
        //         return;
        //     }
        //     setText("");
        //     setChat((prev)=>({...prev , messages:[...prev.messages , data] }));

        // } catch (error) {
        //     console.log(error);
        // }
    }

    return (
        <div className='w-full mt-14'>            
            <div className='flex flex-col gap-1 mx-1 my-2 mb-24 overflow-y-scroll'>
                {
                    chat.messages.map((item, index) => (
                        <div key={item._id} className={`${item.userId === currentUser._id ? 'bg-green-200 w-fit self-end' : 'self-start bg-blue-200 w-fit'} p-2 rounded-md`}>{item.message}</div>
                    ))
                }
            </div>

            <form className='fixed bottom-0 w-full flex items-center' onSubmit={handleSendMessage}>
                
                <input className='bg-slate-200 p-2 text-lg rounded-md w-full outline-none' value={text} onChange={handleChange} type="text" name="message" id="message" />
                <BiSend className='text-3xl mr-2' onClick={handleSendMessage} />
            </form>
        </div>
    )
}

export default Chat;