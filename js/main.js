// Main entry point

let game;

document.addEventListener('DOMContentLoaded', () => {
    // Get canvas element
    const canvas = document.getElementById('game-canvas');

    // Initialize game
    game = new Game(canvas);
    game.start();

    // Update start button text if there's saved progress
    const startBtn = document.getElementById('start-btn');
    if (game.currentLevel > 1) {
        startBtn.textContent = 'Continue (Level ' + game.currentLevel + ')';
    }

    // Start button handler
    document.getElementById('start-btn').addEventListener('click', () => {
        Audio.playClick();
        game.startLevel(game.currentLevel);
    });

    // Next level button handler
    document.getElementById('next-level-btn').addEventListener('click', () => {
        Audio.playClick();
        game.startLevel(game.currentLevel + 1);
    });

    // Options button handler
    document.getElementById('options-btn').addEventListener('click', () => {
        Audio.playClick();
        document.getElementById('options-total-score').textContent = game.totalScore;
        document.getElementById('options-current-level').textContent = game.currentLevel;
        document.getElementById('options-modal').classList.remove('hidden');
    });

    // Close options handler
    document.getElementById('close-options-btn').addEventListener('click', () => {
        Audio.playClick();
        document.getElementById('options-modal').classList.add('hidden');
    });

    // Clear progress handler
    document.getElementById('clear-progress-btn').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all progress? This cannot be undone.')) {
            Audio.playClick();
            game.clearProgress();
            document.getElementById('options-total-score').textContent = 0;
            document.getElementById('options-current-level').textContent = 1;
            document.getElementById('options-modal').classList.add('hidden');
            document.getElementById('start-screen').classList.remove('hidden');
            document.getElementById('start-btn').textContent = 'Start Shopping';
        }
    });

    // Prevent default touch behaviors
    document.body.addEventListener('touchmove', (e) => {
        if (e.target.closest('#game-container')) {
            e.preventDefault();
        }
    }, { passive: false });

    // Handle orientation change
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            game.resize();
        }, 100);
    });

    // Log ready
    console.log('Hidden Object Supermarket loaded!');
});
