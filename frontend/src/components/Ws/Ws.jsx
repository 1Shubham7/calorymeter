import React, { useState, useEffect, Component } from 'react';
import Header from '../Header/Header';
import ChatHistory from '../ChatHistory/ChatHistory';
import ChatInput from '../ChatInput/ChatInput';
import { connect, sendMsg } from '../../api';

class Ws extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatHistory: [],
    };
  }

  componentDidMount() {
    connect((msg) => {
      this.setState((prevState) => ({
        chatHistory: [...prevState.chatHistory, msg],
      }));
    });
  }

  send = (event) => {
    if (event.keyCode === 13) {
      sendMsg(event.target.value);
      event.target.value = '';
    }
  };

  render() {
    return (
      <div className="App">
        <ChatHistory chatHistory={this.state.chatHistory} />
        <ChatInput send={this.send} />
      </div>
    );
  }
}

export default Ws;
