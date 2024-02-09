import './App.css';
import Home from './Components/Home';
import Query from './Components/Query';
import Cron from './Components/Cron';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/query" element={<Query/>} />
          <Route path='/cron' element={<Cron/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
