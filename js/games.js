// Global Game Modal Logic
window.openGameModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

window.closeGameModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset specific games if needed when closed
        if(modalId === 'game1-modal') resetGame1();
        if(modalId === 'game2-modal') resetGame2();
        if(modalId === 'game3-modal') resetGame3();
    }
}

// Global Leaderboard Logic
function updateLeaderboard(gameKey, newScore, sortAscending, label) {
    let scores = JSON.parse(localStorage.getItem(gameKey)) || [];
    scores.push(newScore);
    if (sortAscending) {
        scores.sort((a, b) => a - b);
    } else {
        scores.sort((a, b) => b - a);
    }
    scores = scores.slice(0, 3); // Top 3
    localStorage.setItem(gameKey, JSON.stringify(scores));
    
    const container = document.getElementById(`${gameKey}-leaderboard`);
    if (container) {
        let html = `<h4>最佳记录</h4><ol>`;
        scores.forEach((s, idx) => {
            let medal = idx === 0 ? '🥇' : (idx === 1 ? '🥈' : '🥉');
            html += `<li><span>${medal} 第 ${idx + 1} 名</span> <span>${s} ${label}</span></li>`;
        });
        html += `</ol>`;
        container.innerHTML = html;
    }
}

// -----------------------------------------------------
// Game 1: T-Rex Clicker (暴龙咆哮)
// -----------------------------------------------------
let g1Score = 0;
let g1Time = 10;
let g1Timer = null;
let g1Playing = false;

const g1StartBtn = document.getElementById('g1-start-btn');
const g1RestartBtn = document.getElementById('g1-restart-btn');
const g1Trex = document.getElementById('g1-trex');
const g1Result = document.getElementById('g1-result');
const g1ScoreDisplay = document.getElementById('g1-score');
const g1TimeDisplay = document.getElementById('g1-time');
const g1Area = document.getElementById('g1-area');
const g1FinalScore = document.getElementById('g1-final-score');
const g1Rank = document.getElementById('g1-rank');

function resetGame1() {
    clearInterval(g1Timer);
    g1Playing = false;
    g1Score = 0;
    g1Time = 10;
    g1ScoreDisplay.innerText = g1Score;
    g1TimeDisplay.innerText = g1Time.toFixed(1);
    g1StartBtn.style.display = 'block';
    g1Trex.style.display = 'none';
    g1Result.style.display = 'none';
    g1Trex.style.transform = 'scale(1)';
}

function startGame1() {
    resetGame1();
    g1Playing = true;
    g1StartBtn.style.display = 'none';
    g1Trex.style.display = 'block';
    
    g1Timer = setInterval(() => {
        g1Time -= 0.1;
        if(g1Time <= 0) {
            g1Time = 0;
            endGame1();
        }
        g1TimeDisplay.innerText = g1Time.toFixed(1);
    }, 100);
}

function endGame1() {
    clearInterval(g1Timer);
    g1Playing = false;
    g1Trex.style.display = 'none';
    g1Result.style.display = 'block';
    g1FinalScore.innerText = g1Score;
    updateLeaderboard('g1', g1Score, false, '次');
    
    let rank = "新手表现";
    if (g1Score > 30) rank = "稳定发挥";
    if (g1Score > 60) rank = "强劲手感";
    if (g1Score > 90) rank = "顶级表现";
    g1Rank.innerText = `表现：${rank}`;
}

g1StartBtn.addEventListener('click', startGame1);
g1RestartBtn.addEventListener('click', startGame1);

g1Trex.addEventListener('mousedown', (e) => {
    if(!g1Playing) return;
    g1Score++;
    g1ScoreDisplay.innerText = g1Score;
    
    // Growth effect
    const scale = Math.min(1 + (g1Score * 0.02), 2.5);
    g1Trex.style.transform = `scale(${scale})`;
    
    // Particle effect
    const particle = document.createElement('div');
    particle.className = 'trex-particle';
    particle.innerText = '+1';
    particle.style.left = (e.clientX - g1Area.getBoundingClientRect().left) + 'px';
    particle.style.top = (e.clientY - g1Area.getBoundingClientRect().top - 20) + 'px';
    g1Area.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 1000);
});


// -----------------------------------------------------
// Game 2: Aim Trainer (硬核特训)
// -----------------------------------------------------
let g2Score = 0;
let g2Lives = 3;
let g2Time = 30;
let g2Timer = null;
let g2TargetTimeout = null;
let g2Playing = false;
let g2Clicks = 0;
let g2Hits = 0;

const g2StartBtn = document.getElementById('g2-start-btn');
const g2RestartBtn = document.getElementById('g2-restart-btn');
const g2Result = document.getElementById('g2-result');
const g2ScoreDisplay = document.getElementById('g2-score');
const g2TimeDisplay = document.getElementById('g2-time');
const g2LivesDisplay = document.getElementById('g2-lives');
const g2Area = document.getElementById('g2-area');
const g2FinalScore = document.getElementById('g2-final-score');
const g2Accuracy = document.getElementById('g2-accuracy');

function getHearts(lives) {
    return '❤'.repeat(lives) + '♡'.repeat(3 - lives);
}

function resetGame2() {
    clearInterval(g2Timer);
    clearTimeout(g2TargetTimeout);
    removeTargets();
    g2Playing = false;
    g2Score = 0;
    g2Lives = 3;
    g2Time = 30;
    g2Clicks = 0;
    g2Hits = 0;
    g2ScoreDisplay.innerText = g2Score;
    g2TimeDisplay.innerText = g2Time;
    g2LivesDisplay.innerText = getHearts(g2Lives);
    g2StartBtn.style.display = 'block';
    g2Result.style.display = 'none';
}

function removeTargets() {
    const targets = g2Area.querySelectorAll('.target-circle');
    targets.forEach(t => t.remove());
}

function spawnTarget() {
    if(!g2Playing) return;
    removeTargets(); // ensure only 1 target at a time
    
    const target = document.createElement('div');
    target.className = 'target-circle';
    
    // random size between 30 and 60
    const size = Math.floor(Math.random() * 30) + 30;
    target.style.width = size + 'px';
    target.style.height = size + 'px';
    
    const areaRect = g2Area.getBoundingClientRect();
    const maxX = areaRect.width - size;
    const maxY = areaRect.height - size;
    
    const x = Math.floor(Math.random() * maxX) + size/2;
    const y = Math.floor(Math.random() * maxY) + size/2;
    
    target.style.left = x + 'px';
    target.style.top = y + 'px';
    
    target.addEventListener('mousedown', (e) => {
        if(!g2Playing) return;
        e.stopPropagation(); // prevent area click
        g2Score += Math.floor(100 / size * 10); // smaller target = more points
        g2Hits++;
        g2Clicks++;
        g2ScoreDisplay.innerText = g2Score;
        target.remove();
        clearTimeout(g2TargetTimeout);
        g2TargetTimeout = setTimeout(spawnTarget, 200); // spawn next quickly
    });
    
    g2Area.appendChild(target);
    
    // target disappears after some time based on current score
    const duration = Math.max(500, 1500 - (g2Score * 2));
    g2TargetTimeout = setTimeout(() => {
        if(g2Playing) {
            target.remove();
            g2Lives--;
            g2LivesDisplay.innerText = getHearts(g2Lives);
            if(g2Lives <= 0) {
                endGame2();
            } else {
                spawnTarget();
            }
        }
    }, duration);
}

g2Area.addEventListener('mousedown', (e) => {
    if(g2Playing && e.target === g2Area) {
        g2Clicks++;
        g2Lives--;
        g2LivesDisplay.innerText = getHearts(g2Lives);
        if(g2Lives <= 0) {
            endGame2();
        }
    }
});

function startGame2() {
    resetGame2();
    g2Playing = true;
    g2StartBtn.style.display = 'none';
    
    g2Timer = setInterval(() => {
        g2Time--;
        g2TimeDisplay.innerText = g2Time;
        if(g2Time <= 0) {
            endGame2();
        }
    }, 1000);
    
    spawnTarget();
}

function endGame2() {
    g2Playing = false;
    clearInterval(g2Timer);
    clearTimeout(g2TargetTimeout);
    removeTargets();
    
    g2Result.style.display = 'block';
    g2FinalScore.innerText = g2Score;
    updateLeaderboard('g2', g2Score, false, '分');
    
    let acc = g2Clicks > 0 ? Math.round((g2Hits / g2Clicks) * 100) : 0;
    g2Accuracy.innerText = `命中率: ${acc}%`;
}

g2StartBtn.addEventListener('click', startGame2);
g2RestartBtn.addEventListener('click', startGame2);


// -----------------------------------------------------
// Game 3: Memory Match (提瓦特记忆)
// -----------------------------------------------------
const g3Board = document.getElementById('g3-board');
const g3StartBtn = document.getElementById('g3-start-btn');
const g3RestartBtn = document.getElementById('g3-restart-btn');
const g3Result = document.getElementById('g3-result');
const g3MovesDisplay = document.getElementById('g3-moves');
const g3MatchesDisplay = document.getElementById('g3-matches');
const g3FinalMoves = document.getElementById('g3-final-moves');

const icons = [
    'fa-fire', 'fa-fire',
    'fa-leaf', 'fa-leaf',
    'fa-bolt', 'fa-bolt',
    'fa-snowflake', 'fa-snowflake',
    'fa-wind', 'fa-wind',
    'fa-mountain', 'fa-mountain',
    'fa-water', 'fa-water',
    'fa-moon', 'fa-moon'
];

let g3Cards = [];
let g3Moves = 0;
let g3Matches = 0;
let g3FlippedCards = [];
let g3Locked = false;

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function resetGame3() {
    g3Board.innerHTML = '';
    g3Moves = 0;
    g3Matches = 0;
    g3FlippedCards = [];
    g3Locked = false;
    g3MovesDisplay.innerText = g3Moves;
    g3MatchesDisplay.innerText = g3Matches;
    g3StartBtn.style.display = 'block';
    g3Board.style.display = 'none';
    g3Result.style.display = 'none';
}

function startGame3() {
    resetGame3();
    g3StartBtn.style.display = 'none';
    g3Board.style.display = 'grid';
    
    const shuffledIcons = shuffle([...icons]);
    
    shuffledIcons.forEach((icon, index) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.icon = icon;
        card.dataset.index = index;
        
        card.innerHTML = `
            <div class="memory-card-inner">
                <div class="memory-card-front"><i class="fa-solid fa-question"></i></div>
                <div class="memory-card-back"><i class="fa-solid ${icon}"></i></div>
            </div>
        `;
        
        card.addEventListener('click', () => flipCard(card));
        g3Board.appendChild(card);
    });
}

function flipCard(card) {
    if (g3Locked) return;
    if (card === g3FlippedCards[0]) return;
    if (card.classList.contains('matched')) return;

    card.classList.add('flipped');
    g3FlippedCards.push(card);

    if (g3FlippedCards.length === 2) {
        g3Moves++;
        g3MovesDisplay.innerText = g3Moves;
        checkForMatch();
    }
}

function checkForMatch() {
    const card1 = g3FlippedCards[0];
    const card2 = g3FlippedCards[1];
    
    let isMatch = card1.dataset.icon === card2.dataset.icon;

    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    g3FlippedCards[0].classList.add('matched');
    g3FlippedCards[1].classList.add('matched');
    
    g3Matches++;
    g3MatchesDisplay.innerText = g3Matches;
    g3FlippedCards = [];
    
    if (g3Matches === 8) {
        setTimeout(endGame3, 500);
    }
}

function unflipCards() {
    g3Locked = true;
    setTimeout(() => {
        g3FlippedCards[0].classList.remove('flipped');
        g3FlippedCards[1].classList.remove('flipped');
        g3FlippedCards = [];
        g3Locked = false;
    }, 800);
}

function endGame3() {
    g3Board.style.display = 'none';
    g3Result.style.display = 'block';
    g3FinalMoves.innerText = g3Moves;
    updateLeaderboard('g3', g3Moves, true, '步');
}

g3StartBtn.addEventListener('click', startGame3);
g3RestartBtn.addEventListener('click', startGame3);
