import React, { useEffect, useState } from 'react';

export default function MovieBookingApp() {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showTheaterModal, setShowTheaterModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        today.setDate(today.getDate() - 1); // 박스오피스는 전날 기준
        return today.toISOString().split('T')[0];
    });

    const KOFIC_API_KEY = process.env.REACT_APP_KOFIC_API_KEY;
    const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

    const buttonClass = [
        'px-4',
        'py-2',
        'shadow-lg',
        'border',
        'border-gray-300',
        'rounded-full',
        'cursor-pointer',
        'hover:shadow-xl',
        'transition-all',
        'duration-300',
        'bg-white',
        'hover:bg-gray-50',
    ].join(' ');

    // 영화관 목록 데이터
    const [theaters] = useState([
        { id: 1, name: 'CGV 강남', location: '서울 강남구', distance: '2.3km' },
        { id: 2, name: '롯데시네마 홍대', location: '서울 마포구', distance: '5.1km' },
        { id: 3, name: '메가박스 코엑스', location: '서울 강남구', distance: '3.7km' },
        { id: 4, name: 'CGV 용산아이파크몰', location: '서울 용산구', distance: '4.2km' },
        { id: 5, name: '롯데시네마 월드타워', location: '서울 송파구', distance: '6.8km' },
    ]);

    // TMDb에서 영화 제목으로 포스터 URL 받아오기
    const fetchPosterFromTMDb = async (title) => {
        const query = encodeURIComponent(title);
        try {
            const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}&language=ko-KR`);
            
            if (!response.ok) {
                throw new Error("에러남!!!");
            }

            const data = await response.json();
            console.log(data);

            if (data.results && data.results.length > 0 && data.results[0].poster_path) {
                return `https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`;
            }
        } catch (error) {
            console.log('TMDb API 에러:', error);
        }
        return null;
    };

    // 랜덤 상영시간과 좌석 정보 생성
    const generateScheduleInfo = () => {
        const times = ['09:30', '12:10', '14:50', '17:30', '20:10', '22:40'];
        const randomTime = times[Math.floor(Math.random() * times.length)];
        const totalSeats = 270;
        const availableSeats = Math.floor(Math.random() * 100) + 150; // 150-250 사이
        return { time: randomTime, availableSeats, totalSeats };
    };

    useEffect(() => {
        const fetchBoxOffice = async () => {
        try {
            setLoading(true);
            setError(null);
            const targetDate = selectedDate.replace(/-/g, '');
            const response = await fetch(
                `https://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=${KOFIC_API_KEY}&targetDt=${targetDate}`
            );

            if (!response.ok) {
                throw new Error('KOFIC API 데이터 불러오기 실패');
            }

            const data = await response.json();
            console.log(data);
            
            if (!data.boxOfficeResult || !data.boxOfficeResult.dailyBoxOfficeList) {
                throw new Error('박스오피스 데이터가 없습니다');
            }

            const moviesData = data.boxOfficeResult.dailyBoxOfficeList;

            // TMDb에서 포스터 추가 및 상영 정보 생성
            const moviesWithDetails = await Promise.all(
                moviesData.map(async (movie) => {
                    const poster = await fetchPosterFromTMDb(movie.movieNm);
                    const scheduleInfo = generateScheduleInfo();

                    return {
                        ...movie,
                        poster,
                        ...scheduleInfo,
                    };
                })
            );

            setMovies(moviesWithDetails);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };

        fetchBoxOffice();
    }, [selectedDate, KOFIC_API_KEY, TMDB_API_KEY]);

    // 상영 시간표 데이터 (실제 영화 제목 기반)
    const getSchedules = () => {
        return movies.slice(0, 4).map((movie) => ({
            movie: movie.movieNm,
            times: ['09:30', '12:10', '14:50', '17:30', '20:10'],
        }));
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        setShowTheaterModal(false);
    };

    const handleQuickDateChange = (offset) => {
        const date = new Date();
        date.setDate(date.getDate() + offset - 1); // 박스오피스 기준에 맞춰 조정
        setSelectedDate(date.toISOString().split('T')[0]);
        setShowTheaterModal(false);
    };

    const formatDate = (dateStr) => {
        const [year, month, day] = dateStr.split('-');
        return `${year}년 ${month}월 ${day}일`;
    };

    if (loading) {
        return (
            <div className="px-8 py-12 text-center">
                <div className="text-xl">박스오피스 데이터를 불러오는 중...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-8 py-12 text-center">
                <div className="text-red-600 text-xl">에러: {error}</div>
                <button onClick={() => window.location.reload()} 
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

            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <button className={buttonClass} onClick={() => setShowTheaterModal(true)}>
                    영화관 및 예매일 변경
                </button>
                <button className={buttonClass} onClick={() => setShowScheduleModal(true)}>
                    영화관별 상영 시간표 보기
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
                {movies.map((movie) => (
                <div key={movie.movieCd}
                    className="cursor-pointer hover:bg-gray-100 duration-300 rounded-lg p-2 border-gray-200 shadow-sm hover:shadow-md"
                >
                    <div className="relative">
                        {movie.poster ? (
                            <img src={movie.poster} alt={`${movie.movieNm} 포스터`} className="rounded-lg w-full h-80 object-cover" />
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
                    <div className="p-2 flex justify-between items-center">
                        <h2 className="text-3xl font-bold text-blue-600" style={{ width: '80px' }}>
                            {movie.time}
                        </h2>
                        <div className="text-right flex-1 ml-4">
                            <p className="font-semibold text-lg">{movie.movieNm}</p>
                            <p className="text-sm text-gray-600">
                                {movie.availableSeats}석/{movie.totalSeats}석
                            </p>
                            <p className="text-xs text-gray-500">
                                누적관객: {parseInt(movie.audiAcc).toLocaleString()}명
                            </p>
                        </div>
                    </div>
                </div>
                ))}
            </div>

            {/* 영화관 변경 모달 */}
            {showTheaterModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">영화관 및 예매일 변경</h2>
                            <button onClick={() => setShowTheaterModal(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                            >
                                X
                            </button>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">예매일 선택</h3>
                            <div className="flex gap-2 mb-4 flex-wrap">
                                {['오늘', '내일', '모레'].map((label, index) => (
                                <button key={index} onClick={() => handleQuickDateChange(index)}
                                    className="px-4 py-2 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                                >
                                    {label}
                                </button>
                                ))}
                            </div>
                            <input type="date" className="border rounded-lg px-3 py-2 w-full"
                                value={selectedDate} onChange={handleDateChange}
                            />
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold mb-3">영화관 선택</h3>
                            <ul className="space-y-2">
                                {theaters.map((theater) => (
                                <li key={theater.id} className="p-4 border rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                                    <div className="font-semibold">{theater.name}</div>
                                    <div className="text-sm text-gray-600">{theater.location}</div>
                                    <div className="text-xs text-gray-500">{theater.distance}</div>
                                </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="mt-6 flex justify-end">
                            <button onClick={() => setShowTheaterModal(false)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 상영 시간표 모달 */}
            {showScheduleModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">영화관별 상영 시간표</h2>
                            <button
                                onClick={() => setShowScheduleModal(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                            >
                                X
                            </button>
                        </div>
                        <div className="space-y-4">
                            {getSchedules().map((schedule, index) => (
                                <div key={index} className="p-4 border rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="font-semibold mb-2">{schedule.movie}</div>
                                    <div className="flex flex-wrap gap-2">
                                        {schedule.times.map((time, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                                {time}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}