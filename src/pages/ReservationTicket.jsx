import { useState } from "react";

export default function ReservationTicket() {
    const [ticketNumber, setTicketNumber] = useState("");
    const [showTicket, setShowTicket] = useState(false);

    const handleSearch = () => {
        if (ticketNumber.trim() !== "") {
            // 실제 구현에서는 백엔드 API 조회 로직 추가
            setShowTicket(true);
        }
    };

    const handleKeypadInput = (value: string) => {
        if (value === "del") {
            setTicketNumber((prev) => prev.slice(0, -1));
        } else if (value === "clear") {
            setTicketNumber("");
        } else {
            setTicketNumber((prev) => prev + value);
        }
    };

    const keypadLayout = [
        ["1", "2", "3"],
        ["4", "5", "6"],
        ["7", "8", "9"],
        ["-", "0", "del"],
        ["clear"]
    ];

    return (
        <div className="px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        예매티켓조회
                    </h1>
                    <p className="text-lg text-gray-600">
                        예매하신 티켓 번호를 입력하여 조회하세요
                    </p>
                </div>

                {!showTicket ? (
                    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-200">
                        <div className="mb-4">
                            <div className="text-gray-700 font-semibold mb-2">예매번호</div>
                            <div className="text-2xl font-mono bg-gray-100 text-gray-400 rounded p-3 text-center">
                                {ticketNumber || "예: 0607-1234-5678-910"}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {keypadLayout.flat().map((key, i) => (
                                <button key={i} onClick={() => handleKeypadInput(key)}
                                    className="py-3 rounded-lg font-bold text-lg bg-gray-100 hover:bg-gray-200"
                                >
                                    {key === "del" ? "←" : key === "clear" ? "지우기" : key}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleSearch}
                            className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                        >
                            티켓 조회하기
                        </button>
                    </div>
                ) : (
                    // 기존 티켓 출력 UI 그대로 유지
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                            <div className="bg-red-600 text-white p-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold">CGV</h2>
                                    <span className="text-sm">MOVIE TICKET</span>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">아바타: 물의 길</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between"><span className="text-gray-600">극장</span><span className="font-semibold">CGV 강남점</span></div>
                                        <div className="flex justify-between"><span className="text-gray-600">상영관</span><span className="font-semibold">7관</span></div>
                                        <div className="flex justify-between"><span className="text-gray-600">좌석</span><span className="font-semibold">E열 12번</span></div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between"><span className="text-gray-600">관람일</span><span className="font-semibold">2025.06.05 (목)</span></div>
                                        <div className="flex justify-between"><span className="text-gray-600">상영시작시간</span><span className="font-semibold">19:30</span></div>
                                        <div className="flex justify-between"><span className="text-gray-600">관람료</span><span className="font-semibold">14,000원</span></div>
                                        <div className="flex justify-between"><span className="text-gray-600">예매번호</span><span className="font-semibold">{ticketNumber}</span></div>
                                    </div>
                                </div>

                                <div className="my-6 border-t-2 border-dashed border-gray-300"></div>

                                <div className="text-center text-sm text-gray-500 space-y-1">
                                    <p>※ 상영시간 10분 전까지 입장해 주시기 바랍니다.</p>
                                    <p>※ 티켓 분실 시 재발급이 불가능합니다.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <button className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                                티켓 출력하기
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-16 text-center">
                    <div className="inline-flex items-center space-x-4 text-gray-500">
                        <div className="w-8 h-px bg-gray-300"></div>
                        <span className="text-sm">빠르고 안전한 서비스</span>
                        <div className="w-8 h-px bg-gray-300"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
