class NoteComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.note = JSON.parse(this.getAttribute('note'));
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .note {
                    background-color: #fff;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                }
                .note-title {
                    font-size: 1.2rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                    border: none;
                    padding: 0.5rem;
                }
                .note-content {
                    flex-grow: 1;
                    padding: 0.5rem;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    min-height: 100px;
                }
                .delete-note-button {
                    margin-top: 1rem;
                    padding: 0.5rem 1rem;
                    background-color: #ea4335;
                    color: #fff;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    align-self: flex-end;
                }
            </style>
            <div class="note">
                <div class="note-title" contenteditable="true">${this.note.name}</div>
                <div class="note-content" contenteditable="true">${this.note.content}</div>
                <button class="delete-note-button">Delete Note</button>
            </div>
        `;
    }

    attachEventListeners() {
        this.shadowRoot.querySelector('.delete-note-button').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('deleteNote', { detail: { noteId: this.note.id } }));
        });

        this.shadowRoot.querySelector('.note-title').addEventListener('input', (e) => {
            this.dispatchEvent(new CustomEvent('updateNote', { detail: { noteId: this.note.id, name: e.target.innerText } }));
        });

        this.shadowRoot.querySelector('.note-content').addEventListener('input', (e) => {
            this.dispatchEvent(new CustomEvent('updateNote', { detail: { noteId: this.note.id, content: e.target.innerText } }));
        });
    }
}

customElements.define('note-component', NoteComponent);