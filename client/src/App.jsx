import react, { useState, useEffect } from 'react';
import UserForm from './components/UserForm';
import Login from './components/Login';
import Register from './components/Register';
import DashBoard from './pages/DashBoard';
import PostsPage from './pages/PostsPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PostDetailPage from './pages/PostDetailPage';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import ProfilePage from "./pages/ProfilePage";
import "./App.css";

export default function App() {
  /*
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if(!user) {
    return (
      <>
        <Login setUser={setUser} />
        <Register/>
      </>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PostsPage user={user} logout={logout} />} />
        <Route path="/post/:id" element={<PostDetailPage />} />
      </Routes>
    </Router>
  );
  */

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path = "/login" element = {<LoginPage />} />
          <Route path = "/register" element = {<Register />} />
          <Route path = "/" element = {
            <PrivateRoute>
              <PostsPage/>
            </PrivateRoute>
          }
          />
          <Route path = "/post/:id" element = {
            <PrivateRoute>
              <PostDetailPage/>
            </PrivateRoute>
          }
          />
          <Route path = "/profile" element = {<ProfilePage/>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

  function LoginPage(){
    return (
      <div style={{ maxWidth: 500, margin: "2rem auto" }}>
        <h2>Login or Register</h2>
        <Login />
        <hr />
        <Register /> 
      </div>
    );
  }