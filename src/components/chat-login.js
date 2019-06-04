import { LitElement, html, css } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/auth';

export class ChatLogin extends LitElement {
  constructor() {
    super();
    this.email = '';
    this.password = '';
  }

  static get properties() {
    return {
      email: String,
      password: String
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  firstUpdated() {
    firebase.auth().onAuthStateChanged(user => {

      if (!user) {
        localStorage.setItem('logged', false);
        return console.log('logged out');
      }

      localStorage.setItem('logged', true);
      if (!user) return console.log('logged out');
      this.dispatchEvent(new CustomEvent('user-logged', { detail: { user } }))
    });
  }

  handleForm(e) {
    e.preventDefault();
    if (!this.email || !this.password) return console.log("Emai or password are empty :'(");
    firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(user => {
      console.log('Login successfully', user);
    }).catch(console.log);
  }

  render() {
    return html`
      <h1>Login</h1>
      <form @submit="${this.handleForm}">
        <input type="email" .value="${this.email}" @input="${e => this.email = e.target.value}">
        <input type="password" .value="${this.password}" @input="${e => this.password = e.target.value}">
        <button type="submit">Login</button>
      </form>
    `;
  }
}
customElements.define('chat-login', ChatLogin);
