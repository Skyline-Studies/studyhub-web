import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, query, where, arrayUnion, arrayRemove, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const createListButton = document.getElementById('create-list-button');
const newListNameInput = document.getElementById('new-list-name');
const listsContainer = document.querySelector('.lists-container');
const logoutButton = document.getElementById('logout-button');
const createNoteButton = document.getElementById('create-note-button');
const newNoteTitleInput = document.getElementById('new-note-title');
const newNoteContentInput = document.getElementById('new-note-content');
const notesContainer = document.querySelector('.notes-container');

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in.
        loadLists(user.uid);
        loadNotes(user.uid);

        createListButton.addEventListener('click', () => {
            const listName = newListNameInput.value;
            if (listName) {
                createList(user.uid, listName);
                newListNameInput.value = '';
            }
        });

        createNoteButton.addEventListener('click', () => {
            const noteTitle = newNoteTitleInput.value;
            const noteContent = newNoteContentInput.value;
            if (noteTitle) {
                createNote(user.uid, noteTitle, noteContent);
                newNoteTitleInput.value = '';
                newNoteContentInput.value = '';
            }
        });

        logoutButton.addEventListener('click', () => {
            signOut(auth).catch((error) => {
                console.error("Logout failed:", error);
            });
        });

    } else {
        // User is signed out.
        if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
            window.location.href = 'index.html';
        }
    }
});

function loadLists(userId) {
    const listsQuery = query(collection(db, 'lists'), where('owner', '==', userId));
    onSnapshot(listsQuery, (snapshot) => {
        listsContainer.innerHTML = '';
        snapshot.forEach((doc) => {
            const list = { id: doc.id, ...doc.data() };
            const listComponent = document.createElement('list-component');
            listComponent.setAttribute('list', JSON.stringify(list));

            listComponent.addEventListener('addItem', (e) => {
                addItemToList(e.detail.listId, e.detail.itemText);
            });

            listComponent.addEventListener('deleteItem', (e) => {
                deleteItemFromList(e.detail.listId, e.detail.itemId);
            });

            listComponent.addEventListener('toggleComplete', (e) => {
                toggleItemComplete(e.detail.listId, e.detail.itemId, e.detail.completed);
            });

            listComponent.addEventListener('editItem', (e) => {
                editItemText(e.detail.listId, e.detail.itemId, e.detail.newText);
            });

            listComponent.addEventListener('deleteList', (e) => {
                deleteList(e.detail.listId);
            });
            
            listsContainer.appendChild(listComponent);
        });
    });
}

async function createList(userId, listName) {
    await addDoc(collection(db, 'lists'), {
        owner: userId,
        name: listName,
        items: []
    });
}

async function addItemToList(listId, itemText) {
    const listRef = doc(db, 'lists', listId);
    await updateDoc(listRef, {
        items: arrayUnion({ id: Date.now().toString(), text: itemText, completed: false })
    });
}

async function deleteItemFromList(listId, itemId) {
    const listRef = doc(db, 'lists', listId);
    const listDoc = await getDoc(listRef);
    if (listDoc.exists()) {
        const list = listDoc.data();
        const itemToDelete = list.items.find(item => item.id === itemId);
        if (itemToDelete) {
            await updateDoc(listRef, {
                items: arrayRemove(itemToDelete)
            });
        }
    }
}

async function toggleItemComplete(listId, itemId, completed) {
    const listRef = doc(db, 'lists', listId);
    const listDoc = await getDoc(listRef);
    if (listDoc.exists()) {
        const list = listDoc.data();
        const itemIndex = list.items.findIndex(item => item.id === itemId);
        if (itemIndex > -1) {
            const newItems = [...list.items];
            newItems[itemIndex].completed = completed;
            await updateDoc(listRef, {
                items: newItems
            });
        }
    }
}

async function editItemText(listId, itemId, newText) {
    const listRef = doc(db, 'lists', listId);
    const listDoc = await getDoc(listRef);
    if (listDoc.exists()) {
        const list = listDoc.data();
        const itemIndex = list.items.findIndex(item => item.id === itemId);
        if (itemIndex > -1) {
            const newItems = [...list.items];
            newItems[itemIndex].text = newText;
            await updateDoc(listRef, {
                items: newItems
            });
        }
    }
}

async function deleteList(listId) {
    await deleteDoc(doc(db, 'lists', listId));
}

function loadNotes(userId) {
    const notesQuery = query(collection(db, 'notes'), where('owner', '==', userId));
    onSnapshot(notesQuery, (snapshot) => {
        notesContainer.innerHTML = '';
        snapshot.forEach((doc) => {
            const note = { id: doc.id, ...doc.data() };
            const noteComponent = document.createElement('note-component');
            noteComponent.setAttribute('note', JSON.stringify(note));

            noteComponent.addEventListener('deleteNote', (e) => {
                deleteNote(e.detail.noteId);
            });

            noteComponent.addEventListener('updateNote', (e) => {
                updateNoteContent(e.detail.noteId, e.detail.content);
            });

            notesContainer.appendChild(noteComponent);
        });
    });
}

async function createNote(userId, noteTitle, noteContent) {
    await addDoc(collection(db, 'notes'), {
        owner: userId,
        name: noteTitle,
        content: noteContent
    });
}

async function deleteNote(noteId) {
    await deleteDoc(doc(db, 'notes', noteId));
}

async function updateNoteContent(noteId, content) {
    const noteRef = doc(db, 'notes', noteId);
    await updateDoc(noteRef, {
        content: content
    });
}
