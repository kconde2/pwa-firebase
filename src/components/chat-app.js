import {
  LitElement,
  html,
  css
} from 'lit-element';
import './layout/navigation/chat-header.js';
import './data/chat-data.js';
import './data/chat-store.js';
import './data/chat-auth.js';
import './data/chat-login.js';

import firebase from 'firebase/app';

class ChatApp extends LitElement {

  constructor() {
    super();
    this.users = [];
    this.user = {};
    this.logged = false;
    this.messages = [];
    this.message = '';
  }

  static get properties() {
    return {
      unresolved: {
        type: Boolean,
        reflect: true
      },
      messages: Array,
      message: String,
      users: {
        type: Array
      },
      user: Object,
      logged: Boolean
    };
  }

  static get styles() {
    return css`
    * {  box-sizing: border-box }

    footer {
      position: fixed;
      bottom: 0;
      width: 100%;
    }

    footer form {
      display: flex;
      justify-content: space-between;
      background-color: #ffffff;
      padding: 0.5rem 1rem;
      width: 100%;
    }

    footer form input {
      width: 100%;
    }

    ul {
      position: relative;
      display: flex;
      flex-direction: column;
      list-style: none;
      padding: 0;
      margin: 0;
      margin-bottom: 3em;
    }

    ul li {
      display: block;
      padding: 0.5rem 1rem;
      margin-bottom: 1rem;
      background-color: #cecece;
      border-radius: 0 30px 30px 0;
      width: 70%;
    }

    ul li.own {
      align-self: flex-end;
      text-align: right;
      background-color: #16a7f1;
      color: #ffffff;
      border-radius: 30px 0 0 30px;
    }
  `;
  }

  firstUpdated() {
    this.unresolved = false;
    this.logged = localStorage.getItem('logged') == 'true' ? true : false;

    if (Notification.permission === 'granted') {
      navigator.serviceWorker.ready
        .then(registration => {
          registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array(document.config.publicKey)
          }).then(async subscribtion => {
            subscribtion.id = this.user.uid
            await fetch('http://localhost:8085/subscribe', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(subscribtion)
            })
          });
        });
    }
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  subscribe() {
    if (('serviceWorker' in navigator) || ('PushManager' in window)) {
      Notification.requestPermission()
        .then(function (result) {
          if (result === 'denied') {
            console.log('Permission wasn\'t granted. Allow a retry.');
            return;
          }
          if (result === 'default') {
            console.log('The permission request was dismissed.');
            return;
          }
          console.log('Notification granted', result);
          // Do something with the granted permission.
        });
    }
  }

  addUser(e) {
    this.users = e.detail;
  }

  addMessage(e) {
    this.messages = e.detail;
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 0);
  }

  handleLogin(e) {
    this.user = e.detail.user;
    this.logged = true;
  }

  handleMessage(e) {
    e.preventDefault();
    if (!this.message) return;
    const database = firebase.firestore();
    database.collection('messages').add({
      content: this.message,
      date: new Date().getTime(),
      user: this.user.uid,
      email: this.user.email
    });
  }

  getDate(timestamp) {
    const date = new Date(timestamp);
    // Hours part from the timestamp
    const hours = date.getHours();
    // Minutes part from the timestamp
    const minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    const seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format
    return `${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`;
  }

  render() {
    return html`
      <!-- <chat-data path="messages" @child-changed="${this.addMessage}">
                        </chat-data> -->

      <chat-store collection="messages" @child-changed="${this.addMessage}"></chat-store>
      <section>
        <!-- <chat-header></chat-header> -->
        <!-- header -->
        <slot name="header"></slot>
        <!-- header -->

        ${
      !this.logged ? html`
        <chat-auth></chat-auth>
        <chat-login @user-logged="${this.handleLogin}">
        </chat-login>
        `: html`
        <h1>Hi, ${this.user.email}</h1>

        <button @click="${this.subscribe}">Subscribe</button>

        <h1>Messages :</h1>
        <ul id="message">
          ${this.messages.map(message => html`
          <li class="${message.user == this.user.uid ? 'own' : ''}">
            <strong>${message.email} said :</strong>
            ${message.content} - ${this.getDate(message.date)}
          </li>
          `)}
          <ul />
          <footer>
            <form @submit="${this.handleMessage}">
              <input type="text" placeholder="Send new message ..." .value="${this.message}" @input="${e => this.message = e.target.value}">
              <button type="submit">Send</button>
            </form>
          </footer>
          `
        }
      </section>`;
  }
}

customElements.define('chat-app', ChatApp);
