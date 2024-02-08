import './App.css';
import Home from './Components/Home';
import Query from './Components/Query';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/query" element={<Query/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
