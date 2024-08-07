import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa6'
import { useSelector } from 'react-redux';
import ChatBox from '../components/ChatBox';
import Chat from '../components/Chat';
import { useNavigate } from 'react-router-dom';

function MyChat() {
    const { currentUser } = useSelector(state => state.user);
    const [allChats, setAllChats] = useState([]);

    const [chatConversation, setChatConversation] = useState(null);
    const users = chatConversation?.userIds;
    const receiver = users?.filter((item) => item._id !== currentUser._id);
    const [openConversation, setOpenConversation] = useState(false);
    const navigate = useNavigate();

    const handleMyChats = ()=>{
        navigate('/');

    }

    useEffect(() => {

        const showChats = async (req, res, next) => {
            try {
                const response = await fetch('/api/chats/getChatArray', {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const data = await response.json();
                if (data.success === false) {
                    console.log('error ', data.message);
                    return;
                }
                setAllChats(data);
            } catch (error) {
                console.log(error);
            }
        }
        showChats();

    }, [])


    const handleChatConversation = async (chatId) => {
        setOpenConversation(false);
        try {
            const response = await fetch(`/api/chats/showConversation/${chatId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const data = await response.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            setOpenConversation(true);
            setChatConversation(data);
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <div className='bg-sky-100 h-lvh mt-16 w-fullplace ' >
            <div className='flex items-center w-full bg-blue-200 p-1'>
                <FaArrowLeft className='text-xl text-blue-500 cursor-pointer' onClick={ handleMyChats} />
                <span className='w-full text-center font-semibold text-2xl text-blue-500'>Messages </span>
            </div>
            {allChats.map((item, index) => (
                <div key={item._id} onClick={() => handleChatConversation(item._id)}>
                    <ChatBox chat={item} />
                </div>
            ))
            }

            {openConversation &&
                <div className='fixed bg-slate-100 w-full top-1/3 h-2/3 overflow-x-auto' >
                    <div className='fixed w-full flex items-center justify-between bg-blue-200'>
                        <FaArrowLeft onClick={() => setOpenConversation(openConversation => !openConversation)} className='text-xl text-blue-500 cursor-pointer' />
                        <p className='w-full text-center text-2xl font-semibold text-blue-500'>{receiver[0].username}</p>
                        <img className='rounded-full w-11 h-11' src={receiver[0].avatar} alt="" />
                    </div>

                    <Chat chatConversation={chatConversation} listing={false}/>
                </div>
            }
        </div>
    )
}

export default MyChat