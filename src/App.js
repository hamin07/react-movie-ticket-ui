import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "./components/Header";

import HomePage from "./pages/HomePage";
import MovieList from "./pages/MovieList";

import BoxOffice from "./pages/Plm";

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
                        <Route path="/ticket-compose" element={<MovieList />} />
                        <Route path="/asd" element={<BoxOffice />} />
                    </Routes>        
                </main>
                <footer>

                </footer>
            </BrowserRouter>
        </div>
    );
}
