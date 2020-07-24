<script>
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import Loading from './components/Loading.svelte';
	import GameField from './components/GameField.svelte';
	import { ws, gameUUID, shape, opponentShape, turn, winner, draw, gameField } from './store';
	import { checkIfWinningTurn, checkIfDraw } from './checkFunctions';

	export let wsUrl;
	let error;
	let currentComponent = Loading;

	function processMessage (data) {
		const message = JSON.parse(data);

		if (message.event === 'error') {
			error = message.message;
		} else if (message.event === 'commencing') {
			currentComponent = GameField;

			gameUUID.set(message.uuid);
			shape.set(message.shape);
			opponentShape.set(message.shape === 'x' ? 'o' : 'x');
			turn.set(message.turn);
		} else if (message.event === 'turn') {
			get(gameField)[message.y][message.x].set(get(opponentShape));
			turn.set(true);
			winner.set(message.winner);
			checkIfWinningTurn(message.x, message.y, get(opponentShape), (isWinningTurn, winningCells) => {
				if (isWinningTurn) {
					for (let cell of winningCells) {
						get(gameField)[cell.y][cell.x].set('l' + get(opponentShape));
					}

					winner.set(false);
				} else {
					draw.set(checkIfDraw());
				}
			});
		}
	}

	function clearField () {
		for (let row of get(gameField)) {
			for (let cell of row) {
				cell.set('');
			}
		}

		gameUUID.set('');
		shape.set('');
		opponentShape.set('');
		turn.set(null);
		winner.set(null);
	}

	function onClose (event) {
		currentComponent = Loading;

		clearField();
		startWebSocketConnection();
	}

	function startWebSocketConnection () {
		ws.update(value => {
			const socket = new WebSocket(wsUrl);

			socket.onmessage = (event) => {
				processMessage(event.data);
			};

			socket.onerror = socket.onclose = onClose;

			return socket;
		});
	}

	onMount(() => {
		startWebSocketConnection();

		window.onbeforeunload = (event) => {
			get(ws).send(JSON.stringify({event: 'unpaired'}));
		};
	});
</script>

<main>
	<svelte:component this={currentComponent} />
</main>

<style>
	:global(html), :global(body) {
		position: relative;
		width: 100%;
		height: 100%;
	}

	:global(body) {
		margin: 0;
		font-family: -apple-system, 'Segoe UI Regular', sans-serif;
		color: #333;
	}

	main {
		margin: auto;
		max-width: 480px;
		height: 100%;
		text-align: center;
	}

	.error {
		color: darkred;
	}
</style>
