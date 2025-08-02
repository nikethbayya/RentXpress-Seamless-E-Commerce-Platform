import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../firebase-config';
import {
  collection,
  addDoc,
  where,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  // you would add 'updateDoc' and 'doc' imports here if you're implementing read receipts
} from 'firebase/firestore';
import '../styles/Chat.css';

export const Chat = ({ room }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const messagesRef = collection(db, 'messages');
  const [expanded, setExpanded] = useState(true); 

  useEffect(() => {
    const q = query(messagesRef, where('room', '==', room), orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
        // Here you would check if the message is read and add a 'read' field to the message object
      });
      setMessages(messages);
    });

    return () => unsubscribe();
  }, [room]);

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);

    if (!isTyping) {
      setIsTyping(true);
      // Here you would inform the backend that the user is typing
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      // Here you would inform the backend that the user stopped typing
    }, 1000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newMessage.trim() === '') return;

    await addDoc(messagesRef, {
      text: newMessage.trim(),
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName,
      room,
      // You would also set a 'read' field to false initially here
    });

    setNewMessage('');
    setIsTyping(false);
    clearTimeout(typingTimeoutRef.current);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`chat-container ${expanded ? '' : 'collapsed'}`}>
      {expanded ? (
        <>
      <div className='chat-header'>
        <h1>Welcome to: {room.toUpperCase()}</h1>
        <button onClick={toggleExpand} className='chat-toggle-button'>-</button>
      </div>
      <div className='chat-messages'>
        {messages.map((message) => (
          <div key={message.id} className='chat-message'>
            <span className='chat-message-user'>{message.user}:</span>
            {message.text}
            {/* Here you would display a 'read' badge if the message has been read */}
          </div>
        ))}
        {isTyping && <div className='typing-indicator'>User is typing...</div>}
      </div>
      <form onSubmit={handleSubmit} className='chat-input-form'>
        <input
          type='text'
          value={newMessage}
          onChange={handleNewMessageChange}
          className='chat-input'
          placeholder='Type your message here...'
        />
        <button type='submit' className='chat-submit-button'>
          Send
        </button>
      </form>
      </>
      ) : (
        <button onClick={toggleExpand} className='chat-toggle-button'>+</button>
      )}
    </div>
  );
};
