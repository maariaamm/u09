import Search from './pages/Search';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import { Favorites } from './pages/Favorites';
import { Link } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <Link to="/login">Logga in</Link>
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;