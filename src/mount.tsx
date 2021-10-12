import React from 'react';
import {render} from 'react-dom';
import {App} from './components/App';

const root = document.getElementById('app');
if (!root) throw new Error('#app element is missing');

render(<App />, root);
