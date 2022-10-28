import { App } from './app/app';

import './assets/styles/main.scss';

const root = document.querySelector('#app') as HTMLDivElement;

const app = new App();

app.render(root);
