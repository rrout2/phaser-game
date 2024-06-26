export class Tile {
    key: string;
    displayName: string;
    pointValue: number;
    constructor(key: string, displayName: string, pointValue: number) {
        this.key = key;
        this.displayName = displayName;
        this.pointValue = pointValue;
    }
}

export class TileBag {
    keyList: string[] = [];
    tileSet: Map<string, Tile> = new Map();
    tileCounts: Map<string, number> = new Map();

    getTile(key: string) {
        return this.tileSet.get(key);
    }

    addTile(tile: Tile, count = 1) {
        const {key} = tile;
        if (!this.tileCounts.has(key)) {
            this.tileCounts.set(key, 0);
        }
        this.tileSet.set(key, tile);
        this.incrementTile(tile, count);
    }

    incrementTile(tile: Tile | string, step = 1) {
        let key = '';
        if (typeof tile === 'string') {
            key = tile;
        } else {
            key = tile.key;
        }
        const ct = this.tileCounts.get(key);
        if (ct === undefined) {
            throw new Error(`Cannot increment tile with key = '${key}'`);
        }
        this.tileCounts.set(key, ct + step);
        for (let i = 0; i < step; i++) {
            this.keyList.push(key);
        }
    }

    shuffle() {
        this.keyList = shuffle(this.keyList);
    }

    popRandomTile() {
        this.shuffle();
        const key = this.keyList.pop();
        if (!key) {
            throw new Error('Cannot pop tile with no tiles.');
        }
        this.incrementTile(key, -1);
        return this.getTile(key)!;
    }

    popNRandomTiles(n: number) {
        this.shuffle();
        const tiles = this.keyList.splice(0, n);
        return tiles.map(t => {
            this.incrementTile(t, -1);
            return this.getTile(t)!;
        });
    }

    getNumRemainingTiles() {
        return this.keyList.length;
    }

    constructor() {
        const scrabbleTiles: Tile[] = [
            new Tile('A', 'A', 1),
            new Tile('B', 'B', 3),
            new Tile('C', 'C', 3),
            new Tile('D', 'D', 2),
            new Tile('E', 'E', 1),
            new Tile('F', 'F', 4),
            new Tile('G', 'G', 2),
            new Tile('H', 'H', 4),
            new Tile('I', 'I', 1),
            new Tile('J', 'J', 8),
            new Tile('K', 'K', 5),
            new Tile('L', 'L', 1),
            new Tile('M', 'M', 3),
            new Tile('N', 'N', 1),
            new Tile('O', 'O', 1),
            new Tile('P', 'P', 3),
            new Tile('Q', 'Q', 10),
            new Tile('R', 'R', 1),
            new Tile('S', 'S', 1),
            new Tile('T', 'T', 1),
            new Tile('U', 'U', 1),
            new Tile('V', 'V', 4),
            new Tile('W', 'W', 4),
            new Tile('X', 'X', 8),
            new Tile('Y', 'Y', 4),
            new Tile('Z', 'Z', 10),
            new Tile(' ', 'Blank', 0), // Blank tile
        ];
        const tileCounts: {[key: string]: number} = {
            A: 9,
            B: 2,
            C: 2,
            D: 4,
            E: 12,
            F: 2,
            G: 3,
            H: 2,
            I: 9,
            J: 1,
            K: 1,
            L: 4,
            M: 2,
            N: 6,
            O: 8,
            P: 2,
            Q: 1,
            R: 6,
            S: 4,
            T: 6,
            U: 4,
            V: 2,
            W: 2,
            X: 1,
            Y: 2,
            Z: 1,
            ' ': 2, // Blank tiles
        };
        scrabbleTiles.forEach(tile => {
            this.addTile(tile, tileCounts[tile.key]);
        });
    }
}

export function shuffle<T>(array: T[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}