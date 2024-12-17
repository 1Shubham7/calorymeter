import React, { Component } from 'react';
import './ChatInput.scss';

class ChatInput extends Component {
  
  render() {
    return (
      <div className='ChatInput'>
        <input onKeyDown={this.props.send} placeholder="I only believe in Jassi bhai..."/>
      </div>
    );
  };

}

export default ChatInput;