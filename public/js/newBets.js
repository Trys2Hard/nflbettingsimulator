const newBets = document.querySelector('.newBets');

for(let i = 0; i < localStorage.length; i++) {
    const newBet = document.createElement('li');
    newBets.append(newBet);

    let savedBet = localStorage.getItem(i + 1);
    let savedBetParse = JSON.parse(savedBet);
    newBet.innerText = savedBetParse.teamName + savedBetParse.betAmount + savedBetParse.spread;
}