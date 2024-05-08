let pickTeam = '';
const games = document.querySelector('.games');
const account = document.querySelector('.account');
let listenPlaceBet = false;
let listenConfirmBet = false;
const api_key = 'e603050424de0c31810f91e691efa21d';
// Need to remove confirm bet modal


account.innerText = localStorage.getItem('savedBalance');

if (account.innerText == false) {
    localStorage.setItem('savedBalance', 1000);
    account.innerText = localStorage.getItem('savedBalance');
}

// let balance;
// if (balance === undefined) {
//     localStorage.setItem('balance', 2000);
//     let balance = localStorage.getItem('balance');
//     account.innerText = balance;
// } else {
//     let balance = localStorage.getItem('balance');
//     account.innerText = balance;
// }

const editBalance = document.querySelector('.edit-balance');
const editBalanceModal = document.querySelector('.edit-balance-modal');
const submitEditBalanceModal = document.querySelector('.submit-edit-balance-modal');
const change = document.querySelector('.change');
const spentMoney = document.querySelector('.spentMoney');

editBalance.addEventListener('click', () => {
    change.value = '';
    editBalanceModal.showModal();

    submitEditBalanceModal.addEventListener('click', () => {
        balance = balance + parseInt(change.value);
        account.innerText = balance;
        spentMoney.innerText = parseInt(spentMoney.innerText) + parseInt(change.value);
        editBalanceModal.close();
    }, { once: true })
})

const getData = async () => {
    const res = await fetch(`https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?apiKey=${api_key}&regions=us&markets=spreads&oddsFormat=american`);
    const data = await res.json();
    console.log(data);


    const homeSpreads = [];
    const awaySpreads = [];
    const homePriceArr = [];
    const awayPriceArr = [];
    const homePointsArr = [];
    const awayPointsArr = [];

    const getSpreads = () => {
        for (const contest of data) {
            for (const bookmaker of contest.bookmakers) {
                if (bookmaker.markets[0].outcomes[0].point > 0) {
                    var point1 = `+${bookmaker.markets[0].outcomes[0].point}`;
                } else {
                    var point1 = bookmaker.markets[0].outcomes[0].point;
                }

                if (bookmaker.markets[0].outcomes[1].point > 0) {
                    var point2 = `+${bookmaker.markets[0].outcomes[1].point}`;
                } else {
                    var point2 = bookmaker.markets[0].outcomes[1].point;
                }

                if (bookmaker.markets[0].outcomes[0].price > 0) {
                    var price1 = `+${bookmaker.markets[0].outcomes[0].price}`;
                } else {
                    var price1 = bookmaker.markets[0].outcomes[0].price;
                }

                if (bookmaker.markets[0].outcomes[1].price > 0) {
                    var price2 = `+${bookmaker.markets[0].outcomes[1].price}`;
                } else {
                    var price2 = bookmaker.markets[0].outcomes[1].price;
                }

                if (bookmaker.key === "draftkings") {
                    if (bookmaker.markets[0].outcomes[0].name == contest.home_team) {
                        homeSpreads.push(`${point1}/${price1}`);
                        awaySpreads.push(`${point2}/${price2}`);
                        homePriceArr.push(`${price1}`);
                        awayPriceArr.push(`${price2}`);
                        homePointsArr.push(`${point1}`);
                        awayPointsArr.push(`${point2}`);
                    } else {
                        homeSpreads.push(`${point2}/${price2}`);
                        awaySpreads.push(`${point1}/${price1}`);
                        homePriceArr.push(`${price2}`);
                        awayPriceArr.push(`${price1}`);
                        homePointsArr.push(`${point2}`);
                        awayPointsArr.push(`${point1}`);
                    }
                }
            }
        }
    }
    getSpreads();

    const listGames = () => {
        for (let i = 0; i < data.length; i++) {
            const game = document.createElement('section');
            const teams = document.createElement('div');
            const picks = document.createElement('div');
            const homeInfo = document.createElement('div');
            const verses = document.createElement('div');
            const awayInfo = document.createElement('div');
            const homeName = document.createElement('div');
            const homeNums = document.createElement('div');
            const awayName = document.createElement('div');
            const awayNums = document.createElement('div');
            const homePick = document.createElement('div');
            const homeImg = document.createElement('img');
            const homeStatus = document.createElement('div');
            const bet = document.createElement('button');
            const awayPick = document.createElement('div');
            const awayImg = document.createElement('img');
            const awayStatus = document.createElement('div');

            // console.log(homeSpreads);
            // console.log(data.length)

            games.append(game);
            game.append(teams);
            game.append(picks);
            teams.append(homeInfo);
            teams.append(verses);
            teams.append(awayInfo);
            homeInfo.append(homeName);
            homeInfo.append(homeNums);
            awayInfo.append(awayName);
            awayInfo.append(awayNums);
            picks.append(homePick);
            picks.append(bet);
            picks.append(awayPick);
            homePick.append(homeImg);
            homePick.append(homeStatus);
            awayPick.append(awayImg);
            awayPick.append(awayStatus);

            game.classList.add('game');
            teams.classList.add('teams');
            picks.classList.add('picks');
            homeInfo.classList.add('left');
            verses.classList.add('middle');
            awayInfo.classList.add('right');
            homeName.classList.add('names');
            homeNums.classList.add('spread');
            awayName.classList.add('names');
            awayNums.classList.add('spread');
            homeStatus.classList.add('status');
            awayStatus.classList.add('status');
            homeImg.classList.add('pickImg');

            homeImg.src = "../img/squigs.png";
            awayImg.src = "../img/logo.png";

            homeStatus.innerText = "Home";
            awayStatus.innerText = "Away";
            homeName.innerText = data[i].home_team;
            homeNums.innerText = homeSpreads[i];
            verses.innerText = 'vs';
            awayName.innerText = data[i].away_team;
            awayNums.innerText = awaySpreads[i];
            bet.innerText = 'Place Bet';

            homeImg.addEventListener('click', () => {
                homeImg.style.backgroundColor = "blue";
                awayImg.style.backgroundColor = "gray";
            })

            awayImg.addEventListener('click', () => {
                awayImg.style.backgroundColor = "blue";
                homeImg.style.backgroundColor = "gray";
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

                // for (let i = 0; i < 16; i++) {
                bet.addEventListener('click', function betFunc() {
                    betModal.showModal();
                    const teamName = document.querySelector('#teamName');
                    const spread = document.querySelector('#spread');
                    const homePoints = document.querySelector('.homePoints');
                    const awayPoints = document.querySelector('.awayPoints');
                    const homePrice = document.querySelector('.homePrice');
                    const awayPrice = document.querySelector('.awayPrice');
                    const betModalHomeTeam = document.querySelector('.betModalHomeTeam');
                    const betModalAwayTeam = document.querySelector('.betModalAwayTeam');
                    const betAmount = document.querySelector('#betAmount');
                    betAmount.value = "";

                    // teamName.value = 'Green Bay Packers';
                    // spread.value = 3;
                    // betAmount.value = 110;

                    betModalHomeTeam.addEventListener('click', () => {
                        teamName.value = betModalHomeTeam.innerText;
                        points.value = homePoints.innerText;
                        price.value = homePrice.innerText;
                    })

                    betModalAwayTeam.addEventListener('click', () => {
                        teamName.value = betModalAwayTeam.innerText;
                        points.value = awayPoints.innerText;
                        price.value = awayPrice.innerText;
                    })

                    betModalHomeTeam.innerText = data[i].home_team;
                    homePoints.innerText = homePointsArr[i];
                    homePrice.innerText = homePriceArr[i];
                    betModalAwayTeam.innerText = data[i].away_team;
                    awayPoints.innerText = awayPointsArr[i];
                    awayPrice.innerText = awayPriceArr[i];

                    // console.log("Yes, you clicked button", i)
                    // console.log(data[i].home_team)
                    pickTeam = '';


                    placeBet.addEventListener('click', function Func() {

                        // console.log(data[i].home_team)
                        if (data[0].bookmakers[0].markets[0].outcomes[0].name == data[i].home_team) {
                            var priceLeft = data[i].bookmakers[0].markets[0].outcomes[0].price;
                            var priceRight = data[i].bookmakers[0].markets[0].outcomes[1].price;
                            // console.log(data[i].home_team)
                        } else {
                            var priceLeft = data[i].bookmakers[0].markets[0].outcomes[1].price;
                            var priceRight = data[i].bookmakers[0].markets[0].outcomes[0].price;
                            // console.log(data[i].home_team)
                        }
                        if (betAmount.value > parseInt(account.innerText) || betAmount.value === '' || betAmount.value == 0 || pickTeam == '') {
                            alert('Please enter an amount greater than 0 and less than your account balance. Number can have at most 2 decimal places. Also make sure to pick a team');
                        } else {
                            listenPlaceBet = true;
                            if (confirmBetModal.open == false) {

                                // Create confirm bet modal message
                                const confirmBetModalMessage = document.querySelector('.confirmBetModalMessage');
                                let winnings = priceLeft;
                                if (pickTeam === 'home') {
                                    betModal.close();
                                    confirmBetModal.showModal();
                                    // console.log(`You picked the home team`);
                                    if (priceLeft < 0) {
                                        // console.log('negative price', priceLeft)
                                        winnings = Math.ceil(betAmount.value / (Math.abs(priceLeft) / 100));
                                        // console.log(winnings);
                                    } else {
                                        // console.log('positive price');
                                        winnings = Math.abs(betAmount.value * (priceLeft / 100));
                                        // console.log(betAmount.value, priceLeft)
                                        // console.log(winnings);
                                    }
                                    confirmBetModalMessage.innerText = `You have placed a $${betAmount.value} bet on the ${betModalHomeTeam.innerText} at ${homePoints.innerText} odds. If the ${betModalHomeTeam.innerText} cover the spread againt the ${betModalAwayTeam.innerText} you will win $${winnings} plus receive your intial bet back. Otherwise you will lose the entirety of the bet. If you understand this and wish to proceed please click the confirmation button below.`
                                } else if (pickTeam === 'away') {
                                    betModal.close();
                                    confirmBetModal.showModal();
                                    // console.log(`You picked the away team`);
                                    // let winnings = priceRight;
                                    if (priceRight < 0) {
                                        // console.log('negative price')
                                        winnings = Math.ceil(betAmount.value / (Math.abs(priceRight) / 100));
                                        // console.log(winnings);
                                    } else {
                                        // console.log('positive price');
                                        winnings = Math.abs(betAmount.value * (priceRight / 100));
                                        // console.log(betAmount.value, priceLeft)
                                        // console.log(winnings);
                                    }

                                    // winnings = Math.abs(betAmount.value * (priceRight / 100));
                                    confirmBetModalMessage.innerText = `You have placed a $${betAmount.value} bet on the ${betModalAwayTeam.innerText} at ${awayPoints.innerText} odds. If the ${betModalAwayTeam.innerText} cover the spread against the ${betModalHomeTeam.innerText} you will win $${winnings} plus receive your intial bet back. Otherwise you will lose the entirety of the bet. If you understand this and wish to proceed please click the confirmation button below.`
                                }
                            }
                            if (listenConfirmBet == false) {
                                confirmBet.addEventListener('click', function confirm() {
                                    if (pickTeam === 'home') {
                                        console.log(`You have placed a $${betAmount.value} bet on the ${betModalHomeTeam.innerText} at ${homePoints.innerText} odds`)
                                    } else {
                                        console.log(`You have placed a $${betAmount.value} bet on the ${betModalAwayTeam.innerText} at ${awayPoints.innerText} odds`)
                                    }

                                    confirmBetModal.close();
                                    account.innerText = parseInt(account.innerText) - parseInt(betAmount.value);
                                    localStorage.setItem('savedBalance', account.innerText);
                                    listenConfirmBet = true;
                                });
                                cancelBet.addEventListener('click', () => {
                                    confirmBetModal.close();
                                    listenConfirmBet = true;
                                });
                            }
                        }
                        placeBet.removeEventListener('click', Func);
                    });












                    if (listenPlaceBet === false) {
                        closeBetModal.addEventListener('click', () => {
                            betModal.close();
                            listenPlaceBet = true;
                            // placeBet.removeEventListener('click', Func);
                            console.log("Bet modal closed")
                        });

                        betModalHomeTeam.addEventListener('click', () => {
                            if (pickTeam !== 'home') {
                                betModalHomeTeam.style.color = '#6331c1';
                                betModalAwayTeam.style.color = 'black';
                                pickTeam = 'home';
                                console.log("Home team selected")
                            }

                        })

                        betModalAwayTeam.addEventListener('click', () => {
                            if (pickTeam !== 'away') {
                                betModalHomeTeam.style.color = 'black';
                                betModalAwayTeam.style.color = '#6331c1';
                                pickTeam = 'away';
                                console.log("Away team selected")
                            }

                        })

                        // Place Bet buttons using price of first button clicked, .target?
                        // for (const item of data) {
                        // for (let i = 0; i < 16; i++) {
                        // console.log("you clicked button", i)
                        // console.log(data[i].home_team);

                    }
                })
                // }
            }
            viewBetModal();

        }
    }
    listGames();
}

getData();