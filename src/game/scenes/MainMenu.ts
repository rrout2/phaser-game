import {GameObjects, Scene} from 'phaser';

import {EventBus} from '../EventBus';

export class MainMenu extends Scene {
    background: GameObjects.GameObject;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;

    constructor() {
        super('MainMenu');
    }

    create() {
        const {width, height} = this.cameras.default;
        this.background = this.add.rectangle(
            width / 2,
            height / 2,
            width,
            height,
            0x261447
        );

        this.logo = this.add.image(512, 100, 'logo').setDepth(100);

        this.title = this.add
            .text(512, 300, 'Untitled Deckbuilding Roguelike Word Game', {
                fontFamily: 'Calibri',
                fontSize: 38,
                color: '#F1FFFA',
                align: 'center',
            })
            .setOrigin(0.5)
            .setDepth(100);

        EventBus.emit('current-scene-ready', this);
    }

    changeScene() {
        if (this.logoTween) {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start('Game');
    }

    moveLogo(vueCallback: ({x, y}: {x: number; y: number}) => void) {
        if (this.logoTween) {
            if (this.logoTween.isPlaying()) {
                this.logoTween.pause();
            } else {
                this.logoTween.play();
            }
        } else {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: {value: 750, duration: 3000, ease: 'Back.easeInOut'},
                y: {value: 80, duration: 1500, ease: 'Sine.easeOut'},
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (vueCallback) {
                        vueCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y),
                        });
                    }
                },
            });
        }
    }
}
