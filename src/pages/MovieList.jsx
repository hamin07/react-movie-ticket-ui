import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { MovieListService } from '../services/MovieListService';
import { useNavigate } from 'react-router-dom';

export default function MovieList() {
    const navigate = useNavigate();
    
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // 모달 상태를 객체로 통합
    const [modals, setModals] = useState({
        theater: false,
        schedule: false,
        people: false
    });
    
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [peopleCount, setPeopleCount] = useState(1);

    const [selectedDate, setSelectedDate] = useState(() => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
    });

    const movieService = useMemo(() => {
        try {
            const koficKey = process.env.REACT_APP_KOFIC_API_KEY || '';
            const tmdbKey = process.env.REACT_APP_TMDB_API_KEY || '';
            
            if (!koficKey || !tmdbKey) {
                console.warn('API 키가 설정되지 않았습니다.');
                return null;
            }
            
            return new MovieListService(koficKey, tmdbKey);
        } catch (error) {
            console.warn('MovieListService 초기화 실패:', error);
            return null;
        }
    }, []);

    const buttonClass = useMemo(() => [
        'px-4', 'py-2', 'shadow-lg', 'border', 'border-gray-300',
        'rounded-full', 'cursor-pointer', 'hover:shadow-xl',
        'transition-all', 'duration-300', 'bg-white', 'hover:bg-gray-50'
    ].join(' '), []);

    const theaters = useMemo(() => [
        { id: 1, name: 'CGV 강남', location: '서울 강남구', distance: '2.3km' },
        { id: 2, name: '롯데시네마 홍대', location: '서울 마포구', distance: '5.1km' },
        { id: 3, name: '메가박스 코엑스', location: '서울 강남구', distance: '3.7km' },
        { id: 4, name: 'CGV 용산아이파크몰', location: '서울 용산구', distance: '4.2km' },
        { id: 5, name: '롤데시네마 월드타워', location: '서울 송파구', distance: '6.8km' }
    ], []);

    // 더미 데이터를 상수로 분리
    const DUMMY_MOVIES = useMemo(() => [
        {
            movieCd: 'dummy1',
            movieNm: '아바타: 물의 길',
            rank: '1',
            audiAcc: '1000000',
            poster: null,
            time: '19:00',
            availableSeats: 50,
            totalSeats: 100
        },
        {
            movieCd: 'dummy2',
            movieNm: '탑건: 매버릭',
            rank: '2',
            audiAcc: '800000',
            poster: null,
            time: '20:30',
            availableSeats: 35,
            totalSeats: 100
        }
    ], []);

    // 모달 제어 함수들을 useCallback으로 최적화
    const toggleModal = useCallback((modalName, value) => {
        setModals(prev => ({ ...prev, [modalName]: value }));
    }, []);

    // 영화 클릭 핸들러 최적화
    const handleMovieClick = useCallback((movie) => {
        const scheduleTimes = ['09:30', '12:10', '14:50', '17:30', '20:10'];
        
        setSelectedMovie({
            ...movie,
            scheduleTimes
        });
        setPeopleCount(1);
        setSelectedTime('');
        toggleModal('people', true);
    }, [toggleModal]);

    // 박스오피스 데이터 페치 함수 최적화
    const fetchBoxOffice = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            if (movieService) {
                const moviesWithDetails = await movieService.fetchMoviesWithDetails(selectedDate);
                setMovies(moviesWithDetails);
            } else {
                console.warn('MovieService가 없습니다. 더미 데이터를 사용합니다.');
                setMovies(DUMMY_MOVIES);
            }
        } catch (err) {
            console.error('영화 데이터 로딩 실패:', err);
            setError(err.message);
            setMovies(DUMMY_MOVIES); // 오류 시 더미 데이터 사용
        } finally {
            setLoading(false);
        }
    }, [selectedDate, movieService, DUMMY_MOVIES]);

    // useEffect 최적화
    useEffect(() => {
        fetchBoxOffice();
    }, [fetchBoxOffice]);

    // 상영 시간표 데이터 생성 최적화
    const schedules = useMemo(() => {
        if (!movies?.length) return [];
        
        return movies.map((movie) => ({
            movie: movie.movieNm,
            times: ['09:30', '12:10', '14:50', '17:30', '20:10']
        }));
    }, [movies]);

    // 날짜 관련 핸들러들 최적화
    const handleDateChange = useCallback((e) => {
        setSelectedDate(e.target.value);
        toggleModal('theater', false);
    }, [toggleModal]);

    const handleQuickDateChange = useCallback((offset) => {
        const date = new Date();
        date.setDate(date.getDate() + offset - 1);
        setSelectedDate(date.toISOString().split('T')[0]);
        toggleModal('theater', false);
    }, [toggleModal]);

    // 날짜 포맷팅 함수 최적화
    const formatDate = useCallback((dateStr) => {
        const [year, month, day] = dateStr.split('-');
        return `${year}년 ${month}월 ${day}일`;
    }, []);

    // 좌석 선택 핸들러 최적화
    const handleSeatSelection = useCallback(() => {
        if (!selectedTime) {
            alert('상영 시간을 선택해주세요.');
            return;
        }

        navigate("/seat-select", {
            state: {
                movie: selectedMovie,
                time: selectedTime,
                people: peopleCount,
                date: selectedDate,
            },
        });
        toggleModal('people', false);
    }, [selectedTime, selectedMovie, peopleCount, selectedDate, navigate, toggleModal]);

    const decreasePeople = useCallback(() => {
        setPeopleCount(prev => Math.max(1, prev - 1));
    }, []);

    const increasePeople = useCallback(() => {
        setPeopleCount(prev => Math.min(10, prev + 1));
    }, []);

    if (loading) {
        return (
            <div className="px-8 py-12 text-center">
                <div className="text-xl">박스오피스 데이터를 불러오는 중...</div>
            </div>
        );
    }

    if (error && movies.length === 0) {
        return (
            <div className="px-8 py-12 text-center">
                <div className="text-red-600 text-xl">에러: {error}</div>
                <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    다시 시도
                </button>
            </div>
        );
    }

    return (
        <div className="px-8 py-4">
            <h1 className="text-4xl font-semibold text-center mb-4">티켓구매</h1>
            <p className="text-center text-gray-600 mb-8">
                {formatDate(selectedDate)} 박스오피스 기준
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
                {movies.map((movie) => (
                    <MovieCard 
                        key={movie.movieCd} 
                        movie={movie} 
                        onClick={handleMovieClick}
                    />
                ))}
            </div>

            <PeopleModal 
                isOpen={modals.people}
                movie={selectedMovie}
                selectedTime={selectedTime}
                peopleCount={peopleCount}
                onClose={() => toggleModal('people', false)}
                onTimeSelect={setSelectedTime}
                onDecreasePeople={decreasePeople}
                onIncreasePeople={increasePeople}
                onConfirm={handleSeatSelection}
            />

            <TheaterModal 
                isOpen={modals.theater}
                theaters={theaters}
                onClose={() => toggleModal('theater', false)}
                onTheaterSelect={() => {
                    toggleModal('theater', false);
                    toggleModal('schedule', true);
                }}
            />

            <ScheduleModal 
                isOpen={modals.schedule}
                selectedDate={selectedDate}
                schedules={schedules}
                buttonClass={buttonClass}
                onClose={() => toggleModal('schedule', false)}
                onDateChange={handleDateChange}
                onQuickDateChange={handleQuickDateChange}
                onMovieSelect={(schedule) => {
                    setSelectedMovie(schedule);
                    toggleModal('schedule', false);
                    toggleModal('people', true);
                }}
            />
        </div>
    );
}

// 영화 카드
const MovieCard = React.memo(({ movie, onClick }) => (
    <div onClick={() => onClick(movie)}
        className="cursor-pointer hover:bg-gray-100 duration-300 rounded-lg p-2 border-gray-200 shadow-sm hover:shadow-md"
    >
        <div className="relative">
            {movie.poster ? (
                <img 
                    src={movie.poster} 
                    alt={`${movie.movieNm} 포스터`} 
                    className="rounded-lg w-full object-cover" 
                />
            ) : (
                <div className="w-full h-80 bg-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-600">
                        <div className="text-lg font-semibold">{movie.movieNm}</div>
                        <div className="text-sm">포스터 없음</div>
                    </div>
                </div>
            )}
            <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-full text-sm font-bold">
                {movie.rank}위
            </div>
        </div>
        <div className="p-2 flex justify-between">
            <h2 className="text-3xl font-bold text-blue-600" style={{ width: '80px' }}>
                {movie.time || '19:00'}
            </h2>
            <div className="text-right flex-1 ml-4">
                <p className="font-semibold text-lg">{movie.movieNm}</p>
                <p className="text-sm text-gray-600">
                    {movie.availableSeats || 50}석/{movie.totalSeats || 100}석
                </p>
                <p className="text-xs text-gray-500">
                    누적관객: {parseInt(movie.audiAcc || 0).toLocaleString()}명
                </p>
            </div>
        </div>
    </div>
));

// 인원 선택 모달
const PeopleModal = React.memo(({ 
    isOpen, movie, selectedTime, peopleCount,
    onClose, onTimeSelect, onDecreasePeople, onIncreasePeople, onConfirm 
}) => {
    if (!isOpen || !movie) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{movie.movieNm} 예매</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-semibold mb-2">상영 시간 선택</label>
                    <div className="grid grid-cols-3 gap-2">
                        {(movie.scheduleTimes || ['09:30', '12:10', '14:50', '17:30', '20:10']).map((time, index) => (
                            <button
                                key={index}
                                onClick={() => onTimeSelect(time)}
                                className={`px-3 py-2 rounded-lg text-sm transition ${
                                    selectedTime === time
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-semibold mb-2">관람 인원 수</label>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onDecreasePeople}
                            className="px-3 py-1 bg-gray-200 rounded-full text-xl hover:bg-gray-300"
                        >
                            -
                        </button>
                        <span className="text-xl font-bold">{peopleCount}</span>
                        <button
                            onClick={onIncreasePeople}
                            className="px-3 py-1 bg-gray-200 rounded-full text-xl hover:bg-gray-300"
                        >
                            +
                        </button>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition">
                        취소
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        예매
                    </button>
                </div>
            </div>
        </div>
    );
});

// 영화관 선택 모달
const TheaterModal = React.memo(({ isOpen, theaters, onClose, onTheaterSelect }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">영화관 선택</h2>
                <div className="grid grid-cols-1 gap-4">
                    {theaters.map((theater) => (
                        <div
                            key={theater.id}
                            onClick={onTheaterSelect}
                            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100 transition"
                        >
                            <h3 className="text-xl font-semibold">{theater.name}</h3>
                            <p className="text-gray-600">{theater.location}</p>
                            <p className="text-gray-500">{theater.distance}</p>
                        </div>
                    ))}
                </div>
                <button onClick={onClose} className="mt-6 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition">
                    닫기
                </button>
            </div>
        </div>
    );
});

// 상영 시간표 모달
const ScheduleModal = React.memo(({ 
    isOpen, selectedDate, schedules, buttonClass,
    onClose, onDateChange, onQuickDateChange, onMovieSelect 
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">상영 시간표</h2>
                
                <div className="mb-4">
                    <label className="block text-lg font-semibold mb-2">날짜 선택</label>
                    <input type="date" value={selectedDate} onChange={onDateChange} 
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                </div>
                
                <div className="mb-4">
                    <label className="block text-lg font-semibold mb-2">빠른 날짜 선택</label>
                    <div className="flex space-x-4">
                        {[1, 2, 3, 4, 5].map((offset) => (
                            <button key={offset} onClick={() => onQuickDateChange(offset)} className={buttonClass}>
                                {offset}일 후
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                    {schedules.map((schedule) => (
                        <div key={schedule.movie} onClick={() => onMovieSelect(schedule)}
                            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100 transition"
                        >
                            <h3 className="text-xl font-semibold">{schedule.movie}</h3>
                            <p className="text-gray-600">상영 시간: {schedule.times.join(', ')}</p>
                        </div>
                    ))}
                </div>
                
                <button onClick={onClose} className="mt-6 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition">
                    닫기
                </button>
            </div>
        </div>
    );
});
