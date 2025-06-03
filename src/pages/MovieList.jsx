import { useState } from "react";

export default function MovieList() {
    const [showTheaterModal, setShowTheaterModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    
    const items = Array.from({ length: 10 }, (_, i) => i + 1);
    const a = ["px-4", "py-2", "shadow-lg", "border-gray", "rounded-full", "cursor-pointer", "hover:shadow-xl", "duration-300"].join(" ");

    // 영화관 목록 데이터
    const theaters = [
        { id: 1, name: "CGV 강남", location: "서울 강남구", distance: "2.3km" },
        { id: 2, name: "롯데시네마 홍대", location: "서울 마포구", distance: "5.1km" },
        { id: 3, name: "메가박스 코엑스", location: "서울 강남구", distance: "3.7km" },
        { id: 4, name: "CGV 용산아이파크몰", location: "서울 용산구", distance: "4.2km" },
        { id: 5, name: "롯데시네마 월드타워", location: "서울 송파구", distance: "6.8km" }
    ];

    // 상영 시간표 데이터
    const schedules = [
        { movie: "어벤져스", times: ["09:30", "12:10", "14:50", "17:30", "20:10"] },
        { movie: "스파이더맨", times: ["10:00", "13:20", "16:40", "19:20"] },
        { movie: "아이언맨", times: ["11:15", "14:30", "17:45", "21:00"] },
        { movie: "토르", times: ["09:45", "12:30", "15:15", "18:00", "20:45"] }
    ];

    return (
        <div className="px-8">
            <h1 className="text-4xl font-semibold text-center mb-12">티켓구매</h1>

            <div className="flex justify-between items-center">
                <div 
                    className={a}
                    onClick={() => setShowTheaterModal(true)}
                >
                    영화관 및 예매일 변경
                </div>
                <div 
                    className={a}
                    onClick={() => setShowScheduleModal(true)}
                >
                    영화관별 상영 시간표 보기
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
                {items.map((item) => (
                    <div key={item} className="cursor-pointer hover:bg-gray-200 duration-300 rounded-lg">
                        <img src={`/static/img/test-img-${item}.jpg`} alt="..." className="rounded-lg w-full" />
                        <div className="p-2 flex justify-between items-center">
                            <h1 className="text-3xl">16:10</h1>
                            <div className="text-right">
                                <p className="font-semibold text-lg">영화제목{item}</p>
                                <p>241석/270석</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 영화관 변경 모달 */}
            {showTheaterModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">영화관 및 예매일 변경</h2>
                            <button 
                                onClick={() => setShowTheaterModal(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">예매일 선택</h3>
                            <div className="flex gap-2 mb-4">
                                {['오늘', '내일', '모레'].map((day, index) => (
                                    <button 
                                        key={index}
                                        className="px-4 py-2 border rounded-lg hover:bg-blue-50 hover:border-blue-300"
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                            <input 
                                type="date" 
                                className="border rounded-lg px-3 py-2"
                                defaultValue={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-3">영화관 선택</h3>
                            <div className="space-y-2">
                                {theaters.map((theater) => (
                                    <div 
                                        key={theater.id}
                                        className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                                    >
                                        <div>
                                            <h4 className="font-semibold">{theater.name}</h4>
                                            <p className="text-sm text-gray-600">{theater.location}</p>
                                        </div>
                                        <span className="text-sm text-blue-600">{theater.distance}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <button 
                                onClick={() => setShowTheaterModal(false)}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                취소
                            </button>
                            <button 
                                onClick={() => setShowTheaterModal(false)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 상영 시간표 모달 */}
            {showScheduleModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-96 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">상영 시간표</h2>
                            <button 
                                onClick={() => setShowScheduleModal(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="mb-4">
                            <p className="text-gray-600">CGV 강남점 - 2025년 6월 3일 (화)</p>
                        </div>

                        <div className="space-y-4">
                            {schedules.map((schedule, index) => (
                                <div key={index} className="border-b pb-4">
                                    <h3 className="text-lg font-semibold mb-2">{schedule.movie}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {schedule.times.map((time, timeIndex) => (
                                            <button 
                                                key={timeIndex}
                                                className="px-3 py-1 border rounded-lg hover:bg-blue-50 hover:border-blue-300 text-sm"
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end mt-6">
                            <button 
                                onClick={() => setShowScheduleModal(false)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}