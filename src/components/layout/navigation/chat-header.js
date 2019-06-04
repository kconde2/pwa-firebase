import { LitElement, html, css } from 'lit-element';

class ChatHeader extends LitElement {
  static get styles() {
    return css`
            :host {
                height: 48px;
                background-color: aliceblue;
                border-bottom: solid 1px #eeeeee;
            }

            header {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            img {
                height: 42px;
                width: 42px;
                display: block;
            }
        `;
  }

  render() {
    return html`
        <header><img src="./src/assets/images/1f680.png" alt="Logo"></header>
        `;
  }


}
customElements.define('chat-header', ChatHeader);
