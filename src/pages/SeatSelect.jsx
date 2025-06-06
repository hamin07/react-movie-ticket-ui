import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function SeatSelection() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [selectedSeats, setSelectedSeats] = useState([]);

    const toggleSeat = (seat) => {
        setSelectedSeats(prev =>
            prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]
        );
    };

    const handlePayment = async () => {
        const reservation = {
            movie: state.movie.movieNm,
            date: state.date,
            time: state.time,
            people: state.people,
            seats: selectedSeats,
            theater: 'CGV 강남', // 나중에 선택 가능하게 변경
        };

        const res = await fetch(`${process.env.REACT_APP_API_SERVER}/reservation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservation),
        });

        if (res.ok) {
            navigate('/payment-success');
        } else {
            alert('예약 실패');
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">좌석 선택</h1>
            <p>영화: {state.movie.movieNm}</p>
            <p>일자: {state.date} / 시간: {state.time}</p>

            <div className="grid grid-cols-5 gap-2 my-4">
                {[...'ABCDEFGHIJ'].map(seat => (
                    <button key={seat}
                        onClick={() => toggleSeat(seat)}
                        className={`p-2 rounded ${selectedSeats.includes(seat) ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        {seat}
                    </button>
                ))}
            </div>

            <button onClick={handlePayment}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
                결제 및 예매 완료
            </button>
        </div>
    );
}
