import React from 'react';
import Chat from './Chat'
import Map from './Map';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import MainPage from './MainPage';
import DestinationDetail from "./DestinationDetail";
import LoginForm from './Forms/LoginForm';
import RegisterForm from './Forms/RegisterForm';

const App: React.FC = () => {
    const handleLoginSuccess = (userId: number) => {
        console.log(`Login successful. User ID: ${userId}`);
    };


    return (
        <Router>
            <Routes>

                <Route path="/" element={<Layout><LoginForm onLoginSuccess={handleLoginSuccess} /></Layout>} />
                <Route
                    path="/main/:userId"
                    element={<Layout><MainPage /></Layout>}
                />

                <Route path="/chat" element={<Layout><Chat /></Layout>} />
                <Route path="/register" element={<Layout><RegisterForm /></Layout>} />
                <Route path="/detail/:destinationId" element={<DestinationDetail />} />
                <Route path="/map" element={<Layout><Map/></Layout>} />
            </Routes>
        </Router>
    );
};

export default App;
