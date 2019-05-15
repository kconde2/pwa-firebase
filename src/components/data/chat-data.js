import { LitElement, html } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/database';

class ChatData extends LitElement {

    constructor() {
        super();
        this.path = '';
    }

    static get properties() {
        return {
            database: { type: Object },
            path: {
                type: String
            }
        }
    }

    firstUpdated() {
        firebase.initializeApp(document.config);
        this.database = firebase.database();
        this.database.ref().child('users').push({
            name: 'KFC'
        });
    }

    render() {
        return html``;
    }
}
customElements.define('chat-data', ChatData);
