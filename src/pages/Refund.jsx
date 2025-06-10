// import "../css/Refund.css"; // Assuming you have some styles in Refund.css


// export default function Refund() {
//     return (
//        <div className="title1">
//             <h1 className="text-4xl font-semibold text-center mb-4">환불 페이지</h1>
//             <p className="text-center text-lg">환불 정책에 따라 환불을 진행합니다.</p>
//             <div className="flex justify-center mt-8">
//                 <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
//                     환불 요청하기
//                 </button>
//             </div>
//        </div>
//     );
// }
export default function Refund() {
    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="bg-white border-4 border-red-350 p-10 rounded-2xl shadow-2xl w-full max-w-3xl">
                <h1 className="text-5xl font-bold text-center text-red-600 mb-6">환불 안내</h1>
                
                <p className="text-center text-xl text-gray-700 mb-8">
                    예매하신 티켓을 환불하시려면 아래 정보를 확인 후 <br />‘환불 요청’ 버튼을 눌러주세요.
                </p>

                {/* 환불 정보 요약 */}
                <div className="bg-gray-50 p-6 rounded-lg mb-8 text-lg">
                    <div className="mb-2"><strong>영화:</strong> 범죄도시 4</div>
                    <div className="mb-2"><strong>상영관:</strong> 3관 (컴포트)</div>
                    <div className="mb-2"><strong>상영 시간:</strong> 2025-06-11 19:30</div>
                    <div className="mb-2"><strong>좌석:</strong> F열 7, 8번</div>
                    <div className="mb-2"><strong>결제 금액:</strong> 24,000원</div>
                </div>

                {/* 버튼 */}
                <div className="flex justify-center gap-6">
                    <button className="bg-red-500 hover:bg-red-600 text-white text-2xl px-8 py-4 rounded-xl font-semibold">
                        환불 요청
                    </button>
                    <button className="bg-gray-300 hover:bg-gray-400 text-2xl px-8 py-4 rounded-xl font-semibold">
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}
