import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppRoutes from './router/appRouter';

const App: React.FC = () => {
    const [darkTheme, setDarkTheme] = useState(true);
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Router>
            <AppRoutes
                darkTheme={darkTheme}
                setDarkTheme={setDarkTheme}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />
        </Router>
    );
};

export default App;
