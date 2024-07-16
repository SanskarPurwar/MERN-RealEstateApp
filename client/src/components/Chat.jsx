import React, { useEffect, useState } from 'react'
import { BiSend } from 'react-icons/bi';
import { FaArrowLeft } from 'react-icons/fa6';
import { useSelector } from 'react-redux';

function Chat({ chatConversation }) {
    const { currentUser } = useSelector(state => state.user);
    const [text, setText] = useState("");
    const users = chatConversation.userIds;
    const receiver = users.filter((item) => item._id !== currentUser._id);
    const [messages, setMessages ]= useState(chatConversation.messages);

    const handleChange = (e)=>{
        setText(e.target.value);
    }

    useEffect(()=>{
        console.log(messages);
    }, [messages]);

    const handleSendMessage = async (e)=>{
        if(text === "" || text === undefined ){
            return;
        }
        try {
            const response = await fetch(`/api/chats/sendMessage/${chatConversation._id}/${currentUser._id}`,{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({"message":text})
            })

            const data = await response.json();
            console.log(data);
            if(data.success === false){
                console.log(data.message);
                return;
            }
            setText("");
            setMessages((prevMessages)=>{messages:[...prevMessages , text]});

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='w-full'>            
            <div className='flex flex-col gap-1 ml-1 my-2'>
                {
                    messages.map((item, index) => (
                        <div key={item._id} className={`${item.userId === currentUser._id ? 'bg-green-200 w-fit place-content-end' : 'text-start bg-blue-200 w-fit'} p-2 rounded-md`}>{item.message}</div>
                    ))
                }
            </div>

            <div className='fixed w-1/2 bottom-5 flex items-center'>
                
                <input className='bg-slate-200 p-2 rounded-md w-full outline-none' value={text} onChange={handleChange} type="text" name="message" id="message" />
                <BiSend className='text-2xl' onClick={handleSendMessage} />
            </div>
        </div>
    )
}

export default Chat