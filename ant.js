let explorationInput = document.getElementById('exploration');
let evaporationInput = document.getElementById('evaporation');
let trustInput = document.getElementById('trust');
let noiseInput = document.getElementById('noise');

class Ant {
    constructor(map, x = 0, y = 0, state = 'EMPTY') {
        this.map = map;
        this.position = {x, y};
        this.exploration = explorationInput.value;
        this.trust = trustInput.value;
        this.evaporation = evaporationInput.value;
        this.noise = noiseInput.value;
        this.trips = 0;
        this.state = state;

        this.placeAnt();
    }

    placeAnt() {
        this.map.cells[this.position.x][this.position.y].ants.push(this);
    }

    availableCells() {
        let cells = [];

        if (this.position.x !== 0) {
            if (this.map.cells[this.position.x-1][this.position.y].type !== 'OBSTACLE') {
                cells.push(this.map.cells[this.position.x-1][this.position.y]);
            }
        }
        if (this.position.x !== this.map.width - 1) {
            if (this.map.cells[this.position.x+1][this.position.y].type !== 'OBSTACLE') {
                cells.push(this.map.cells[this.position.x+1][this.position.y]);
            }
        }
        if (this.position.y !== 0) {
            if (this.map.cells[this.position.x][this.position.y-1].type !== 'OBSTACLE') {
                cells.push(this.map.cells[this.position.x][this.position.y-1]);
            }
        }
        if (this.position.y !== this.map.height - 1) {
            if (this.map.cells[this.position.x][this.position.y+1].type !== 'OBSTACLE') {
                cells.push(this.map.cells[this.position.x][this.position.y+1]);
            }
        }

        return cells;
    }

    setPheromone(x, y) {
        if (this.state === 'EMPTY') {
            let v1 = this.evaporation * (this.noise * this.map.cells[x][y].maxAround('v1') + (1 - this.noise) * this.map.cells[x][y].avgAround('v1'));
            // console.log(`V1 x:${x}, y:${y} =`, v1);
            this.map.cells[x][y].setV1(v1);
        } else if (this.state === 'FULL') {
            let v2 = this.evaporation * (this.noise * this.map.cells[x][y].maxAround('v2') + (1 - this.noise) * this.map.cells[x][y].avgAround('v2'));
            // console.log(`V2 x:${x}, y:${y} =`, v2);
            this.map.cells[x][y].setV2(v2);
        }
    }

    setPosition(x, y) {
        this.map.cells[this.position.x][this.position.y].ants.splice(this.map.cells[this.position.x][this.position.y].ants.indexOf(this), 1);

        if (this.map.cells[x][y].type === 'FOOD' && this.state === 'EMPTY') {
            this.state = 'FULL';
            this.map.foodLeft -= 1;
        }
        if (this.map.cells[x][y].type === 'BASE' && this.state === 'FULL') {
            this.state = 'EMPTY';
            this.trips += 1;
        }

        if (this.trips <= 3) {
            this.map.cells[x][y].ants.push(this);
            this.position = { x, y };
            this.setPheromone(x, y);
        }
    }
}
