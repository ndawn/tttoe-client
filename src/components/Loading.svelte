<script>
    import { onMount } from 'svelte';

    export let error;

    onMount(() => {
        if (error) {
            setTimeout(() => {
                error = undefined;
            }, 3000);
        }
    });
</script>

<div class="loading">
    {#if error}<h6 class="error">{error}</h6>{/if}
    <div class="loading__spinner"></div>
    <h3 class="loading__text">Поиск оппонента...</h3>
</div>

<style>
    .loading {
        display: flex;
        width: 100%;
        height: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .loading__spinner {
        margin: 100px auto;
        width: 40px;
        height: 40px;
        border-radius: 100%;

        background-color: #333;
        -webkit-animation: circle-radar 1.0s infinite ease-in-out;
        animation: circle-radar 1.0s infinite ease-in-out;
    }

    @keyframes circle-radar {
        0% {
            transform: scale(0);
        }
        100% {
            transform: scale(1.0);
            opacity: 0;
        }
    }

    .loading__text {

    }

    .error {
        color: orangered;
    }
</style>
