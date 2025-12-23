class ListComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.shadowRoot.querySelector('.add-item-button').addEventListener('click', () => this.addItem());
        this.shadowRoot.querySelector('.delete-list-button').addEventListener('click', () => this.deleteList());

        this.shadowRoot.addEventListener('click', (e) => {
            const target = e.target;

            if (target.classList.contains('delete-item-button')) {
                const itemElement = target.closest('.list-item');
                this.deleteItem(itemElement.dataset.itemId);
            } else if (target.classList.contains('edit-item-button')) {
                const itemElement = target.closest('.list-item');
                this.enterEditMode(itemElement);
            } else if (target.classList.contains('save-item-button')) {
                const itemElement = target.closest('.list-item');
                this.saveItem(itemElement);
            }
        });

        this.shadowRoot.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                const itemElement = e.target.closest('.list-item');
                this.toggleComplete(itemElement.dataset.itemId, e.target.checked);
            }
        });
    }

    render() {
        const list = JSON.parse(this.getAttribute('list'));
        const itemsHtml = list.items.map(item => `
            <div class="list-item" data-item-id="${item.id}">
                <input type="checkbox" ${item.completed ? 'checked' : ''}>
                <span class="list-item-text ${item.completed ? 'completed' : ''}">${item.text}</span>
                <input type="text" class="edit-item-input" style="display: none;">
                <div class="item-buttons">
                    <button class="edit-item-button">Edit</button>
                    <button class="save-item-button" style="display: none;">Save</button>
                    <button class="delete-item-button">Delete</button>
                </div>
            </div>
        `).join('');

        this.shadowRoot.innerHTML = `
            <style>
                .list {
                    background-color: #fff;
                    border-radius: 12px;
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
                    transition: box-shadow 0.3s ease-in-out;
                }
                .list:hover {
                     box-shadow: 0 12px 24px rgba(0,0,0,0.15);
                }
                .list-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                .list-header h3 {
                    margin: 0;
                    font-size: 1.5rem;
                    font-weight: 600;
                }
                .delete-list-button {
                    background: transparent;
                    border: none;
                    color: #dc3545;
                    font-weight: 600;
                    cursor: pointer;
                }
                .add-item-container {
                    display: flex;
                    margin-bottom: 1.5rem;
                }
                .new-item-text {
                    flex-grow: 1;
                    border: 1px solid #ddd;
                    border-radius: 6px 0 0 6px;
                    padding: 0.8rem;
                }
                .add-item-button {
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 0 6px 6px 0;
                    padding: 0.8rem 1.2rem;
                    cursor: pointer;
                }
                .list-item {
                    display: flex;
                    align-items: center;
                    padding: 0.8rem 0;
                    border-bottom: 1px solid #eee;
                }
                .list-item:last-child {
                    border-bottom: none;
                }
                .list-item input[type="checkbox"] {
                    margin-right: 1rem;
                    width: 20px;
                    height: 20px;
                }
                .list-item-text {
                    flex-grow: 1;
                }
                 .list-item-text.completed {
                    text-decoration: line-through;
                    color: #aaa;
                }
                .item-buttons {
                    margin-left: auto;
                    display: flex;
                    gap: 0.5rem;
                }
                .item-buttons button {
                    border: 1px solid #ccc;
                    background: #fff;
                    padding: 0.4rem 0.8rem;
                    border-radius: 4px;
                    cursor: pointer;
                }
                 .delete-item-button {
                    color: #dc3545;
                    border-color: #dc3545;
                }
                .edit-item-input {
                     flex-grow: 1;
                }
            </style>
            <div class="list">
                <div class="list-header">
                    <h3>${list.name}</h3>
                    <button class="delete-list-button">Delete List</button>
                </div>
                <div class="add-item-container">
                    <input type="text" class="new-item-text" placeholder="Add a new item...">
                    <button class="add-item-button">Add</button>
                </div>
                <div class="list-items">${itemsHtml}</div>
            </div>
        `;
    }

    addItem() {
        const newItemText = this.shadowRoot.querySelector('.new-item-text').value;
        if (newItemText) {
            this.dispatchEvent(new CustomEvent('addItem', {
                detail: {
                    listId: JSON.parse(this.getAttribute('list')).id,
                    itemText: newItemText
                }
            }));
            this.shadowRoot.querySelector('.new-item-text').value = '';
        }
    }

    deleteItem(itemId) {
        this.dispatchEvent(new CustomEvent('deleteItem', {
            detail: {
                listId: JSON.parse(this.getAttribute('list')).id,
                itemId: itemId
            }
        }));
    }

    toggleComplete(itemId, isChecked) {
        this.dispatchEvent(new CustomEvent('toggleComplete', {
            detail: {
                listId: JSON.parse(this.getAttribute('list')).id,
                itemId: itemId,
                completed: isChecked
            }
        }));
    }

    enterEditMode(itemElement) {
        itemElement.querySelector('.list-item-text').style.display = 'none';
        itemElement.querySelector('.edit-item-button').style.display = 'none';

        const editInput = itemElement.querySelector('.edit-item-input');
        editInput.style.display = 'block';
        editInput.value = itemElement.querySelector('.list-item-text').textContent;
        editInput.focus();

        itemElement.querySelector('.save-item-button').style.display = 'block';
    }

    saveItem(itemElement) {
        const newText = itemElement.querySelector('.edit-item-input').value;
        const itemId = itemElement.dataset.itemId;

        this.dispatchEvent(new CustomEvent('editItem', {
            detail: {
                listId: JSON.parse(this.getAttribute('list')).id,
                itemId: itemId,
                newText: newText
            }
        }));
    }

    deleteList() {
        this.dispatchEvent(new CustomEvent('deleteList', {
            detail: {
                listId: JSON.parse(this.getAttribute('list')).id
            }
        }));
    }
}

customElements.define('list-component', ListComponent);