import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function SeatSelection(props) {
    const location = useLocation();
    const navigate = useNavigate();

    // MovieList에서 넘어온 state
    const {
        movie,
        people = 1,
        price
    } = location.state || {};

    const movieData = props.movieData || movie;
    const peopleCount = props.people || people;
    const seatPrice = props.price || price;

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [occupiedSeats, setOccupiedSeats] = useState([]);
    const [seatLayout, setSeatLayout] = useState([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [loading, setLoading] = useState(true);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [reqReservedCode, setReqReservedCode] = useState(null);

    const paymentMethods = [
        { id: '신용카드', name: '신용카드', icon: '💳' },
        { id: '체크카드', name: '체크카드', icon: '💳' },
        { id: '카카오페이', name: '카카오페이', icon: '💛' },
        { id: '네이버페이', name: '네이버페이', icon: '💚' },
        { id: '토스페이', name: '토스페이', icon: '💙' }
    ];

    // 총 가격 계산
    const totalPrice = selectedSeats.length * seatPrice;

    // 기본 좌석 레이아웃 생성
    function generateDefaultLayout() {
        const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
        const seatsPerRow = 16;
        
        return rows.map(row => {
            const seats = [];
            for (let i = 1; i <= seatsPerRow; i++) {
                seats.push({
                    id: `${row}${i}`,
                    number: i,
                    row: row,
                    isAvailable: true
                });
            }
            return { row, seats };
        });
    }

    // seatLayout 문자열을 파싱해서 행/좌석 배열로 변환
    function parseSeatLayout(layoutStr) {
        if (!layoutStr) {
            return generateDefaultLayout();
        }
        
        try {
            // 예: "A1-A15,B1-B15,..." 형태 처리
            return layoutStr.split(',').map(rowStr => {
                const trimmed = rowStr.trim();
                // 행 문자와 숫자 범위 분리 (예: "A1-15" 또는 "A1-A15")
                const match = trimmed.match(/^([A-Z])(\d+)-(?:[A-Z])?(\d+)$/);
                if (!match) {
                    console.warn(`Invalid seat layout format: ${trimmed}`);
                    return null;
                }
                
                const [, row, startStr, endStr] = match;
                const start = parseInt(startStr);
                const end = parseInt(endStr);
                
                const seats = [];
                for (let i = start; i <= end; i++) {
                    seats.push({
                        id: `${row}${i}`,
                        number: i,
                        row: row,
                        isAvailable: true
                    });
                }
                return { row, seats };
            }).filter(Boolean);
        } catch (error) {
            console.error('Error parsing seat layout:', error);
            return generateDefaultLayout();
        }
    }

    // 예약된 좌석 정보 가져오기
    useEffect(() => {
        async function fetchOccupiedSeats() {
            const showtimeId = movieData?.showtimeId;
            if (!showtimeId) return;

            try {
                const res = await fetch(`${process.env.REACT_APP_API_SERVER}/reservation/seats/occupied?showtimeId=${showtimeId}`);
                if (res.ok) {
                    const data = await res.json();
                    setOccupiedSeats(data);
                }
            } catch (e) {
                console.error('예약된 좌석 불러오기 실패', e);
            }
        }
        fetchOccupiedSeats();
    }, [movieData?.showtimeId]);

    // 좌석 레이아웃 설정
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            const layout = parseSeatLayout(movieData?.seatLayout);
            setSeatLayout(layout);
            setLoading(false);
        }, 500);
    }, [movieData?.seatLayout]);

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

    const handlePayment = async () => {
        if (!selectedPaymentMethod) {
            alert('결제 방법을 선택해주세요.');
            return;
        }

        const reservationData = {
            userId: JSON.parse(localStorage.getItem("user")).userId,
            movieId: movieData?.movieId,
            movieTitle: movieData?.movieTitle,
            moviePosterImageUrl: movieData?.posterImageUrl,
            showtimeId: movieData?.showtimeId,
            cinemaName: movieData?.cinemaName,
            seats: selectedSeats,
            people: peopleCount,
            price: seatPrice,
            totalPrice: totalPrice,
            paymentMethod: selectedPaymentMethod,
        };

        try {
            const res = await fetch(`${process.env.REACT_APP_API_SERVER}/reservation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reservationData),
            });

            if (res.ok) {
                const responseData = await res.text();
                setShowPaymentModal(false);
                setReqReservedCode(responseData);
                setShowSuccessModal(true);
            } else {
                const errorText = await res.text();
                alert('예매 실패: ' + errorText);
            }
        } catch (error) {
            alert('예매 요청 중 오류가 발생했습니다.');
            console.error(error);
        }
    };

    const getSeatClass = (seat) => {
        const seatId = seat.id;
        if (occupiedSeats.includes(seatId)) return 'bg-gray-400 cursor-not-allowed text-gray-600';
        if (selectedSeats.includes(seatId)) return 'bg-red-500 text-white';
        return 'bg-green-400 hover:bg-green-500 cursor-pointer text-white';
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
        <div style={{width: "1100px"}} className="px-8 py-4 mx-auto">
            <h1 className="text-3xl text-center font-bold mb-4">좌석 선택</h1>
            <div>
                <div className="grid grid-cols-1 lg:grid-cols-3 mb-8">
                    {/* 왼쪽: 영화 포스터 및 정보 */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg">
                            <img src={movieData?.posterImageUrl} alt={movieData?.movieTitle} className="w-[275px] object-cover rounded mb-4" />
                            <div>
                                <h2 className="text-2xl font-bold mb-2 text-gray-900">{movieData?.movieTitle}</h2>
                                {movieData?.startTime && (
                                    <p className="text-lg mb-2">
                                        상영시간: {new Date(movieData.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                )}
                                <p className="text-blue-600 font-semibold mb-2">관람 인원: {peopleCount}명</p>
                                <p className="text-gray-600 mb-2">좌석당 가격: {seatPrice.toLocaleString()}원</p>
                                <div className="pt-4 mt-4">
                                    <p className="text-lg font-bold text-red-600">
                                        총 가격: {totalPrice.toLocaleString()}원
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* 선택된 좌석 정보 */}
                        <div className="bg-white rounded-lg w-60 p-4 mt-4">
                            <h3 className="text-lg font-bold mb-3">선택된 좌석</h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedSeats.length > 0 ? (
                                    selectedSeats.sort().map(seatId => (
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
                        <div className="mt-4">
                            <button
                                onClick={handlePaymentButtonClick}
                                className="w-[275px] py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition text-lg"
                            >
                                {totalPrice.toLocaleString()}원 결제하기
                            </button>
                        </div>
                    </div>

                    {/* 오른쪽: 좌석 선택 */}
                    <div className="lg:col-span-2 lg:mt-8">
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
                                {seatLayout.map(({ row, seats }) => {
                                    const leftSeats = seats.slice(0, 8);
                                    const rightSeats = seats.slice(8);
                                    
                                    return (
                                        <div key={row} className="flex items-center justify-center space-x-2">
                                            {/* 왼쪽 행 표시 */}
                                            <div className="w-8 text-center font-bold text-gray-600">{row}</div>
                                            
                                            {/* 왼쪽 좌석들 */}
                                            <div className="flex space-x-1">
                                                {leftSeats.map(seat => (
                                                    <button
                                                        key={seat.id}
                                                        onClick={() => toggleSeat(seat.id)}
                                                        disabled={occupiedSeats.includes(seat.id)}
                                                        className={`w-8 h-8 rounded text-xs font-bold transition-colors ${getSeatClass(seat)}`}
                                                    >
                                                        {seat.number}
                                                    </button>
                                                ))}
                                            </div>
                                            
                                            {/* 중앙 통로 */}
                                            <div className="w-8"></div>
                                            
                                            {/* 오른쪽 좌석들 */}
                                            <div className="flex space-x-1">
                                                {rightSeats.map(seat => (
                                                    <button
                                                        key={seat.id}
                                                        onClick={() => toggleSeat(seat.id)}
                                                        disabled={occupiedSeats.includes(seat.id)}
                                                        className={`w-8 h-8 rounded text-xs font-bold transition-colors ${getSeatClass(seat)}`}
                                                    >
                                                        {seat.number}
                                                    </button>
                                                ))}
                                            </div>
                                            
                                            {/* 오른쪽 행 표시 */}
                                            <div className="w-8 text-center font-bold text-gray-600">{row}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 결제 방법 선택 모달 */}
                {showPaymentModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-96">
                            <h2 className="text-xl font-bold mb-4">결제 방법 선택</h2>
                            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                <p className="text-lg font-semibold text-center">
                                    총 결제 금액: {totalPrice.toLocaleString()}원
                                </p>
                            </div>
                            <div className="space-y-4 mb-4">
                                {paymentMethods.map(method => (
                                    <button
                                        key={method.id}
                                        onClick={() => setSelectedPaymentMethod(method.id)}
                                        className={`flex items-center space-x-2 w-full p-3 rounded-lg transition-colors ${selectedPaymentMethod === method.id ? 'bg-blue-100' : 'bg-gray-100 hover:bg-gray-200'}`}
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
                                    {totalPrice.toLocaleString()}원 결제하기
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showSuccessModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-8 w-96 flex flex-col items-center">
                            <span className="text-5xl mb-4 text-green-500">🎉</span>
                            <h2 className="text-2xl font-bold mb-2 text-gray-800">결제가 완료되었습니다!</h2>
                            <p className="text-gray-600 mb-6">예매가 정상적으로 처리되었습니다.</p>
                            <CopyableText text={reqReservedCode} />
                            <button
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    navigate('/');
                                }}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                            >
                                확인
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function CopyableText({ text }) {
    const handleClick = () => {
        navigator.clipboard.writeText(text)
            .then(() => alert('예매 코드가 복사되었습니다'))
            .catch((err) => console.error('복사 실패:', err));
    };

    return (
        <p className="text-black text-lg my-4 cursor-pointer" onClick={handleClick}>
            {text}
        </p>
    );
}
