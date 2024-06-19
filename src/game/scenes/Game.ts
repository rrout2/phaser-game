import {EventBus} from '../EventBus';
import {Scene} from 'phaser';
import { Tile, TileBag, shuffle } from '../logic/Tiles';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    tileBag: TileBag;
    handTiles: Tile[] = [];
    handContainer: Phaser.GameObjects.Container;
    remainingContainer: Phaser.GameObjects.Container;
    wordsLeft = 4;
    discardsLeft = 4;

    constructor() {
        super('Game');
    }

    renderTile(tile: Tile): Phaser.GameObjects.Container {
        const tileContainer = this.add.container();

        const fontSize = 60;
        const bg = this.add.rectangle(
            fontSize * 0.4,
            fontSize / 2,
            fontSize,
            fontSize * 0.9,
            0xccfccb
        );
        tileContainer.add(bg);
        tileContainer.add(
            this.add.text(0, 0, tile.key === ' ' ? ' ' : tile.displayName, {
                fontSize: fontSize,
                color: '#261447',
            })
        );
        tileContainer.add(
            this.add.text(
                fontSize * 0.6,
                fontSize * 0.7,
                tile.pointValue.toString(),
                {
                    fontSize: fontSize * 0.25,
                    color: '#261447',
                }
            )
        );
        tileContainer.setSize(fontSize, fontSize);
        bg.setInteractive();
        bg.on('pointerover', () => {
            bg.fillColor = 0x96e6b3;
        });
        bg.on('pointerout', () => {
            bg.fillColor = 0xccfccb;
        });
        return tileContainer;
    }

    renderButtons() {
        const {width, height} = this.cameras.default;
        const shuffleButton = this.add.text(
            0,
            150,
            'Shuffle',
            {
                color: 'white',
            }
        );
        shuffleButton.setInteractive();
        shuffleButton.on('pointerdown', () => {
            shuffle(this.handTiles);
            this.renderHand();
        });
        shuffleButton.on('pointerover', () => {
            shuffleButton.setColor('#96e6b3');
        });
        shuffleButton.on('pointerout', () => {
            shuffleButton.setColor('white');
        });
    }

    renderRemainingContainer() {
        this.remainingContainer = this.add.container(20, 500);
        const tilesLeft = this.add.text(0, 0, `Tiles left: ${this.tileBag.getNumRemainingTiles()}`);

        const attemptsLeft = this.add.text(0, 30, `Attempts left: ${this.wordsLeft}`)

        const discardsLeft = this.add.text(0, 60, `Discards left: ${this.discardsLeft}`);

        this.remainingContainer.add([tilesLeft, attemptsLeft, discardsLeft])
    }

    renderHand() {
        const {width, height} = this.cameras.default;

        this.handContainer = this.add.container(width / 2, height / 2);
        this.handContainer.removeAll(true);

        this.handTiles.forEach((t, idx) => {
            const rendered = this.renderTile(t);
            rendered.x = (idx - 3) * 100;
            this.handContainer!.add(rendered);
        });
    }

    create() {
        this.camera = this.cameras.main;
        const {width, height} = this.cameras.default;
        this.add.rectangle(width / 2, height / 2, width, height, 0x1b3022);

        // scrabble stuff
        this.tileBag = new TileBag();
        this.handTiles = this.tileBag.popNRandomTiles(7);
        this.renderHand();
        this.renderButtons();
        this.renderRemainingContainer();

        EventBus.emit('current-scene-ready', this);
    }

    changeScene() {
        this.scene.start('GameOver');
    }
}
