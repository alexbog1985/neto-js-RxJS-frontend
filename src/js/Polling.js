import { ajax } from 'rxjs/ajax';
import { map, catchError, of } from 'rxjs';
import { interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

import '../css/Polling.css';

export default class Polling {
  constructor(root) {
    this.root = root;

    this.messagesElement = null;
    this.messages = [];
    this.cards = [];

    this.apiUrl = 'http://localhost:3000/messages/unread';
  }

  init() {
    this.render();

    this.getFromApi().subscribe((data) => {
      this.messages = data;
      this.render();
    });
  }

  getFromApi() {
    return ajax.getJSON(this.apiUrl).pipe(
      map((data) => data.messages || []),
      catchError((error) => {
        console.error('error: ', error);
        return of([]);
      }),
    );
  }

  startPolling() {
    this.polling$ = interval(5000).pipe(
      startWith(0),
      switchMap(() => this.getFromApi())
    ).subscribe(messages => {
      this.messages = messages;
      this.render();
    });
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
}
