const newBets = document.querySelector('.newBets');
const homeScore = '';
const awayScore = '';
const teamNames = [];

for (let i = 0; i < localStorage.length - 1; i++) {
    const newBet = document.createElement('li');
    newBets.append(newBet);

    let savedBet = localStorage.getItem(i);
    let savedBetParse = JSON.parse(savedBet);
    newBet.innerText = savedBetParse.teamName + savedBetParse.betAmount + savedBetParse.points + savedBetParse.price + savedBetParse.betID;

    // console.log(savedBetParse.teamName);

    teamNames.push(savedBetParse.teamName);


    const getGame = async () => {
        const res = await fetch(`https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?apiKey=api_key&eventIds=${savedBetParse.betID}&regions=us`);
        const data = await res.json();
        console.log(data);
        // console.log(savedBetParse.betID);
        // if (savedBetParse.betID === data[0].id) {
        //     console.log('match');
        // }
        if (data.length > 0) {
            if (data[0].completed === true) {
                // getData function goes here
            } else {
                // if (savedBetParse.teamName === data[0].homeTeam) {
                //     console.log('bet was placed on the home team');
                // } else if (savedBetParse.teamName === data[0].awayTeam) {
                //     console.log('bet was placed on the away team');
                // }
                console.log(savedBetParse.teamName, data[0].homeTeam)
            }
        } else {
            console.log('Bet not from game completed in last 3 days')
        }
    }

    getGame();
    // console.log(savedBetParse.betID);

    // const getData = async () => {
    //     const res = await fetch('https://api.the-odds-api.com/v4/sports/americanfootball_nfl/scores/?apiKey=api_key&daysFrom=3');
    //     const data = await res.json();
    //     console.log(data);
    // }
    // getData();
}

console.log(teamNames);

// const getData = async () => {
//     const res = await fetch('https://api.the-odds-api.com/v4/sports/americanfootball_nfl/scores/?apiKey=api_key&daysFrom=3');
//     const data = await res.json();

//     const getCompleted = () => {
//         for (const contest of data) {
//             if (contest.completed === true) {
//                 console.log(contest)
//                 // console.log(contest.scores[0].score, contest.scores[1].score, contest.scores[0].name, contest.scores[1].name);
//                 // console.log(contest.away_team);

//                 // if (contest.scores[0].name === contest.home_team) {
//                 //     console.log('home team')
//                 // } else if (contest.scores[0].name === contest.away_team) {
//                 //     console.log('away team')
//                 // }

//             } else {
//                 // console.log('game has not finished yet')
//             }
//         }
//     }
//     getCompleted();
// }

// getData();