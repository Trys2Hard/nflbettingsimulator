const games = document.querySelector('.games');

const getData = async () => {
    const res = await fetch('https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?apiKey=24130c642a2c5a7e3ed0dbe6f657d841&regions=us&markets=spreads&oddsFormat=american');
    const data = await res.json();
    console.log(data);

    data.forEach((contest) => {
        const getSpread = () => {
            for (const bookmaker of contest.bookmakers) {
                if (bookmaker.key === "draftkings") {
                    if (bookmaker.markets[0].outcomes[0].name == contest.home_team) {
                        return [bookmaker.markets[0].outcomes[0].point, bookmaker.markets[0].outcomes[1].point];
                    } else {
                        return [bookmaker.markets[0].outcomes[1].point, bookmaker.markets[0].outcomes[0].point];
                    }
                }
            }
        }
        let [spread1, spread2] = getSpread();

        const listGames = () => {
            const game = document.createElement('section')
            const pickLeft = document.createElement('button');
            const team1 = document.createElement('div');
            const team1Spread = document.createElement('div');
            const match = document.createElement('div');
            const team2 = document.createElement('div');
            const team2Spread = document.createElement('div');
            const pickRight = document.createElement('button');
            const bet = document.createElement('button');

            games.append(game);
            game.append(pickLeft);
            game.append(team1);
            game.append(team1Spread);
            game.append(match);
            game.append(team2);
            game.append(team2Spread);
            game.append(pickRight);
            game.append(bet);

            game.classList.add('game');

            pickLeft.innerText = "Pick Home";
            team1.innerText = contest.home_team;
            if (spread1 > 0) {
                team1Spread.innerText = `+${spread1}`;
            } else {
                team1Spread.innerText = spread1;
            }
            match.innerText = 'vs';
            team2.innerText = contest.away_team;
            if (spread2 > 0) {
                team2Spread.innerText = `+${spread2}`;
            } else {
                team2Spread.innerText = spread2;
            }
            pickRight.innerText = "Pick Away";
            bet.innerText = 'Bet';

            pickLeft.addEventListener('click', () => {
                pickLeft.style.backgroundColor = "blue";
                pickRight.style.backgroundColor = "gray";
            })

            pickRight.addEventListener('click', () => {
                pickRight.style.backgroundColor = "blue";
                pickLeft.style.backgroundColor = "gray";
            })

            const viewBetModal = () => {
                const betModal = document.querySelector('.placeBetModal');
                const closeBetModal = document.querySelector('.closeBetModal');
                const homeSpread = document.querySelector('.homeSpread');
                const awaySpread = document.querySelector('.awaySpread');
                const placeBet = document.querySelector('.placeBet');

                const confirmBetModal = document.querySelector('.confirmBetModal');
                const confirmBet = document.querySelector('.confirmBet');
                const cancelBet = document.querySelector('.cancelBet');


                bet.addEventListener('click', () => {
                    betModal.showModal();
                    const betModalHomeTeam = document.querySelector('.betModalHomeTeam');
                    const betModalAwayTeam = document.querySelector('.betModalAwayTeam');

                    betModalHomeTeam.innerText = contest.home_team;
                    if (spread1 > 0) {
                        homeSpread.innerText = `+${spread1}`;
                    } else {
                        homeSpread.innerText = spread1;
                    }
                    betModalAwayTeam.innerText = contest.away_team;
                    if (spread2 > 0) {
                        awaySpread.innerText = `+${spread2}`;
                    } else {
                        awaySpread.innerText = spread2;
                    }

                    closeBetModal.addEventListener('click', () => {
                        betModal.close();
                    })

                    placeBet.addEventListener('click', () => {
                        betModal.close();
                        if (confirmBetModal.open === false) {
                            confirmBetModal.showModal();
                        }
                        confirmBet.addEventListener('click', () => {
                            confirmBetModal.close();
                        })
                        cancelBet.addEventListener('click', () => {
                            confirmBetModal.close();
                        })
                    })
                })
            }
            viewBetModal();
        }
        listGames();
    })
}

getData();