// import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import CorePage from "./react-core";
import MUIPage from "./MaterialUI";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CorePage />}></Route>
        <Route path="/custom" element={<CorePage />}></Route>
        <Route path="/material" element={<MUIPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
