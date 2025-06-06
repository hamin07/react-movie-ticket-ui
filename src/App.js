import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "./components/Header";

import HomePage from "./pages/HomePage";
import MovieList from "./pages/MovieList";

import BoxOffice from "./pages/Plm";
import Reservation from "./pages/Reservation";
import Refund from "./pages/Refund";
import SeatSelect from "./pages/SeatSelect";

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
                        <Route path="/movie-list" element={<MovieList />} />
                        <Route path="/reservation" element={<Reservation />} />
                        <Route path="/refund" element={<Refund />} />
                        <Route path="/asd" element={<BoxOffice />} />
                        <Route path="/seat-select" element={<SeatSelect />} />
                    </Routes>
                </main>
            </BrowserRouter>
        </div>
    );
}
