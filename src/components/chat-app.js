import { LitElement, html } from 'lit-element';
import '/src/components/layout/navigation/chat-header.js';
import '/src/components/data/chat-data.js';

class ChatApp extends LitElement {

  constructor() {
    super();
    this.users = [];
  }

  static get properties() {
    return {
      unresolved: {
        type: Boolean,
        reflect: true
      },
      users: {
        type: Array
      }
    }
  }

  firstUpdated() {
    this.unresolved = false;
  }

  addUser(e) {
    this.users = e.detail;
  }

  render() {
    return html`
        <chat-data path="users" @child-added="${this.addUser}"></chat-data>
        <section>
            <chat-header></chat-header>
            <ul>
              ${this.users.map(user => html`<li>${user.name}</li>`)}
            </ul>
        </section>
      `;
  }
}
customElements.define('chat-app', ChatApp);
