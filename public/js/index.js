let pickTeam = '';
const games = document.querySelector('.games');
const account = document.querySelector('.account');
let listenPlaceBet = false;
const weeks = document.querySelector('#weeks');

const editBalance = document.querySelector('.edit-balance');
const editBalanceModal = document.querySelector('.edit-balance-modal');
const spentMoney = document.querySelector('.spentMoney');
const closeEditBalanceModal = document.querySelector('.close-edit-balance-modal');
const footer = document.querySelector('footer');

if (editBalance) {
    editBalance.addEventListener('click', () => {
        editBalanceModal.showModal();
        closeEditBalanceModal.addEventListener('click', () => {
            editBalanceModal.close();
        })
    })
}

// console.log(Date.now());

document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            try {
                console.log(data);
                const homeSpreads = [];
                const awaySpreads = [];
                const homePriceArr = [];
                const awayPriceArr = [];
                const homePointsArr = [];
                const awayPointsArr = [];


                const getSpreads = () => {
                    // let i = 0;
                    // let bookmakerNums = 0;
                    for (contest of data) {
                        let foundDraftkings = false;
                        // console.log(`game ${i++}`);
                        for (bookmaker of contest.bookmakers) {
                            // console.log('Bookmaker number ' + bookmakerNums)
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
                                console.log('draftkings')
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
                                foundDraftkings = true;
                                break;
                            }
                        }
                        if (!foundDraftkings) {
                            homeSpreads.push('N/A');
                            awaySpreads.push('N/A');
                            homePriceArr.push('N/A');
                            awayPriceArr.push('N/A');
                            homePointsArr.push('N/A');
                            awayPointsArr.push('N/A');
                        }
                    }
                }
                getSpreads();

                let firstGame = 1725582000000;
                let lastGame = 1725927600000;

                const listGames = () => {
                    for (let i = 0; i < data.length; i++) {
                        const startTime = Date.parse(data[i].commence_time);
                        if (startTime >= firstGame && startTime <= lastGame) {
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
                            const homeStatus = document.createElement('p');
                            const bet = document.createElement('button');
                            const awayPick = document.createElement('div');
                            const awayImg = document.createElement('img');
                            const awayStatus = document.createElement('p');
                            const id = data[i].id;

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

                            if (homeNums.innerText === 'N/A') {
                                bet.style.display = 'none';
                            }

                            if (Date.now() >= Date.parse(data[i].commence_time)) {
                                bet.style.display = 'none';
                            }

                            // console.log(Date.parse(data[i].commence_time));
                            // console.log(Date.now());

                            // homeImg.addEventListener('click', () => {
                            //     homeImg.style.backgroundColor = "blue";
                            //     awayImg.style.backgroundColor = "gray";
                            // })

                            // awayImg.addEventListener('click', () => {
                            //     awayImg.style.backgroundColor = "blue";
                            //     homeImg.style.backgroundColor = "gray";
                            // })

                            // awayImg.src = '../img/nfl-logos/kansas-city-chiefs.png';
                            // homeImg.src = '../img/nfl-logos/houston-texans.png';

                            const teamInfo = [
                                {
                                    name: 'Arizona Cardinals',
                                    img: '../img/nfl-logos/arizona-cardinals.png',
                                },
                                {
                                    name: 'Atlanta Falcons',
                                    img: '../img/nfl-logos/atlanta-falcons.png',
                                },
                                {
                                    name: 'Baltimore Ravens',
                                    img: '../img/nfl-logos/baltimore-ravens.png',
                                },
                                {
                                    name: 'Buffalo Bills',
                                    img: '../img/nfl-logos/buffalo-bills.png',
                                },
                                {
                                    name: 'Carolina Panthers',
                                    img: '../img/nfl-logos/carolina-panthers.png',
                                },
                                {
                                    name: 'Chicago Bears',
                                    img: '../img/nfl-logos/chicago-bears.png',
                                },
                                {
                                    name: 'Cincinnati Bengals',
                                    img: '../img/nfl-logos/cincinnati-bengals.png',
                                },
                                {
                                    name: 'Cleveland Browns',
                                    img: '../img/nfl-logos/cleveland-browns.png',
                                },
                                {
                                    name: 'Dallas Cowboys',
                                    img: '../img/nfl-logos/dallas-cowboys.png',
                                },
                                {
                                    name: 'Denver Broncos',
                                    img: '../img/nfl-logos/denver-broncos.png',
                                },
                                {
                                    name: 'Detroit Lions',
                                    img: '../img/nfl-logos/detroit-lions.png',
                                },
                                {
                                    name: 'Green Bay Packers',
                                    img: '../img/nfl-logos/green-bay-packers.png',
                                },
                                {
                                    name: 'Houston Texans',
                                    img: '../img/nfl-logos/houston-texans.png',
                                },
                                {
                                    name: 'Indianapolis Colts',
                                    img: '../img/nfl-logos/indianapolis-colts.png',
                                },
                                {
                                    name: 'Jacksonville Jaguars',
                                    img: '../img/nfl-logos/jacksonville-jaguars.png',
                                },
                                {
                                    name: 'Kansas City Chiefs',
                                    img: '../img/nfl-logos/kansas-city-chiefs.png',
                                },
                                {
                                    name: 'Las Vegas Raiders',
                                    img: '../img/nfl-logos/las-vegas-raiders.png',
                                },
                                {
                                    name: 'Los Angeles Chargers',
                                    img: '../img/nfl-logos/los-angeles-chargers.png',
                                },
                                {
                                    name: 'Los Angeles Rams',
                                    img: '../img/nfl-logos/los-angeles-rams.png',
                                },
                                {
                                    name: 'Miami Dolphins',
                                    img: '../img/nfl-logos/miami-dolphins.png',
                                },
                                {
                                    name: 'Minnesota Vikings',
                                    img: '../img/nfl-logos/minnesota-vikings.png',
                                },
                                {
                                    name: 'New England Patriots',
                                    img: '../img/nfl-logos/new-england-patriots.png',
                                },
                                {
                                    name: 'New Orleans Saints',
                                    img: '../img/nfl-logos/new-orleans-saints.png',
                                },
                                {
                                    name: 'New York Giants',
                                    img: '../img/nfl-logos/new-york-giants.png',
                                },
                                {
                                    name: 'New York Jets',
                                    img: '../img/nfl-logos/new-york-jets.png',
                                },
                                {
                                    name: 'Philadelphia Eagles',
                                    img: '../img/nfl-logos/philadelphia-eagles.png',
                                },
                                {
                                    name: 'Pittsburgh Steelers',
                                    img: '../img/nfl-logos/pittsburgh-steelers.png',
                                },
                                {
                                    name: 'San Francisco 49ers',
                                    img: '../img/nfl-logos/san-francisco-49ers.png',
                                },
                                {
                                    name: 'Seattle Seahawks',
                                    img: '../img/nfl-logos/seattle-seahawks.png',
                                },
                                {
                                    name: 'Tampa Bay Buccaneers',
                                    img: '../img/nfl-logos/tampa-bay-buccaneers.png',
                                },
                                {
                                    name: 'Tennessee Titans',
                                    img: '../img/nfl-logos/tennessee-titans.png',
                                },
                                {
                                    name: 'Washington Commanders',
                                    img: '../img/nfl-logos/washington-commanders.png',
                                },
                            ];

                            teamInfo.forEach((team) => {
                                if (team.name === homeName.innerText) {
                                    homeImg.src = team.img;
                                } else if (team.name === awayName.innerText) {
                                    awayImg.src = team.img;
                                }
                            });

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
                                    const modalTeam1 = document.querySelector('.modalTeam1');
                                    const modalTeam2 = document.querySelector('.modalTeam2');
                                    const betAmount = document.querySelector('#betAmount');
                                    const winnings = document.querySelector('#winnings');
                                    const points = document.querySelector('#points');
                                    const price = document.querySelector('#price');
                                    const opponent = document.querySelector('#opponent');
                                    const gameId = document.querySelector('#gameId');
                                    const completed = document.querySelector('#completed');

                                    gameId.value = id;
                                    completed.value = "false";

                                    betModalHomeTeam.style.color = "white";
                                    betModalAwayTeam.style.color = "white";
                                    modalTeam1.style.outline = "none";
                                    modalTeam2.style.outline = "none";

                                    teamName.value = "";
                                    points.value = "";
                                    price.value = "";
                                    winnings.value = "";
                                    betAmount.value = "";

                                    function betCalculator(moneyLine) {
                                        let odds;

                                        if (moneyLine >= 0) {
                                            odds = moneyLine >= 0 ? (moneyLine / 100) + 1 : (100 / Math.abs(moneyLine)) + 1;
                                        } else {
                                            odds = moneyLine >= 0 ? (moneyLine / 100) + 1 : (100 / Math.abs(moneyLine)) + 1;
                                        }
                                        winnings.value = ((odds * betAmount.value).toFixed(2));
                                    }

                                    betAmount.addEventListener('input', () => {
                                        betCalculator(price.value);
                                        const validate = function () {
                                            const t = betAmount.value;
                                            betAmount.value = t.indexOf(".") >= 0 ? t.slice(0, t.indexOf(".") + 3) : t;
                                        };
                                        validate()
                                    })


                                    // teamName.value = 'Green Bay Packers';
                                    // spread.value = 3;
                                    // betAmount.value = 110;

                                    modalTeam1.addEventListener('click', () => {
                                        teamName.value = betModalHomeTeam.innerText;
                                        opponent.value = betModalAwayTeam.innerText;
                                        points.value = homePoints.innerText;
                                        price.value = homePrice.innerText;
                                        // gameId.value = 
                                    })

                                    modalTeam2.addEventListener('click', () => {
                                        teamName.value = betModalAwayTeam.innerText;
                                        opponent.value = betModalHomeTeam.innerText;
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
                                        if (account.innerText !== "" & account.innerText < betAmount.value || betAmount.value === '' || betAmount.value === 0 || pickTeam === '') {
                                            // if (account.innerText === "") {
                                            //     console.log('account.innerText is an empty string')
                                            // }
                                            // console.log(betAmount.value);
                                            // console.log(account.innerText);
                                            // console.log(pickTeam);
                                            alert('Please enter an amount greater than 0 and less than your account balance. Number can have at most 2 decimal places. Also make sure to pick a team');
                                        } else {
                                            account.innerText = account.innerText - betAmount.value;
                                        }
                                    });

                                    if (listenPlaceBet === false) {
                                        closeBetModal.addEventListener('click', () => {
                                            betModal.close();
                                            listenPlaceBet = true;
                                        });

                                        modalTeam1.addEventListener('click', () => {
                                            if (pickTeam !== 'home') {
                                                winnings.value = "";
                                                betAmount.value = "";
                                                // betModalHomeTeam.style.color = 'white';
                                                modalTeam2.style.outline = 'none';
                                                modalTeam1.style.outline = '1px solid white';
                                                pickTeam = 'home';
                                            }
                                        })

                                        modalTeam2.addEventListener('click', () => {
                                            if (pickTeam !== 'away') {
                                                winnings.value = "";
                                                betAmount.value = "";
                                                // betModalHomeTeam.style.color = 'white';
                                                modalTeam1.style.outline = 'none';
                                                modalTeam2.style.outline = '1px solid white';
                                                pickTeam = 'away';
                                            }
                                        })
                                    }
                                })
                                if (startTime <= Date.now()) {
                                    bet.hidden = true;
                                }
                            }
                            viewBetModal();
                        }
                        else {
                            console.log('Error listing games')
                        }
                    }
                }

                weeks.addEventListener('change', (e) => {
                    // footer.style.position = 'relative';
                    if (e.target.value === "Week1") {
                        games.replaceChildren();
                        firstGame = 1725582000000;
                        lastGame = 1725927600000;
                        listGames();
                    } else if (e.target.value === "Week2") {
                        games.replaceChildren();
                        firstGame = 1726186800000;
                        lastGame = 1726532100000;
                        listGames();
                    } else if (e.target.value === "Week3") {
                        games.replaceChildren();
                        firstGame = 1726791300000;
                        lastGame = 1727136900000;
                        listGames();
                    } else if (e.target.value === "Week4") {
                        games.replaceChildren();
                        firstGame = 1727396100000;
                        lastGame = 1727741700000;
                        listGames();
                    } else if (e.target.value === "Week5") {
                        games.replaceChildren();
                        firstGame = 1728000900000;
                        lastGame = 1728346500000;
                        listGames();
                    } else if (e.target.value === "Week6") {
                        games.replaceChildren();
                        firstGame = 1728605700000;
                        lastGame = 1728951300000;
                        listGames();
                    } else if (e.target.value === "Week7") {
                        games.replaceChildren();
                        firstGame = 1729210500000;
                        lastGame = 1729558800000;
                        listGames();
                    } else if (e.target.value === "Week8") {
                        games.replaceChildren();
                        firstGame = 1729815300000;
                        lastGame = 1730161200000;
                        listGames();
                    } else if (e.target.value === "Week9") {
                        games.replaceChildren();
                        firstGame = 1730420100000;
                        lastGame = 1730769300000;
                        listGames();
                    } else if (e.target.value === "Week10") {
                        games.replaceChildren();
                        firstGame = 1731028500000;
                        lastGame = 1731374400000;
                        listGames();
                    } else if (e.target.value === "Week11") {
                        games.replaceChildren();
                        firstGame = 1731633300000;
                        lastGame = 1731978900000;
                        listGames();
                    } else if (e.target.value === "Week12") {
                        games.replaceChildren();
                        firstGame = 1732238100000;
                        lastGame = 1732583700000;
                        listGames();
                    } else if (e.target.value === "Week13") {
                        games.replaceChildren();
                        firstGame = 1732815000000;
                        lastGame = 1733184900000;
                        listGames();
                    } else if (e.target.value === "Week14") {
                        games.replaceChildren();
                        firstGame = 1733447700000;
                        lastGame = 1733793300000;
                        listGames();
                    } else if (e.target.value === "Week15") {
                        games.replaceChildren();
                        firstGame = 1734052500000;
                        lastGame = 1734399000000;
                        listGames();
                    } else if (e.target.value === "Week16") {
                        games.replaceChildren();
                        firstGame = 1734657300000;
                        lastGame = 1735002900000;
                        listGames();
                    } else if (e.target.value === "Week17") {
                        games.replaceChildren();
                        firstGame = 1735149600000;
                        lastGame = 1735607700000;
                        listGames();
                    } else if (e.target.value === "Week18") {
                        games.replaceChildren();
                        firstGame = 1736100000000;
                        lastGame = 1736112300000;
                        listGames();
                    }
                })
            } catch {
                console.log(data);
            }
        });

});