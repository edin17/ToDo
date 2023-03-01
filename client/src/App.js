import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./components/Index/Home"
import Login from "./components/Login/Login"
import Register from "./components/Register/Register"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' exact element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
