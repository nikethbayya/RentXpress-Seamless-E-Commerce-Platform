import { useEffect, useState, useRef } from "react";
import "./../styles/messaging.css"
import { useNavigate, useSearchParams } from "react-router-dom";
import SendIcon from '@mui/icons-material/Send';
import { collection, addDoc, onSnapshot, query, where, setDoc, getDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { useUser } from "../hooks/UserContext";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { CreateGroupChatPopup } from "../components/CreateGroupChatPopup";
import { compareTwoArrays } from "../helper/compareTwoArrays";

export const Messaging = () => {
    const { user, loginData } = useUser();
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef(null);
    const conversationsRef = collection(db, 'conversations');
    const [otherUserDetails, setOtherUserDetails] = useState([]);
    const [userStatuses, setUserStatuses] = useState({});
    const [showCreateGrpChatPopup, setShowCreateGrpChatPopup] = useState(false)
    const bottomDivRef = useRef()

    const scrollToBottom = () => {
        if(bottomDivRef?.current) {
            bottomDivRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleMessageCardClick = (conversation) => {
        console.log('message card clicked', conversation)
        setSelectedConversation(conversation);
        setNewMessage('');
    };

    const handleNewMessageChange = (event) => {
        setNewMessage(event.target.value);

        if (!isTyping) {
            setIsTyping(true);
        }
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
        }, 1000);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (newMessage.trim() === '') return;

        if (selectedConversation.isNew) {
            await addDoc(conversationsRef, {
                users: [...selectedConversation.users],
                messagesId: selectedConversation.messagesId
            });
        }

        await setDoc(doc(db, "messages", selectedConversation.messagesId), {
            messages: [
                ...messages,
                {
                    id: uuidv4(),
                    text: newMessage,
                    createdAt: Date.now(),
                    sentBy: user.user_id,
                }
            ]
        });

        setNewMessage('');
        setIsTyping(false);
        clearTimeout(typingTimeoutRef.current);
        await getUserConversations(null);
    };

    const getUserConversations = async (otherUsers) => {
        const conversationsQuery = query(conversationsRef, where('users', 'array-contains', user.user_id));
        console.log('otherUsers', otherUsers)
        const unsubscribe = onSnapshot(conversationsQuery, (querySnapshot) => {
            const conversationsArray = [];
            let isNewChat = true;
            querySnapshot.forEach((doc) => {
                const docData = doc.data();
                if (compareTwoArrays(otherUsers, docData.users.filter(u => u != user.user_id))) {
                    isNewChat = false;
                    setSelectedConversation(docData);
                }
                conversationsArray.push(docData);
            });
            setConversations(conversationsArray);
            console.log('conversationsArray', conversationsArray)
            console.log('isNewChat', isNewChat)
            if (otherUsers && otherUsers?.length > 0 && isNewChat) {
                const newConversation = {
                    users: [...otherUsers, user.user_id],
                    messagesId: uuidv4(),
                    isNew: true,
                    createdBy: user.user_id
                };
                console.log('newConversation', newConversation)
                setSelectedConversation(newConversation);
                setConversations(prevConversations => [...prevConversations, newConversation]);
            }
        });

        return () => unsubscribe();
    };

    const getEachOtherUserDetailById = (id) => {
        if (otherUserDetails?.length > 0) {
            const userDetails = otherUserDetails.find(u => u.user_id === id);
            const onlineStatus = userStatuses[id] ? "Online" : "Offline";
            return { ...userDetails, onlineStatus };
        }
        return {}
    };

    useEffect(() => {
        const getAllUserDetailsById = async () => {
            let userIds = [];
            conversations.forEach(conversation => {
                conversation.users.forEach(u => {
                    if (u !== user.user_id) {
                        userIds.push(u);
                    }
                });
            });
            const response = await axios.post(`${process.env.REACT_APP_LOGIN_SERVICE}/get-multiple-user-details-by-id`, {
                userIds: userIds
            });
            setOtherUserDetails(response.data.userDetails);

            // Fetch online status for each user
            userIds.forEach(userId => {
                const statusRef = doc(db, "userStatus", userId);
                onSnapshot(statusRef, (doc) => {
                    const data = doc.data();
                    setUserStatuses(prevStatuses => ({
                        ...prevStatuses,
                        [userId]: data?.online
                    }));
                });
            });
        };

        if (conversations.length > 0) {
            getAllUserDetailsById();
        }
        console.log('conversations', conversations)
    }, [conversations]);

    useEffect(() => {
        if (selectedConversation) {
            const unsubscribe = onSnapshot(doc(db, "messages", selectedConversation.messagesId), (doc) => {
                const data = doc.data();
                if (data && data.messages) {
                    setMessages(data.messages);
                }
                else {
                    setMessages([])
                }
            });

            return () => unsubscribe();
        }
        console.log('selectedConversation', selectedConversation)
    }, [selectedConversation]);

    useEffect(() => {
        const user_id = searchParams.get('user_id');
        if (loginData.isLoggedIn) {
            if (user_id) {
                getUserConversations([user_id]);
            }
            getUserConversations(null)
        }
    }, [loginData.isLoggedIn]);

    const handleCreateGroupChat = async (userIds) => {
        console.log('grp clicked')
        await getUserConversations(userIds)
    }

    const toggleCreateGrpChatPopup = () => {
        setShowCreateGrpChatPopup((prev) => !prev)
    }

    if (!loginData.isLoggedIn) {
        return <>Please sign in</>;
    }

    return (
        <div id="Messaging">
            <div className="message-cards-window-wrapper">
                <div className="message-cards-window">
                    {conversations.map((conversation) =>
                        conversation?.users && (
                            <div
                                key={conversation.messagesId}
                                className={"message-card " + (selectedConversation?.messagesId === conversation?.messagesId ? 'selected' : '')}
                                onClick={() => handleMessageCardClick(conversation)}
                            >
                                {conversation?.users?.length > 2 && <p>Group Chat:</p>}
                                {conversation.users.filter(u => u != user.user_id).map((cUser) =>
                                    <div key={cUser} className="user-details-on-card">
                                        <p className="username">{getEachOtherUserDetailById(cUser).username}</p>
                                        -
                                        <span className={"status" + (getEachOtherUserDetailById(cUser)?.onlineStatus?.toLowerCase() == 'online' ? " online" : "")}>{getEachOtherUserDetailById(cUser).onlineStatus}</span>
                                    </div>
                                )}
                            </div>
                        )
                    )}
                    {user.is_admin && <button type="button" className="create-grp-chat-button" onClick={toggleCreateGrpChatPopup}>Create a group chat</button>}
                </div>
            </div>
            <div className="messages-window-wrapper">
                <div className="messages-window">
                    {selectedConversation ?
                        <>
                            <div className="messages-div">
                                {
                                    messages.map((message) =>
                                        <div
                                            key={message.id}
                                            className={"message-bubble " +
                                                (message.sentBy == user.user_id ? 'by-me' : '')}
                                        >
                                            {(message.sentBy != user.user_id) && <p className="name">{getEachOtherUserDetailById(message.sentBy).username}:</p>}
                                            {message.text}
                                        </div>
                                    )
                                }
                                <div id="bottom-msg-div" ref={bottomDivRef}></div>
                            </div>
                            <div className="chat-input-div">
                                <form onSubmit={handleSubmit} className='chat-input-form'>
                                    <input
                                        type='text'
                                        value={newMessage}
                                        onChange={handleNewMessageChange}
                                        className='chat-input'
                                        placeholder='Type your message here...'
                                    />
                                    <button type='submit' className='chat-submit-button'>
                                        <SendIcon color='white' />
                                    </button>
                                </form>
                            </div>
                        </>
                        : <div className="no-conversations-msg">
                            {
                                conversations.length > 0 ? <>Choose a conversation to see the messages</> :
                                    <>There are no conversations present</>
                            }
                        </div>
                    }
                </div>
            </div>
            <CreateGroupChatPopup show={showCreateGrpChatPopup} closeModal={toggleCreateGrpChatPopup} create={handleCreateGroupChat} />
        </div>
    );
};
