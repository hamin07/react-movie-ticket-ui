import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();

    const l = [
        {
            title: "티켓 구매",
            img: "🎫",
            loc: "/movie-list"
        },
        {
            title: "예매티켓출력",
            img: "🧾",
            loc: "/reservation"
        },
        {
            title: "환불",
            img: "💳",
            loc: "/refund"
        }
    ];

    const btnStyle = ["mt-6", "px-6", "py-3", "bg-gradient-to-r", "from-blue-500", "to-indigo-600", "text-white", 
        "rounded-full", "font-medium", "opacity-0", "group-hover:opacity-100", "transition-all", "duration-300", 
        "transform", "translate-y-2", "group-hover:translate-y-0", "hover:from-blue-600", "hover:to-indigo-700"
    ].join(" ");

    useEffect(() => {
        async function f() {
            try {
                const res = await fetch("http://localhost:9004/api");

                if (res.ok) {
                    const data = await res.json()
                        .catch((error) => {
                            console.log(error)
                        });
                    console.log(data);
                    console.log(data.message);
                }

            } catch (error) {
                console.log(error);
            }
        }

        f();
    }, []);

    return (
        <div className="px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        티켓 서비스
                    </h1>
                    <p className="text-lg text-gray-600">
                        원하는 서비스를 선택해 주세요
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {l.map((v, i) => (
                        <div 
                            key={i}
                            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 text-center cursor-pointer border border-gray-100"
                            onClick={() => navigate(v.loc)}
                        >
                            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                {v.img}
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                                {v.title}
                            </h3>
                            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <button className={btnStyle}>
                                시작하기
                            </button>
                        </div>
                    ))}
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