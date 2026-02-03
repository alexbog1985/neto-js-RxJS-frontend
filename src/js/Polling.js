import { ajax } from 'rxjs/ajax';
import { interval, map, catchError, of } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

import '../css/Polling.css';

export default class Polling {
  constructor(root, apiUrl = 'http://localhost:3000/messages/unread') {
    this.root = root;
    this.apiUrl = apiUrl;

    this.messages = [];
    this.polling$ = null;
  }

  init() {
    this.render();
    this.startPolling();
  }

  startPolling() {
    this.polling$ = interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => this.fetchMessages()),
      )
      .subscribe({
        next: (messages) => this.updateMessages(messages),
        error: (err) => console.error('Error: ', err),
      });
  }

  fetchMessages() {
    return ajax.getJSON(this.apiUrl).pipe(
      map((data) => data.messages),
      catchError((error) => {
        console.error('Request failed', error);
        return of([]);
      }),
    );
  }

  updateMessages(newMessages) {
    if (this.messages !== newMessages) {
      this.messages = newMessages;
      this.renderMessages();
    }
  }

  render() {
    if (!this.root) return;
    this.root.innerHTML = '';

    const messageContainer = document.createElement('div');
    messageContainer.className = 'message-container';

    const titleElement = document.createElement('h2');
    titleElement.className = 'message-title';
    titleElement.textContent = 'Incoming';

    this.messagesList = document.createElement('ul');
    this.messagesList.className = 'messages-list';

    messageContainer.append(titleElement, this.messagesList);
    this.root.append(messageContainer);

    this.renderMessages();
  }

  renderMessages() {
    if (!this.messagesList) return;
    this.messagesList.innerHTML = '';

    const fragment = document.createDocumentFragment();

    this.messages.forEach((message) => {
      const card = this.createMessageCard(message);
      fragment.append(card);
    });

    this.messagesList.append(fragment);
  }

  createMessageCard(message) {
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

    return card;
  }
}
