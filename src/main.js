import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		wsUrl: 'ws://toe.ndawn.ru/ws'
	}
});

export default app;
