import './App.css';
import { Routes, Route} from 'react-router-dom'
import FireStoreTest from './page/FireStoreTest';
import Login from './page/Login';

function App() {
  return (
    <div>
      <Routes>
      <Route path='/login' element={<Login />} />
        <Route path='/' element={<FireStoreTest/>} />
      </Routes>
    </div>
  );
}

export default App;