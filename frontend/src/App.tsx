import React from 'react';
import Chat from './Chat'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import MainPage from './MainPage';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/chat" element ={<Chat/>}/>
          <Route path="/" element ={<MainPage/>}/>
        </Routes>
        </Layout>
    </Router>
  );
};
export default App;

