export class MovieListService {
    constructor(koficApiKey, tmdbApiKey) {
        this.KOFIC_API_KEY = koficApiKey;
        this.TMDB_API_KEY = tmdbApiKey;
    }

    async fetchPosterFromTMDb(title) {
        const query = encodeURIComponent(title);
        try {
            const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${this.TMDB_API_KEY}&query=${query}&language=ko-KR`);
            
            if (!response.ok) {
                throw new Error("TMDb API 요청 실패");
            }

            const data = await response.json();
            console.log(data);

            if (data.results && data.results.length > 0 && data.results[0].poster_path) {
                return `https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`;
            }
        } catch (error) {
            console.log('TMDb API 에러:', error);
        }
        return null;
    }

    generateScheduleInfo() {
        const times = ['09:30', '12:10', '14:50', '17:30', '20:10', '22:40'];
        const randomTime = times[Math.floor(Math.random() * times.length)];
        const totalSeats = 270;
        const availableSeats = Math.floor(Math.random() * 100) + 150; // 150-250 사이
        return { time: randomTime, availableSeats, totalSeats };
    }

    // 박스오피스
    async fetchBoxOfficeData(selectedDate) {
        const targetDate = selectedDate.replace(/-/g, '');
        const response = await fetch(
            `https://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=${this.KOFIC_API_KEY}&targetDt=${targetDate}`
        );

        if (!response.ok) {
            throw new Error('KOFIC API 데이터 불러오기 실패');
        }

        const data = await response.json();
        console.log(data);
        
        if (!data.boxOfficeResult || !data.boxOfficeResult.dailyBoxOfficeList) {
            throw new Error('박스오피스 데이터가 없습니다');
        }

        return data.boxOfficeResult.dailyBoxOfficeList;
    }

    async fetchMoviesWithDetails(selectedDate) {
        const moviesData = await this.fetchBoxOfficeData(selectedDate);

        // TMDb에서 포스터 추가 및 상영 정보 생성
        const moviesWithDetails = await Promise.all(
            moviesData.map(async (movie) => {
                const poster = await this.fetchPosterFromTMDb(movie.movieNm);
                const scheduleInfo = this.generateScheduleInfo();

                return {
                    ...movie,
                    poster,
                    ...scheduleInfo,
                };
            })
        );

        return moviesWithDetails;
    }
}