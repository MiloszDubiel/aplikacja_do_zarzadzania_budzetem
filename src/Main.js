import React, {useEffect} from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Components/login/Login";
import Register from "./Components/register/Register";
import Navbar from "./Components/navbar/Navbar"; 
import Dashboard from "./Components/dashboard/Dashboard";
import Transaction from "./Components/transaction/Transaction";
import Profile from "./Components/profile/Profile";
import './main-style.css'


const Main = () => {
    

    return(
        <BrowserRouter>
            <div className="show-settings">
                <Profile/>
            </div>
            <Routes>
                <Route path="/" element={<Login />} />       
            </Routes>
            <Routes>
                <Route path="/register" element={<Register />} />       
            </Routes>
            <Routes>
                <Route path="/dashboard" element={<div style={{display: "flex", width: 100+"%", height: 100+"%" }}> <Navbar />  <Dashboard/> </div>} />
            </Routes>
            <Routes>
                <Route path="/transaction" element={<div style={{display: "flex", width: 100+"%", height: 100+"%" }}> <Navbar /> <Transaction />  </div>} />
            </Routes>
            <Routes>
                <Route path="/profile" element={<div style={{display: "flex", width: 100+"%", height: 100+"%" }}> <Navbar /> <Profile />  </div>} />
            </Routes>

        </BrowserRouter>
    )
}

export default Main