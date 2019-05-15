import { LitElement, html } from 'lit-element';
import '/src/components/layout/navigation/chat-header.js';
import '/src/components/data/chat-data.js';

class ChatApp extends LitElement {

    constructor() {
        super();
    }

    static get properties() {
        return {
            unresolved: {
                type: Boolean,
                reflect: true
            }
        }
    }

    firstUpdated() {
        this.unresolved = false;
    }

    render() {
        return html `
        <chat-data></chat-data>
        <section>
            <chat-header></chat-header>
        </section>
        `;
    }
}
customElements.define('chat-app', ChatApp);
