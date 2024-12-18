import React, { Component } from 'react';
import './ChatHistory.scss';
import Message from '../Message/Message';

class ChatHistory extends Component {
  render() {
    console.log(this.props.chatHistory);
    const messages = this.props.chatHistory.map(msg => <Message key={msg.timeStamp} message={msg.data} />);

    return (
      <div className='ChatHistory'>
        <h2>Calorymeter Chat</h2>
        <p align="center"> Please be respectful to others in the chat. or else I fuck you up you son of a monkey!</p>
        {messages}
      </div>
    );
  };

}

export default ChatHistory;