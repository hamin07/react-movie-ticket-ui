import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_SERVER;

export default function MovieList() {
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [peopleCount, setPeopleCount] = useState(1);
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchMovies() {
            try {
                const res = await fetch(`${API_BASE_URL}/movies`);
                if (res.ok) {
                    const data = await res.json();
                    setMovies(data);
                }
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        }

        fetchMovies();
    }, []);

    // 영화 클릭 시 모달 오픈
    const handleMovieClick = (movie) => {
        setSelectedMovie(movie);
        setPeopleCount(1);
        setShowModal(true);
    };

    // 인원 선택 후 좌석 선택 페이지로 이동
    const handlePeopleSelect = () => {
        setShowModal(false);
        navigate('/seat-select', {
            state: {
                movie: selectedMovie,
                people: peopleCount,
            },
        });
    };

    return (
        <div className="px-8 py-4">
            <h1 className="text-4xl font-semibold text-center mb-4">티켓구매</h1>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {movies.map((movie) => (
                    <div
                        key={movie.id}
                        className="rounded-lg overflow-hidden hover:shadow-xl duration-300 cursor-pointer"
                        onClick={() => handleMovieClick(movie)}
                    >
                        <img src={movie.posterImageUrl} alt={movie.title} className="w-full object-cover" />
                        <div className="p-2">
                            <h2 className="text-lg font-bold">{movie.title}</h2>
                        </div>
                    </div>
                ))}
            </div>

            {/* 관람 인원 선택 모달 */}
            {showModal && selectedMovie && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-80 shadow-lg relative">
                        {/* 닫기 버튼 */}
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
                            onClick={() => setShowModal(false)}
                        >
                            &times;
                        </button>
                        {/* 영화 정보 */}
                        <div className="flex flex-col items-center mb-4">
                            <img
                                src={selectedMovie.posterImageUrl}
                                alt={selectedMovie.title}
                                className="w-32 h-44 object-cover rounded mb-2"
                            />
                            <h2 className="text-xl font-bold mb-1 text-gray-900">{selectedMovie.title}</h2>
                            {selectedMovie.genre && (
                                <p className="text-gray-500 text-sm mb-1">{selectedMovie.genre}</p>
                            )}
                            {selectedMovie.releaseDate && (
                                <p className="text-gray-400 text-xs mb-2">개봉일: {selectedMovie.releaseDate}</p>
                            )}
                        </div>
                        {/* 인원 선택 */}
                        <div className="flex items-center justify-center mb-6">
                            <button
                                className="px-3 py-1 bg-gray-200 rounded-l text-xl font-bold"
                                onClick={() => setPeopleCount((prev) => Math.max(1, prev - 1))}
                            >
                                -
                            </button>
                            <span className="px-6 py-1 bg-gray-100 text-lg font-semibold">{peopleCount}</span>
                            <button
                                className="px-3 py-1 bg-gray-200 rounded-r text-xl font-bold"
                                onClick={() => setPeopleCount((prev) => Math.min(8, prev + 1))}
                            >
                                +
                            </button>
                        </div>
                        <button
                            className="w-full py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition"
                            onClick={handlePeopleSelect}
                        >
                            좌석 선택하기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}