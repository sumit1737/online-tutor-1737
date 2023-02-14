import axios from 'axios';
import './App.css';
import { AuthContextProvider } from './context/AuthContext';

axios.defaults.withCredentials = true;

function App() {

  return (
    <div>
      <AuthContextProvider>
      </AuthContextProvider>
    </div>
  );
}

export default App;
