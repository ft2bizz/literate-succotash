
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import NewProject from './pages/NewProject';
import Resources from './pages/Resources';
import MyProjects from './pages/MyProjects';
import DeliveryManagement from './pages/DeliveryManagement';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-project" element={<NewProject />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/projects" element={<MyProjects />} />
          <Route path="/delivery/:projectId" element={<DeliveryManagement />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
