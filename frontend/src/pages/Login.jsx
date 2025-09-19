import { useAuth } from '../contexts/AuthContext';
import '../index.css';

function Login() {
  const { user, login, logout } = useAuth();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Logga in</h1>
      {user ? (
        <div>
          <p>Hej, {user.name || user.email}!</p>
          <button onClick={logout}>
            Logga ut
          </button>
        </div>
      ) : (
        <div>
          <p>Du är inte inloggad.</p>
          <button onClick={login}>
            Logga in med Google
          </button>
        </div>
      )}
    </div>
  );
}

export default Login;