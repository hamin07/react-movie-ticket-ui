async function p() {
    try {
        const res = await fetch("http://localhost:9004/api/reservation/reserved/movie/all");
        
        if (res.ok) {
            const data = await res.json();
            data.forEach(e => {
                console.log(e.reservationCode);
            });
        }

    } catch (error) {
        console.error(error);
        console.log(error);
    }
}

p();