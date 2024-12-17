import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

import Entries from './components/entries.components';
import TipDisplay from './components/AI/tip';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Hero from './components/Hero/Hero';
import Me from './components/Me/Me';
import QuoteOne from './components/QuoteOne/QuoteOne';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatHistory: []
    }
  }

  componentDidMount() {
    connect((msg) => {
      console.log("New Message")
      this.setState(prevState => ({
        chatHistory: [...prevState.chatHistory, msg]
      }))
      console.log(this.state);
    });
  }

  send(event) {
    if (event.keyCode === 13) {
      sendMsg(event.target.value);
      event.target.value = "";
    }
  }

  render () {
  return (
    <div>
      <Navbar />
      <Hero />
      <Entries />
      <TipDisplay />
      <QuoteOne />
      <Me />
      <Footer />

      <Header />
        <ChatHistory chatHistory={this.state.chatHistory} />
        <ChatInput send={this.send} />
      
    </div>
  );
}
}

export default App;
