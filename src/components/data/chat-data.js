import { LitElement, html } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/database';

class ChatData extends LitElement {

  constructor() {
    super();
    this.path = '';
    this.data = [];
  }

  static get properties() {
    return {
      database: { type: Object },
      path: {
        type: String
      },
      data: {
        type: Array
      }
    }
  }

  firstUpdated() {
    firebase.initializeApp(document.config);
    this.database = firebase.database();
    // this.database.ref().child(this.path).push({
    //   'name': ""
    // })

    this.database.ref().child(this.path).on('value', data => this.nodeHasChanged('value', data))
    this.database.ref().child(this.path).on('child_added', data => this.nodeHasChanged('child_added', data))
    this.database.ref().child(this.path).on('child_changed', data => this.nodeHasChanged('child_changed', data))
    this.database.ref().child(this.path).on('child_moved', data => this.nodeHasChanged('child_moved', data))
    this.database.ref().child(this.path).on('child_removed', data => this.nodeHasChanged('child_removed', data))
  }

  nodeHasChanged(event, data) {
    switch (event) {
      case 'value':
        break;
      case 'child_added':
        this.data = [...this.data, data.val()];
        this.dispatchEvent(new CustomEvent('child-added', { detail: this.data }))
        break;
      case 'child_changed':
        break;
      case 'child_moved':
        break;
      case 'child_removed':
     const index =  this.data.indexOf(data.val());
     debugger
        this.dispatchEvent(new CustomEvent('child-removed', { detail: data.val() }))
        break;
    }
  }

  render() {
    return html``;
  }
}
customElements.define('chat-data', ChatData);
