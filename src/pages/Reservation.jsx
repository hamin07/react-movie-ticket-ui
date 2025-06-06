export default function Reservation() {
    return (
        <div className="px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        예매티켓출력
                    </h1>
                    <p className="text-lg text-gray-600">
                        예매하신 티켓을 확인하고 출력하세요
                    </p>
                </div>
                
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                        <div className="bg-red-600 text-white p-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold">CGV</h2>
                                <span className="text-sm">MOVIE TICKET</span>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">아바타: 물의 길</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">극장</span>
                                            <span className="font-semibold">CGV 강남점</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">상영관</span>
                                            <span className="font-semibold">7관</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">좌석</span>
                                            <span className="font-semibold">E열 12번</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">관람일</span>
                                            <span className="font-semibold">2025.06.05 (목)</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">상영시작시간</span>
                                            <span className="font-semibold">19:30</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">관람료</span>
                                            <span className="font-semibold">14,000원</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">예매번호</span>
                                            <span className="font-semibold">CGV240605001</span>
                                        </div>
                                    </div>
                                    
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