// import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import CorePage from "./react-core";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CorePage />}></Route>
        <Route path="/custom" element={<CorePage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
