import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { store } from './store/store';
import CreateFormPage from './pages/CreateFormPage';
import PreviewPage from './pages/PreviewPage';
import MyFormsPage from './pages/MyFormPage';
import Layout from './components/Layout';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<CreateFormPage />} />
            <Route path="/create" element={<CreateFormPage />} />
            <Route path="/preview" element={<PreviewPage />} />
            <Route path="/myforms" element={<MyFormsPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </Provider>
  );
}

export default App;