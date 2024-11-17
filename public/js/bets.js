const teamNames = document.querySelectorAll('.teamName');
const gameIds = document.querySelectorAll('.gameId');
const spreads = document.querySelectorAll('.spread');
const bets = document.querySelectorAll('.info');
const completedBets = document.querySelector('.completedBets');

let namesArr = [];
function namesFunc() {
    teamNames.forEach(name => {
        namesArr.push(name.innerText);
    })
}
namesFunc();

let gameIdsArr = [];
function gameIdsFunc() {
    gameIds.forEach(game => {
        gameIdsArr.push(game.innerText);
    })
}
gameIdsFunc();

let spreadsArr = [];
function spreadFunc() {
    spreads.forEach(spread => {
        spreadsArr.push(spread.innerText);
    })
}
spreadFunc();

document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/completedGames')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let i = 0;

            gameIdsArr.forEach((id) => {
                for (const contest of data) {
                    if (id === contest.id && contest.completed === true) {
                        completedBets.append(bets[i]);
                        if (contest.scores[0].name === namesArr[i]) {
                            let targetNum = parseInt(contest.scores[0].score) + parseInt(spreadsArr[i]);
                            if (targetNum > parseInt(contest.scores[1].score)) {
                                bets[i].style.color = "#54b654";
                            } else {
                                bets[i].style.color = "#890000";
                            }
                        } else if (contest.scores[1].name === namesArr[i]) {
                            let targetNum = parseInt(contest.scores[1].score) + parseInt(spreadsArr[i]);
                            if (targetNum > parseInt(contest.scores[0].score)) {
                                bets[i].style.color = "#54b654";
                            } else {
                                bets[i].style.color = "#890000";
                            }
                        }
                    }
                }
                i++;
            })
        })
})