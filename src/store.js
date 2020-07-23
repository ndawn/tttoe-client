import { readable, writable } from 'svelte/store'

export const ws = writable(null);
export const gameUUID = writable('');
export const shape = writable('');
export const opponentShape = writable('');
export const turn = writable(null);
export const winner = writable(null);
export const draw = writable(false);
export const gameField = readable([
    [writable(''), writable(''), writable('')],
    [writable(''), writable(''), writable('')],
    [writable(''), writable(''), writable('')]
], set => {});
