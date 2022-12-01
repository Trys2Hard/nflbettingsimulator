const homeTeams = document.querySelector('.homeTeams');
const awayTeams = document.querySelector('.awayTeams');

const games = document.querySelector('.games');

const getData = async () => {
    const res = await fetch('https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?apiKey=24130c642a2c5a7e3ed0dbe6f657d841&regions=us&markets=spreads&oddsFormat=american');
    const data = await res.json();
    console.log(data);

    let num = 0;
    let bookmakers = data[num].bookmakers;
    const spreadName = () => {
        bookmakers.forEach((bookmaker) => {
            for (const prop in bookmaker) {
                if (bookmaker[prop] === 'fanduel') {
                    const game = document.createElement('section')
                    const team1 = document.createElement('div');
                    const team1Spread = document.createElement('div');
                    const team2 = document.createElement('div');
                    const team2Spread = document.createElement('div');
                    const match = document.createElement('div');
                    const pickLeft = document.createElement('button');
                    const pickRight = document.createElement('button');

                    games.append(game);
                    game.append(pickLeft);
                    game.append(team1);
                    game.append(team1Spread);
                    game.append(match);
                    game.append(team2);
                    game.append(team2Spread);
                    game.append(pickRight);


                    pickLeft.innerText = "Pick";
                    pickRight.innerText = "Pick";

                    pickLeft.addEventListener('click', () => {
                        pickLeft.style.backgroundColor = "blue";
                        pickRight.style.backgroundColor = "gray";
                    })

                    pickRight.addEventListener('click', () => {
                        pickRight.style.backgroundColor = "blue";
                        pickLeft.style.backgroundColor = "gray";
                    })

                    team1.innerText = bookmaker.markets[0].outcomes[0].name;
                    if (bookmaker.markets[0].outcomes[0].point > 0) {
                        team1Spread.innerText = `+${bookmaker.markets[0].outcomes[0].point}`;
                    } else {
                        team1Spread.innerText = bookmaker.markets[0].outcomes[0].point;
                    }
                    team2.innerText = bookmaker.markets[0].outcomes[1].name;
                    if (bookmaker.markets[0].outcomes[1].point > 0) {
                        team2Spread.innerText = `+${bookmaker.markets[0].outcomes[1].point}`;
                    } else {
                        team2Spread.innerText = bookmaker.markets[0].outcomes[1].point;
                    }

                    game.classList.add('game');

                    if (bookmaker.markets[0].outcomes[0].name === data[num].away_team) {
                        team1.style.color = "red";
                        team2.style.color = "blue";
                    } else if (bookmaker.markets[0].outcomes[0].name === data[num].home_team) {
                        team1.style.color = "blue";
                        team2.style.color = "red";
                    }

                    if (team1.style.color === 'red') {
                        match.innerText = 'at';
                    } else {
                        match.innerText = 'vs';
                    }

                    num++;
                    if (num < data.length) {
                        bookmakers = data[num].bookmakers;
                    }
                }
            }
        })
    }
    for (let i = 0; i < data.length; i++) {
        spreadName();
    }
}

getData();