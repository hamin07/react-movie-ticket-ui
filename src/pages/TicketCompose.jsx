export default function TicketCompose() {
    
    const items = Array.from({ length: 10 }, (_, i) => i + 1);

    const a = ["px-4", "py-2", "shadow-lg", "border-gray", "rounded-full", "cursor-pointer", "hover:shadow-xl", "duration-300"].join(" ");

    return (
        <div className="px-8">
            <h1 className="text-4xl font-semibold text-center mb-12">티켓구매</h1>

            <div className="flex justify-between items-center">
                <div className={a}>
                    영화관 및 예매일 변경
                </div>
                <div className={a}>
                    영화관별 상영 시간표 보기
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
                {items.map((item) => (
                    <div key={item} className="p-4 border rounded-lg shadow">
                        <img src={`/static/img/test-img-${item}.jpg`} alt="..." />
                        영화 {item}번
                    </div>
                ))}
            </div>
        </div>
    );
}