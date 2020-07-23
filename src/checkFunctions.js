import { gameField } from './store';
import { get } from 'svelte/store';


export function checkIfWinningTurn (x, y, s, cb) {
    let potentialCells = [];

    for (let ix = 0; ix < 3; ix++) {
        if (get(get(gameField)[y][ix]) === s) {
            potentialCells.push({x: ix, y});
        }
    }

    if (potentialCells.length === 3) {
        cb(true, potentialCells);
    } else {
        potentialCells = [];
    }

    for (let iy = 0; iy < 3; iy++) {
        if (get(get(gameField)[iy][x]) === s) {
            potentialCells.push({x, y: iy});
        }
    }

    if (potentialCells.length === 3) {
        cb(true, potentialCells);
    } else {
        potentialCells = [];
    }

    for (let i = 0; i < 3; i++) {
        if (get(get(gameField)[i][i]) === s) {
            potentialCells.push({x: i, y: i});
        }
    }

    if (potentialCells.length === 3) {
        cb(true, potentialCells);
    } else {
        potentialCells = [];
    }

    for (let i = 0; i < 3; i++) {
        if (get(get(gameField)[i][3 - (i + 1)]) === s) {
            potentialCells.push({x: i, y: 3 - (i + 1)});
        }
    }

    if (potentialCells.length === 3) {
        cb(true, potentialCells);
    } else {
        cb(false, potentialCells);
    }
}


export function checkIfDraw () {
    for (let row of get(gameField)) {
        for (let cell of row) {
            if (get(cell) === '') {
                return false;
            }
        }
    }

    return true;
}
