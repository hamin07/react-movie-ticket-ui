import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();    
    const textStyle = ["text-3xl", "font-semibold"];
    const btnStyle = ["px-6", "py-2", "text-xl", "cursor-pointer", "bg-gray-100", 
        "hover:bg-gray-200", "rounded-full", "my-10" 
    ];

    return (
        <div className="text-center">
            <h1 className={textStyle.join(" ")}>요청하신 페이지를 찾을 수 없습니다.</h1>
            <button type="button" className={btnStyle.join(" ")} onClick={() => {
                navigate(-1)
            }}>
                돌아가기
            </button>
        </div>
    );
}