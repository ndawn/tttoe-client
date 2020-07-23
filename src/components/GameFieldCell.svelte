<script>
    import { onMount, createEventDispatcher } from 'svelte';
    import { get } from 'svelte/store';
    import { shape, opponentShape, turn, winner, draw, gameField } from '../store';

    export let x;
    export let y;
    export let value = '';

    const dispatch = createEventDispatcher();

    function maybeUserTurn () {
        if (value !== '' || !get(turn) || get(winner) !== null || get(draw)) {
            return;
        }

        get(gameField)[y][x].set(get(shape));

        turn.set(false);

        dispatch('userTurn', {x, y});
    }

    function opponentTurn ({ detail }) {
        if (detail.x === x && detail.y === y) {
            value = get(opponentShape);
        }
    }

    onMount(() => {
        get(gameField)[y][x].subscribe(s => {
            value = s;
        });
    });
</script>

<div class="cell" on:click={maybeUserTurn} on:opponentTurn={opponentTurn}>
    {#if ['x', 'wx', 'lx'].includes(value)}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" class="cell__shape" class:red={value === 'lx'} class:green={value === 'wx'}>
        <title>x</title>
        <path d="M83.08,64l41-41A13.5,13.5,0,0,0,105,4l-41,41L23,4A13.5,13.5,0,0,0,4,23l41,41L4,105A13.5,13.5,0,0,0,23,124.05l41-41,41,41A13.5,13.5,0,0,0,124.05,105Z"/>
    </svg>
    {:else if ['o', 'wo', 'lo'].includes(value)}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" class="cell__shape" class:red={value === 'lo'} class:green={value === 'wo'}>
            <title>o</title>
            <path d="M64,128A64,64,0,1,0,0,64a64.07,64.07,0,0,0,64,64ZM64,27A37,37,0,1,1,27,64,37,37,0,0,1,64,27Z"/>
        </svg>
    {/if}
</div>

<style>
    .cell {
        width: 100%;
        height: 100%;
        background: white;
    }

    .cell__shape {
        padding: 20%;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
    }

    .cell__shape.green path {
        fill: green;
    }

    .cell__shape.red path {
        fill: orangered;
    }
</style>
