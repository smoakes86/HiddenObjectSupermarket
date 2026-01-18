import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import StartScene from './scenes/StartScene.js';
import GameScene from './scenes/GameScene.js';
import LevelCompleteScene from './scenes/LevelCompleteScene.js';

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 420,
    height: 720,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: { width: 320, height: 480 },
        max: { width: 420, height: 900 }
    },
    backgroundColor: '#FFF8E7',
    scene: [BootScene, StartScene, GameScene, LevelCompleteScene],
    render: {
        pixelArt: false,
        antialias: true
    }
};

const game = new Phaser.Game(config);

// Expose game events for DOM integration
window.gameEvents = game.events;
