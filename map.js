let mapDiv = document.getElementById('map');
let renderTime = document.getElementById('render-time');
let foodDiv = document.getElementsByClassName('food')[0];
let mapSize = document.getElementById('map-size');
let antsPopulations = document.getElementById('populations');

class Map {
    constructor(width = 10, height = 10, population = 30) {
        this.width = width;
        this.height = height;
        this.population = population;
        this.foodLeft = 100;
        this.cells = [];
        this.ants = [];
        this.interval;

        mapDiv.style.width = this.width * 20 + 'px';
        mapDiv.style.height = this.height * 20 + 'px';

        this.initCells();
        this.initFood();
        this.initAnts();
        this.render();
    }

    initCells() {
        for (let i = 0; i < this.width; i++) {
            this.cells[i] = [];
            for (let j = 0; j < this.height; j++) {
                if (i === 0 && j === 0) {
                    this.cells[i][j] = new Cell(i, j, 'BASE');
                } else {
                    this.cells[i][j] = new Cell(i, j);
                }
            }
        }
    }

    initFood() {
        let x = Math.floor(Math.random() * this.width);
        let y = Math.floor(Math.random() * this.height);

        if (x === 0 && y === 0) {
            this.initFood();
        } else {
            this.cells[x][y] = new Cell(x, y, 'FOOD');
        }
    }

    initAnts() {
        for (let i = 0; i < this.population; i++) {
            this.ants.push(new Ant(this, 0, 0));
        }
    }

    render() {
        mapDiv.innerHTML = '';
        foodDiv.innerHTML = this.foodLeft;
        this.cells.forEach(line => {
            line.forEach(cell => {
                mapDiv.appendChild(this.createCell(cell));
            });
        });
    }

    renderInterval() {
        this.pauseInterval();
        this.interval = setInterval(() => {
            this.nextStep();
        }, renderTime.value);

    }

    pauseInterval() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    nextStep() {
        this.ants.forEach(ant => {
            if (this.foodLeft === 0 && ant.state === 'EMPTY') {
                this.cells[ant.position.x][ant.position.y].ants.splice(this.cells[ant.position.x][ant.position.y].ants.indexOf(ant), 1);
            } else {
                let newPos = this.nextPosition(ant);
                ant.setPosition(newPos.x, newPos.y);
            }
        });
        this.render();
    }

    nextPosition(ant) {
        let availableCells = ant.availableCells();

        if (Math.random() > (1 - ant.exploration) / (1 - ant.trust)) {
            return this.randomPosition(availableCells);
        }

        return this.bestPosition(availableCells, ant.state);
    }

    randomPosition(cells) {
        let random = Math.floor(Math.random() * cells.length);
        return { x: cells[random].x, y: cells[random].y };
    }

    bestPosition(cells, state) {
        let type = state == 'FULL' ? 'v2' : 'v1';
        let best = 0;
        let i;
        cells.forEach((cell, index) => {
            if (cell[type] >= best) {
                best = cell[type];
                i = index;
            }
        });
        if (best === 0) {
            return this.randomPosition(cells);
        }
        return { x: cells[i].x, y: cells[i].y };
    }

    createAnt(ant) {
        let span = document.createElement('span');
        span.className = 'ant';
        if (ant.state === 'FULL') {
            span.className += ' full';
        }
        return span;
    }

    createCell(cell) {
        let div = document.createElement('div');

        switch (cell.type) {
            case 'BASE':
            case 'OBSTACLE':
            case 'FOOD':
                div.className = `cell ${cell.type.toLowerCase()}`;
                break;
            default:
                div.className = 'cell';
        }

        if (cell.type === 'EMPTY' && (cell.v1 > 0 || cell.v2 > 0)) {
            div.className += ' pheromone';
            if (cell.v1 > 0 && cell.v1 > cell.v2) {
                div.style.backgroundColor = `rgba(60, 147, 221, ${cell.v1})`;
            }
            if (cell.v2 > 0 && cell.v2 > cell.v1) {
                div.style.backgroundColor = `rgba(247, 169, 184, ${cell.v2})`;
            }
        }

        if (cell.ants.length > 0) {
            cell.ants.forEach(ant => {
                div.appendChild(this.createAnt(ant));
            });
        }

        return div;
    }
}

class Cell {
    constructor(x, y, type = 'RANDOM') {
        this.x = x;
        this.y = y;
        this.type = (type == 'RANDOM') ? this.randomType() : type;
        this.v1 = 0;
        this.v2 = 0;
        this.ants = [];

        if (this.type === 'FOOD') {
            this.setV1(1);
        }
        if (this.type === 'BASE') {
            this.setV2(1);
        }
    }

    getAroundValues(type) {
        let values = [];

        if (this.x !== 0) {
            values.push(map.cells[this.x-1][this.y][type]);
        }
        if (this.x !== map.width - 1) {
            values.push(map.cells[this.x+1][this.y][type]);
        }
        if (this.y !== 0) {
            values.push(map.cells[this.x][this.y-1][type]);
        }
        if (this.y !== map.height - 1) {
            values.push(map.cells[this.x][this.y+1][type]);
        }

        return values;
    }

    maxAround(type) {
        let values = this.getAroundValues(type);
        let max = Math.max(...values);

        return max;
    }

    avgAround(type) {
        let values = this.getAroundValues(type);
        let sum = values.reduce((a, b) => {
            return a + b;
        }, 0);
        let avg = sum/values.length;

        return avg;
    }

    setV1(v1) {
        if (this.type === 'FOOD') {
            this.v1 = 1;
        } else {
            this.v1 = v1;
        }
    }

    setV2(v2) {
        if (this.x === 0 && this.y === 0) {
            this.v2 = 1;
        } else {
            this.v2 = v2;
        }
    }

    randomNumber() {
        return Math.floor(Math.random() * 10);
    }

    randomType() {
        if (this.randomNumber() > 8) {
            return 'OBSTACLE';
        }
        return 'EMPTY';
    }
}

function restart() {
    map.pauseInterval();
    map = new Map(mapSize.value, mapSize.value, antsPopulations.value);
}

let map = new Map(mapSize.value, mapSize.value, antsPopulations.value);
