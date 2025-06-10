import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_SERVER || 'http://localhost:8080/api';

export default function SeatSelection(props) {
    const location = useLocation();
    const navigate = useNavigate();

    // MovieList에서 넘어온 state
    const {
        movie,
        people = 1,
    } = location.state || {};

    const movieData = props.movieData || movie;
    const peopleCount = props.people || people;

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [occupiedSeats, setOccupiedSeats] = useState([]);
    const [seatLayout, setSeatLayout] = useState([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const paymentMethods = [
        { id: '신용카드', name: '신용카드', icon: '💳' },
        { id: '체크카드', name: '체크카드', icon: '💳' },
        { id: '카카오페이', name: '카카오페이', icon: '💛' },
        { id: '네이버페이', name: '네이버페이', icon: '💚' },
        { id: '토스페이', name: '토스페이', icon: '💙' }
    ];

    // 좌석 레이아웃 더미 생성
    const generateDefaultLayout = () => {
        const rows = 'ABCDEFGHIJ'.split('');
        const seatsPerRow = 14;
        return rows.map(row => ({
            row,
            seats: Array.from({ length: seatsPerRow }, (_, index) => ({
                id: `${row}${index + 1}`,
                number: index + 1,
                row: row,
                isAvailable: true
            }))
        }));
    };

    // occupiedSeats 더미 (이미 예약된 좌석)
    useEffect(() => {
        setLoading(true);
        // 실제 API 연동 시 fetch로 대체
        setTimeout(() => {
            setSeatLayout(generateDefaultLayout());
            setOccupiedSeats(['A1', 'A2', 'B5', 'C10', 'D7', 'E3', 'F12']);
            setLoading(false);
        }, 500);
    }, []);

    const toggleSeat = (seatId) => {
        if (occupiedSeats.includes(seatId)) return;
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(prev => prev.filter(s => s !== seatId));
        } else {
            if (selectedSeats.length >= peopleCount) {
                alert(`최대 ${peopleCount}명까지 선택할 수 있습니다.`);
                return;
            }
            setSelectedSeats(prev => [...prev, seatId]);
        }
    };

    const handlePaymentButtonClick = () => {
        if (selectedSeats.length !== peopleCount) {
            alert(`${peopleCount}개의 좌석을 선택해주세요.`);
            return;
        }
        setShowPaymentModal(true);
    };

    const handlePayment = () => {
        if (!selectedPaymentMethod) {
            alert('결제 방법을 선택해주세요.');
            return;
        }
        alert('결제가 완료되었습니다!');
        setShowPaymentModal(false);
        navigate('/');
    };

    const getSeatClass = (seat) => {
        const seatId = seat.id;
        if (occupiedSeats.includes(seatId)) return 'bg-gray-400 cursor-not-allowed';
        if (selectedSeats.includes(seatId)) return 'bg-red-500 text-white';
        return 'bg-green-400 hover:bg-green-500 cursor-pointer';
    };

    if (loading) {
        return (
            <div className="bg-gray-100 p-4">
                <div className="max-w-4xl mx-auto text-center py-12">
                    <div className="text-xl">좌석 정보를 불러오는 중...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="px-8 py-4 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* 영화 정보 UI */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-4">좌석 선택</h1>
                    <div className="flex flex-col items-center mb-4">
                        <img
                            src={movieData?.posterImageUrl}
                            alt={movieData?.title}
                            className="w-32 h-44 object-cover rounded mb-2"
                        />
                        <h2 className="text-xl font-bold mb-1 text-gray-900">{movieData?.title}</h2>
                        {movieData?.genre && (
                            <p className="text-gray-500 text-sm mb-1">{movieData.genre}</p>
                        )}
                        {movieData?.releaseDate && (
                            <p className="text-gray-400 text-xs mb-2">개봉일: {movieData.releaseDate}</p>
                        )}
                    </div>
                    <div className="text-center mb-2">
                        <span className="text-blue-600 font-semibold">관람 인원: {peopleCount}명</span>
                    </div>
                </div>

                {/* 스크린 */}
                <div className="text-center mb-8">
                    <div className="bg-gradient-to-r from-gray-600 to-gray-400 rounded-t-full h-3 w-80 mx-auto mb-2"></div>
                    <p className="text-gray-400 text-sm">SCREEN</p>
                </div>

                {/* 좌석 범례 */}
                <div className="flex justify-center mb-6 space-x-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-green-400 rounded"></div>
                        <span className="text-sm">선택가능</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-red-500 rounded"></div>
                        <span className="text-sm">선택됨</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-400 rounded"></div>
                        <span className="text-sm">예약불가</span>
                    </div>
                </div>

                {/* 좌석 배치 */}
                <div className="bg-white rounded-lg p-6 mb-6">
                    <div className="space-y-3">
                        {seatLayout.map(({ row, seats }) => (
                            <div key={row} className="flex items-center justify-center space-x-2">
                                <div className="w-8 text-center font-bold text-gray-400">{row}</div>
                                <div className="flex space-x-1">
                                    {seats.slice(0, 7).map(seat => (
                                        <button
                                            key={seat.id}
                                            onClick={() => toggleSeat(seat.id)}
                                            disabled={occupiedSeats.includes(seat.id)}
                                            className={`w-8 h-8 rounded text-xs font-bold ${getSeatClass(seat)}`}
                                        >
                                            {seat.number}
                                        </button>
                                    ))}
                                </div>
                                <div className="w-8"></div>
                                <div className="flex space-x-1">
                                    {seats.slice(7).map(seat => (
                                        <button
                                            key={seat.id}
                                            onClick={() => toggleSeat(seat.id)}
                                            disabled={occupiedSeats.includes(seat.id)}
                                            className={`w-8 h-8 rounded text-xs font-bold ${getSeatClass(seat)}`}
                                        >
                                            {seat.number}
                                        </button>
                                    ))}
                                </div>
                                <div className="w-8 text-center font-bold text-gray-400">{row}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 선택된 좌석 정보 */}
                <div className="bg-white rounded-lg p-4 mb-6 shadow">
                    <h2 className="text-xl font-bold mb-4">선택된 좌석</h2>
                    <div className="flex flex-wrap gap-2">
                        {selectedSeats.length > 0 ? (
                            selectedSeats.map(seatId => (
                                <span key={seatId} className="bg-red-500 text-white px-3 py-1 rounded">
                                    {seatId}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-500">선택된 좌석이 없습니다.</span>
                        )}
                    </div>
                </div>

                {/* 결제 버튼 */}
                <div className="text-center">
                    <button
                        onClick={handlePaymentButtonClick}
                        className="w-full py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition"
                    >
                        결제하기
                    </button>
                </div>

                {/* 결제 방법 선택 모달 */}
                {showPaymentModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-96">
                            <h2 className="text-xl font-bold mb-4">결제 방법 선택</h2>
                            <div className="space-y-4 mb-4">
                                {paymentMethods.map(method => (
                                    <button
                                        key={method.id}
                                        onClick={() => setSelectedPaymentMethod(method.id)}
                                        className={`flex items-center space-x-2 w-full p-3 rounded-lg ${selectedPaymentMethod === method.id ? 'bg-blue-100' : 'bg-gray-100 hover:bg-gray-200'}`}
                                    >
                                        <span className="text-lg">{method.icon}</span>
                                        <span>{method.name}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors text-gray-800"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handlePayment}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    결제하기
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 뒤로가기 버튼 */}
                <div className="text-center mt-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                        뒤로가기
                    </button>
                </div>
            </div>
        </div>
    );
}