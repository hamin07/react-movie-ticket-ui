import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "./components/Header";

import HomePage from "./pages/HomePage";
import TicketCompose from "./pages/TicketCompose";

export default function App() {
    return (
        <div>
            <BrowserRouter basename={process.env.PUBLIC_URL}>
                <header>
                    <Header />      
                </header>
                <main className="max-w-5xl mx-auto">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/ticket-compose" element={<TicketCompose />} />
                    </Routes>        
                </main>
                <footer>

                </footer>
            </BrowserRouter>
        </div>
    );
}
