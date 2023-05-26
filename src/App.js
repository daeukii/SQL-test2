import './App.css';
import { Routes, Route} from 'react-router-dom'
import FireStoreTest from './page/FireStoreTest';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<FireStoreTest/>} />
      </Routes>
    </div>
  );
}

export default App;