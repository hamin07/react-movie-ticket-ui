import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Header() {
    const [currentTime, setCurrentTime] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            setCurrentTime(`${hours}:${minutes}:${seconds}`);
        };

        updateTime();
        
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, []);

    function getDayOfWeek(date) {
        const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
        return daysOfWeek[date.getDay()];
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    }

    const today = new Date();
    const todayDateString = formatDate(today);
    const todayDay = getDayOfWeek(today);
    const isHomePage = location.pathname === "/";

    return (
        <div className="md:flex justify-between items-center px-4 pt-4">
            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                    {!isHomePage && (
                        <button onClick={() => navigate(-1)} title="뒤로 가기" style={{height: "60px"}}>
                            <img src="/static/img/arrow-img.jpg" alt="..." style={{width: "60px", height: "45px"}} />
                        </button>
                    )}
                    <h2 className="text-6xl font-semibold text-red-500 font-mono cursor-pointer" onClick={() => {navigate("/")}}>CGV</h2>
                </div>
                <p className="font-semibold text-2xl mt-1">영화 예매 프로그램</p>
            </div>
            <div className="flex items-center justify-between space-x-6">
                <p className="text-2xl mt-1">{todayDateString} ({todayDay})</p>
                <p className="text-4xl">{currentTime}</p>
            </div>
        </div>
    );
}