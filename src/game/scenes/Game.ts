import {EventBus} from '../EventBus';
import {Scene} from 'phaser';
import { Tile, TileBag, shuffle } from '../logic/Tiles';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    tileBag: TileBag;
    currentHand: Tile[] = [];
    currentHandv2: Phaser.GameObjects.Container;

    constructor() {
        super('Game');
    }

    renderTile(tile: Tile): Phaser.GameObjects.Container {
        const rendering = this.add.container();

        const fontSize = 60;
        const bg = this.add.rectangle(
            fontSize * 0.4,
            fontSize / 2,
            fontSize,
            fontSize * 0.9,
            0xccfccb
        );
        rendering.add(bg);
        rendering.add(
            this.add.text(0, 0, tile.key === ' ' ? ' ' : tile.displayName, {
                fontSize: fontSize,
                color: '#261447',
            })
        );
        rendering.add(
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
        rendering.setSize(fontSize, fontSize);
        bg.setInteractive();
        bg.on('pointerover', () => {
            bg.fillColor = 0x96e6b3;
        });
        bg.on('pointerout', () => {
            bg.fillColor = 0xccfccb;
        });
        return rendering;
    }

    renderButtons() {
        const {width, height} = this.cameras.default;
        const shuffleButton = this.add.text(
            width / 2,
            height * 0.7,
            'Shuffle',
            {
                color: 'white',
            }
        );
        shuffleButton.setInteractive();
        shuffleButton.on('pointerdown', () => {
            shuffle(this.currentHand);
            this.renderHand();
        });
        shuffleButton.on('pointerover', () => {
            shuffleButton.setColor('#96e6b3');
        });
        shuffleButton.on('pointerout', () => {
            shuffleButton.setColor('white');
        });
    }

    renderHand() {
        const {width, height} = this.cameras.default;
        this.currentHandv2 = this.add.container(width / 2, height / 2);
        this.currentHand.forEach((t, idx) => {
            const rendered = this.renderTile(t);
            rendered.x = (idx - 3) * 100;
            this.currentHandv2.add(rendered);
        });
    }

    create() {
        this.camera = this.cameras.main;
        const {width, height} = this.cameras.default;
        this.add.rectangle(width / 2, height / 2, width, height, 0x1b3022);

        // scrabble stuff
        this.tileBag = new TileBag();
        this.currentHand = this.tileBag.popNRandomTiles(7);
        this.renderHand();
        this.renderButtons();

        EventBus.emit('current-scene-ready', this);
    }

    changeScene() {
        this.scene.start('GameOver');
    }
}