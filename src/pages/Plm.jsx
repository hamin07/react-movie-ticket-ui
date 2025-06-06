import { useEffect, useState } from "react";

export default function BoxOffice() {
    const [state, setState] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_SERVER}/movie/all`);
                if (res.ok) {
                    const data = await res.json();
                    console.log(data);
                    setState(data);
                }
            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h2>🎬 박스오피스 목록</h2>
            <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>순위</th>
                        <th>제목</th>
                        <th>개봉일</th>
                        <th>관객 수</th>
                    </tr>
                </thead>
                <tbody>
                    {state.length === 0 ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: "center" }}>불러오는 중...</td>
                        </tr>
                    ) : (
                        state.map((movie, index) => (
                            <tr key={movie.id || index}>
                                <td>{index + 1}</td>
                                <td>{movie.title}</td>
                                <td>{movie.releaseDate}</td>
                                <td>{movie.audienceCount.toLocaleString()}명</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
