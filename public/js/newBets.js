// Shouldn't exist?

// const newBets = document.querySelector('.newBets');
// const completedBets = document.querySelector('.completedBets');
// const homeScore = '';
// const awayScore = '';
// const teamNames = [];
// const api_key = 'e603050424de0c31810f91e691efa21d';

// for (let i = 1; i < localStorage.length; i++) {
//     const newBet = document.createElement('li');
//     newBets.append(newBet);
//     let savedBet = localStorage.getItem(i);
//     let savedBetParse = JSON.parse(savedBet);
//     newBet.innerText = savedBetParse.teamName + savedBetParse.betAmount + savedBetParse.points + savedBetParse.price + savedBetParse.betID;

//     teamNames.push(savedBetParse.teamName);


//     const getGame = async () => {
//         const res = await fetch(`https://api.the-odds-api.com/v4/sports/americanfootball_nfl/scores/?apiKey=${api_key}&eventIds=${savedBetParse.betID}&daysFrom=3`);
//         const data = await res.json();
//         console.log(data);
//         if (data.length > 0) {

//             if (data[0].completed === true) {
//                 const getData = async () => {
//                     if (savedBetParse.teamName == data[0].scores[0].name) {
//                         const adjustedScore = parseInt(data[0].scores[0].score) + parseInt(savedBetParse.points);
//                         if (adjustedScore > data[0].scores[1].score) {
//                             console.log('You won the bet')
//                             // add money to account
//                         } else {
//                             console.log('You lost the bet')
//                         }
//                     } else {
//                         const adjustedScore = parseInt(data[0].scores[1].score) + parseInt(savedBetParse.points);
//                         if (adjustedScore > data[0].scores[0].score) {
//                             console.log('You won the bet')
//                             // add money to account
//                         } else {
//                             console.log('You lost the bet')
//                         }
//                     }
//                     completedBets.append(newBet);
//                 }
//                 getData();

//             } else {
//                 console.log('Game has not been completed');
//             }

//         } else {
//             console.log('Game data expired')
//             completedBets.append(newBet);
//         }
//     }

//     getGame();
// }

// console.log(teamNames);