const noteList = document.getElementById('note-list');
const noteTitle = document.getElementById('note-title');
const noteContent = document.getElementById('note-content');
const newNoteButton = document.getElementById('new-note');
const saveNoteButton = document.getElementById('save-button');
const sidebar = document.querySelector('.sidebar');
const toggleSidebarButton = document.getElementById('toggle-sidebar');

let notes = JSON.parse(localStorage.getItem('notes')) || [];
let currentNoteId = null;

toggleSidebarButton.addEventListener('click', () => {
  sidebar.classList.toggle('closed');
});


// Load notes on startup
function loadNotes() {
  noteList.innerHTML = '';
  notes.forEach(note => {
    const listItem = document.createElement('li');
    listItem.classList.add('note-item');
    listItem.dataset.id = note.id;
    listItem.classList.toggle('active', note.id === currentNoteId);
    listItem.innerHTML = `
            <span>${note.title || 'Untitled Note'}</span>
            <button onclick="deleteNote('${note.id}')">🗑️</button>
        `;
    listItem.addEventListener('click', () => selectNote(note.id));
    noteList.appendChild(listItem);
  });
}

// Save notes to localStorage
function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

// Add a new note
newNoteButton.addEventListener('click', () => {
  const newNote = {
    id: Date.now().toString(),
    title: '',
    content: ''
  };
  notes.push(newNote);
  currentNoteId = newNote.id;
  saveNotes();
  loadNotes();
  selectNote(newNote.id);
});

// Select a note
function selectNote(id) {
  currentNoteId = id;
  const note = notes.find(note => note.id === id);
  if (note) {
    noteTitle.value = note.title;
    noteContent.value = note.content;
    loadNotes();
  }
}

// Update the current note
noteTitle.addEventListener('input', () => {
  const note = notes.find(note => note.id === currentNoteId);
  if (note) {
    note.title = noteTitle.value;
    saveNotes();
    loadNotes();
  }
});

// Função para atualizar o status de salvamento
function showSaveStatus(unsaved = true) {
  if (unsaved) {
    saveNoteButton.classList.remove('hidden');
  } else {
    saveNoteButton.classList.add('hidden');
  }
}

// Mostrar status quando o título ou conteúdo mudar
noteTitle.addEventListener('input', () => {
  showSaveStatus(true);
});

noteContent.addEventListener('input', () => {
  showSaveStatus(true);
});

// Botão de salvar
saveNoteButton.addEventListener('click', () => {
  const note = notes.find(note => note.id === currentNoteId);
  if (note) {
    note.content = noteContent.value;
    note.title = noteTitle.value;
    saveNotes();
    showSaveStatus(false);
  }
});

// Atalho de teclado para salvar (Ctrl + S)
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.key === 's') {
    event.preventDefault(); // Evita o comportamento padrão do navegador
    const note = notes.find(note => note.id === currentNoteId);
    if (note) {
      note.content = noteContent.value;
      note.title = noteTitle.value;
      saveNotes();
      showSaveStatus(false);
    }
  }
});


saveNoteButton.addEventListener('input', () => {
  const note = notes.find(note => note.id === currentNoteId);
  if (note) {
    note.content = noteContent.value;
    saveNotes();
  }
});

// Delete a note
function deleteNote(id) {
  notes = notes.filter(note => note.id !== id);
  if (currentNoteId === id) {
    currentNoteId = notes.length ? notes[0].id : null;
  }
  saveNotes();
  loadNotes();
  if (currentNoteId) selectNote(currentNoteId);
}

// Initialize the app
if (notes.length) {
  currentNoteId = notes[0].id;
  selectNote(currentNoteId);
}
loadNotes();
