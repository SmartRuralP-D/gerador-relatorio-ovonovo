import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from "./pages/LoginPage.jsx";
import MainPage from './pages/MainPage.jsx';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './firebase/fAuth.js';
import loadingGif from './assets/imagens/loading.gif';
import { useState, useEffect } from 'react';


function App() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: "center", alignItems: 'center' }}>
        <img src={loadingGif} alt='Loading...' className='gif-image' />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path='/' element={!user ? <LoginPage /> : <Navigate to='/main' />} />
        <Route path='/main' element={user ? <MainPage /> : <Navigate to='/' />} />
        <Route path='*' element={user ? <MainPage/> : <Navigate to='/'/>}/>
      </Routes>
    </Router>
  );
}

export default App;
