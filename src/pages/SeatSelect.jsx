import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function SeatSelection(props) {
    // 라우터로부터 전달받은 state 사용
    const location = useLocation();
    const navigate = useNavigate();

    // location.state에서 데이터 추출, props가 있으면 props 우선
    const {
        movie = { movieNm: '아바타: 물의 길' },
        date = '2024-12-25',
        time = '19:00',
        people = 2,
    } = location.state || {};

    const movieData = props.movieData || movie;
    const selectedDate = props.date || date;
    const selectedTime = props.time || time;
    const peopleCount = props.people || people;

    const onBack = props.onBack || (() => navigate(-1));
    const onPayment = props.onPayment || ((data) => console.log('결제 데이터:', data));

    const [selectedSeats, setSelectedSeats] = useState([]);

    // 좌석 데이터 생성 (실제 영화관 스타일)
    const generateSeats = () => {
        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        const seatsPerRow = 14;
        const occupiedSeats = ['A5', 'A6', 'C8', 'D12', 'F3', 'G7', 'H10', 'I2']; // 이미 예약된 좌석
        
        return rows.map(row => ({
            row,
            seats: Array.from({ length: seatsPerRow }, (_, index) => {
                const seatNumber = index + 1;
                const seatId = `${row}${seatNumber}`;
                return {
                    id: seatId,
                    number: seatNumber,
                    isOccupied: occupiedSeats.includes(seatId),
                    isSelected: selectedSeats.includes(seatId)
                };
            })
        }));
    };

    const seatData = generateSeats();

    const toggleSeat = (seatId, isOccupied) => {
        if (isOccupied) return; // 이미 예약된 좌석은 선택 불가
        
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

    const handlePayment = () => {
        if (selectedSeats.length === 0) {
            alert('좌석을 선택해주세요.');
            return;
        }
        
        if (selectedSeats.length !== peopleCount) {
            alert(`${peopleCount}개의 좌석을 선택해주세요.`);
            return;
        }

        const reservationData = {
            movie: movieData.movieNm,
            date: selectedDate,
            time: selectedTime,
            people: peopleCount,
            seats: selectedSeats,
            theater: 'CGV 강남',
            totalAmount: selectedSeats.length * 12000 // 티켓 가격 12,000원
        };

        onPayment(reservationData);
    };

    const getSeatClass = (seat) => {
        if (seat.isOccupied) {
            return 'bg-gray-400 cursor-not-allowed';
        }
        if (seat.isSelected) {
            return 'bg-red-500 text-white';
        }
        return 'bg-green-400 hover:bg-green-500 cursor-pointer';
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-2">좌석 선택</h1>
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                        <p className="text-lg"><span className="text-blue-400">영화:</span> {movieData.movieNm}</p>
                        <p><span className="text-blue-400">일시:</span> {selectedDate} {selectedTime}</p>
                        <p><span className="text-blue-400">인원:</span> {peopleCount}명</p>
                        <p><span className="text-blue-400">극장:</span> CGV 강남 1관</p>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <div className="bg-gradient-to-r from-gray-600 to-gray-400 rounded-t-full h-3 w-80 mx-auto mb-2"></div>
                    <p className="text-gray-400 text-sm">SCREEN</p>
                </div>

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

                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <div className="space-y-3">
                        {seatData.map((rowData) => (
                            <div key={rowData.row} className="flex items-center justify-center space-x-2">
                                <div className="w-8 text-center font-bold text-gray-400">
                                    {rowData.row}
                                </div>
                                
                                <div className="flex space-x-1">
                                    {rowData.seats.slice(0, 6).map((seat) => (
                                        <button
                                            key={seat.id}
                                            onClick={() => toggleSeat(seat.id, seat.isOccupied)}
                                            className={`w-8 h-8 rounded text-xs font-bold transition-all duration-200 ${getSeatClass(seat)}`}
                                            disabled={seat.isOccupied}
                                        >
                                            {seat.number}
                                        </button>
                                    ))}
                                </div>
                                
                                <div className="w-8"></div>
                                
                                <div className="flex space-x-1">
                                    {rowData.seats.slice(6).map((seat) => (
                                        <button
                                            key={seat.id}
                                            onClick={() => toggleSeat(seat.id, seat.isOccupied)}
                                            className={`w-8 h-8 rounded text-xs font-bold transition-all duration-200 ${getSeatClass(seat)}`}
                                            disabled={seat.isOccupied}
                                        >
                                            {seat.number}
                                        </button>
                                    ))}
                                </div>
                                
                                <div className="w-8 text-center font-bold text-gray-400">
                                    {rowData.row}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-bold mb-2">선택된 좌석</h3>
                    <div className="flex items-center justify-between">
                        <div>
                            {selectedSeats.length > 0 ? (
                                <div className="flex space-x-2">
                                    {selectedSeats.map(seat => (
                                        <span key={seat} className="bg-red-500 px-2 py-1 rounded text-sm">
                                            {seat}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-gray-400">선택된 좌석이 없습니다</span>
                            )}
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-400">총 금액</p>
                            <p className="text-xl font-bold text-blue-400">
                                {(selectedSeats.length * 12000).toLocaleString()}원
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <button
                        onClick={onBack}
                        className="flex-1 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-bold"
                    >
                        이전 단계
                    </button>
                    <button
                        onClick={handlePayment}
                        disabled={selectedSeats.length === 0}
                        className={`flex-1 py-3 rounded-lg font-bold transition ${
                            selectedSeats.length === 0
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                    >
                        결제하기 ({selectedSeats.length}/{peopleCount})
                    </button>
                </div>
            </div>
        </div>
    );
}