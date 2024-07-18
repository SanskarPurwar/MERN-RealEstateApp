import React, { useEffect, useRef, useState } from 'react'
import { BiSend } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

const socket = io("http://localhost:3000");

function Chat({ chatConversation: chatConversation, listing }) {
    const [chat, setChat] = useState(chatConversation);
    const { currentUser } = useSelector(state => state.user);
    const [text, setText] = useState("");


    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [chat.messages]);


    const handleChange = (e) => {
        setText(e.target.value);
    }
    useEffect(() => {
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

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (text === "" || text === undefined) {
            return;
        }

        const newMessage = {
            chatId: chat._id,
            userId: currentUser._id,
            message: text,
        };
        socket.emit('sendMessage', newMessage);
        setText("");
    }

    return (
        <div className='w-full mt-14'>
            <div className='flex flex-col gap-1 mx-1 my-2 mb-14 sm:mb-20 md:mb-24 overflow-y-scroll'>
                {
                    chat.messages.map((item, index) => (
                        <div key={item._id} className={`${item.userId === currentUser._id ? 'bg-green-200 w-fit self-end' : 'self-start bg-blue-200 w-fit'} p-2 rounded-md text-xs sm:text-sm lg:text-lg`}>{item.message}</div>
                    ))
                }
                <div ref={messagesEndRef} />
            </div>
            <form className={`${listing ? 'w-2/3 sm:w-1/3 bottom-10' : 'w-full bottom-0'} fixed flex items-center`} onSubmit={handleSendMessage}>
                    <input className="bg-slate-200 text-sm rounded-md outline-none flex-grow py-2" value={text} onChange={handleChange} type="text" name="message" id="message" />
                    <button type='submit'>
                        <BiSend className="text-md sm:text-2xl cursor-pointer mr-3"/>
                    </button>
            </form>

        </div>
    )
}

export default Chat;