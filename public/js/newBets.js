const newBets = document.querySelector('.newBets');

for(let i = 0; i < localStorage.length - 1; i++) {
    const newBet = document.createElement('li');
    newBets.append(newBet);

    let savedBet = localStorage.getItem(i + 2);
    let savedBetParse = JSON.parse(savedBet);
    newBet.innerText = savedBetParse.teamName + savedBetParse.betAmount + savedBetParse.spread + savedBetParse.betID;

    console.log(savedBetParse.betID);
    const getGame = async () => {
        const res = await fetch(`https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?apiKey=24130c642a2c5a7e3ed0dbe6f657d841&eventIds=${savedBetParse.betID}&regions=us`);
        const data = await res.json();
        console.log(data);
    }
    getGame();
}

const getData = async () => {
    const res = await fetch('https://api.the-odds-api.com/v4/sports/americanfootball_nfl/scores/?apiKey=24130c642a2c5a7e3ed0dbe6f657d841&daysFrom=3');
    const data = await res.json();
    // console.log(data);

    const getCompleted = () => {
        for (const contest of data) {
            if (contest.completed === true) {
                    // console.log(contest)
                    console.log('completed game');
                    } else {
                        // console.log('game has not finished yet')
                    }
        }
    }
    getCompleted();
}

getData();