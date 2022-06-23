import React, { useState } from 'react';
import io from "socket.io-client";
import Header from './components/Header';
import Container from './components/Container';
import Footer from './components/Footer.jsx';
import './style.css';

const socket = io.connect("");

function App() {


  return (
    <div className='App'>
      <Header />
      <Container socket = {socket} />
      <Footer />
    </div>
  );
}

export default App;
