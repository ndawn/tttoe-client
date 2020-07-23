<script>
    import { onMount, createEventDispatcher } from 'svelte';
    import { get } from 'svelte/store';
    import GameFieldCell from './GameFieldCell.svelte';
    import { ws, gameUUID, shape, turn, winner, draw, gameField } from '../store';
    import { checkIfWinningTurn, checkIfDraw } from '../checkFunctions';

    const dispatch = createEventDispatcher();

    let commenceCountdown = 3;
    const titles = {
        commencing: 'Игра начинается!',
        turnTrue: 'Ваш ход',
        turnFalse: 'Ход оппонента',
        gameWon: 'Победа!',
        gameLost: 'Поражение',
        draw: 'Ничья'
    };
    let currentTitle = titles.commencing;
    let won = null;
    let gameDraw = false;

    function userTurn ({ detail }) {
        checkIfWinningTurn(detail.x, detail.y, get(shape), (isWinningTurn, winningCells) => {
            if (isWinningTurn) {
                for (let cell of winningCells) {
                    get(gameField)[cell.y][cell.x].set('w' + get(shape));
                }

                winner.set(true);
            } else {
                draw.set(checkIfDraw());
            }
        });

        get(ws).send(JSON.stringify({
            event: 'turn',
            uuid: get(gameUUID),
            x: detail.x,
            y: detail.y
        }));
    }

    onMount(() => {
        let interval = setInterval(() => {
            commenceCountdown -= 1;

            if (commenceCountdown <= 0) {
                turn.subscribe(t => {
                    currentTitle = t ? titles.turnTrue : titles.turnFalse;
                });

                clearInterval(interval);
            }
        }, 1000);

        winner.subscribe(w => {
            won = w;

            if (w) {
                currentTitle = titles.gameWon;
            } else if (w === false) {
                currentTitle = titles.gameLost;
            } else {
                currentTitle = titles.commencing;
            }
        });

        draw.subscribe(d => {
            gameDraw = d;

            if (d && won === null) {
                currentTitle = titles.draw;
            }
        })
    })
</script>

<div class="game">
    <h1 class="game__title" class:green={won} class:red={won === false} class:blue={gameDraw && won === null}>{currentTitle}</h1>
    <div class="game__grid">
        <div class="game__commence-overlay" class:hidden={commenceCountdown === 0}>
            <h1 class="game__commence-overlay-text">{commenceCountdown}</h1>
        </div>
        {#each get(gameField) as row, y}
            {#each get(gameField)[y] as shape, x}
                <GameFieldCell x={x} y={y} on:userTurn={userTurn} />
            {/each}
        {/each}
    </div>
</div>

<style>
    .hidden {
        display: none;
    }

    .green {
        color: green;
    }

    .red {
        color: orangered;
    }

    .blue {
        color: dodgerblue;
    }

    .game {
        display: flex;
        width: 100%;
        height: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .game__grid {
        display: grid;
        position: relative;
        width: 100%;
        grid-template-columns: 33% 33% 33%;
        grid-template-rows: 150px 150px 150px;
        gap: 2px;
        overflow: hidden;
        border-radius: 64px;
        box-shadow: 0 4px 64px 2px lightgray;
        background-color: #eee;
    }

    .game__commence-overlay {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 64px;
        background-color: rgba(0, 0, 0, 0.4);
    }

    .game__commence-overlay-text {
        margin: 0;
        font-size: 8em;
        line-height: 450px;
    }
</style>
