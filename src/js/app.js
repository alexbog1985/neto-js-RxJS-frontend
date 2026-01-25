import '../css/style.css';
import Polling from './Polling';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('#root');
  const app = new Polling(root);

  app.init();
});
