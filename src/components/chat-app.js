import { LitElement, html } from 'lit-element';
import '/src/components/layout/navigation/chat-header.js';
import '/src/components/data/chat-data.js';
import '/src/components/chat-auth.js';
import '/src/components/chat-login.js';

class ChatApp extends LitElement {

  constructor() {
    super();
    this.users = [];
    this.user = {};
    this.logged = false;
  }

  static get properties() {
    return {
      unresolved: {
        type: Boolean,
        reflect: true
      },
      users: {
        type: Array
      },
      user: Object,
      logged: Boolean
    }
  }

  firstUpdated() {
    this.unresolved = false;
    this.logged = localStorage.getItem('logged') == 'true' ? true : false;
  }

  addUser(e) {
    this.users = e.detail;
  }

  handleLogin(e) {
    this.user = e.detail.user;
  }

  render() {
    return html`
        <chat-data path="users" @child-changed="${this.addUser}"></chat-data>
        <slot name="header"></slot>

        ${
          !this.logged ? html`
          <chat-auth></chat-auth>
          <chat-login @user-logged="${this.handleLogin}"></chat-login>
          `: html`
          <h1>Hi, ${this.user.email}</h1>
          `
        }

        <section>
          <!-- <chat-header></chat-header> -->
          <ul>
            ${this.users.map(user => html`<li>${user.name}</li>`)}
          </ul>
        </section>
      `;
  }
}
customElements.define('chat-app', ChatApp);
