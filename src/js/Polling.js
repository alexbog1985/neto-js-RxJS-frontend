import '../css/Polling.css';
import testData from './testData.json';

export default class Polling {
  constructor(root) {
    this.root = root;

    this.messagesElement = null;
    this.messages = [];
    this.cards = [];
  }

  init() {
    this.render();
  }

  render() {
    if (!this.root) return;
    this.root.innerHTML = '';

    const pollingContainer = document.createElement('div');
    pollingContainer.className = 'message-container';

    const pollingTitle = document.createElement('h2');
    pollingTitle.className = 'message-title';
    pollingTitle.textContent = 'Incoming';

    this.messagesElement = document.createElement('ul');
    this.messagesElement.className = 'messages-list';

    this.renderCard();
    this.messagesElement.append(...this.cards);

    pollingContainer.append(pollingTitle, this.messagesElement);

    this.root.append(pollingContainer);
  }

  renderCard() {
    this.getMessages();

    this.messages.forEach((message) => {
      const card = document.createElement('li');
      card.className = 'message-card';

      const cardFrom = document.createElement('div');
      cardFrom.className = 'message-card-from';

      const cardSubj = document.createElement('div');
      cardSubj.className = 'message-card-subj';

      const cardRecieved = document.createElement('div');
      cardRecieved.className = 'message-card-recieved';

      cardFrom.textContent = message.from;
      cardSubj.textContent = message.subject;
      cardRecieved.textContent = message.recieved;

      card.append(cardFrom, cardSubj, cardRecieved);
      this.cards.push(card);
    });
  }

  getMessages() {
    const data = testData;
    this.messages = data.messages;
  }
}
