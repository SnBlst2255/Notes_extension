import EditorTools from './editorTools.js';
import ContextMenu from './contextMenu.js';
import Cursor from './cursor.js';
import NoteList from './noteList.js';
import Settings from './settings.js';

const tools = new EditorTools();
const context = new ContextMenu();
const cursor = new Cursor();
const noteList = new NoteList;
const settings = new Settings();

//Note List

function updateNoteList() {
    noteList.getNotes().then((notes) => {
        if (notes == false) {
            const container = document.getElementById('note-container');
            container.innerHTML = '';
            container.style.alignItems = 'center';
            container.style.justifyContent = 'center';

            const countElement = document.getElementById('notesCount');
            countElement.textContent = '0';

            const noNotesElement = document.createElement('span');
            noNotesElement.textContent = 'You have no notes';
            noNotesElement.classList.add('no-notes-msg')
            container.appendChild(noNotesElement);
        } else {
            const noteArr = Object.entries(notes);

            const container = document.getElementById('note-container');
            container.innerHTML = '';
            container.style.alignItems = 'flex-start';
            container.style.justifyContent = 'flex-start';

            const countElement = document.getElementById('notesCount');
            countElement.textContent = noteArr.length;

            noteArr.forEach(note => {

                const noteDiv = document.createElement('div');
                noteDiv.setAttribute('class', 'note');

                const infoBlock = document.createElement('div');
                infoBlock.classList.add('info-block');
                noteDiv.appendChild(infoBlock);

                note.forEach((element, index) => {
                    if (index == 0) {
                        noteDiv.setAttribute('id', element)
                    } else {

                        const id = noteDiv.getAttribute('id');

                        const name = document.createElement('span');
                        name.textContent = element.name;
                        name.classList.add('note-name');
                        infoBlock.appendChild(name);

                        const text = document.createElement('span');
                        text.textContent = element.text;
                        text.classList.add('note-text')
                        infoBlock.appendChild(text);

                        const icons = document.createElement('div');
                        icons.setAttribute('class', 'icon-block');
                        noteDiv.appendChild(icons);

                        const delIcon = document.createElement('img');
                        delIcon.src = '../images/delete.png';
                        delIcon.setAttribute('class', 'icon-small');
                        delIcon.title = 'Delete';
                        delIcon.alt = 'Del';
                        icons.appendChild(delIcon);

                        delIcon.addEventListener('click', function () {
                            noteList.delNote(id).then(() => {
                                updateNoteList();
                            })
                        });

                        const editIcon = document.createElement('img');
                        editIcon.src = '../images/edit.png';
                        editIcon.setAttribute('class', 'icon-small');
                        editIcon.title = 'Edit';
                        editIcon.alt = 'Edit';
                        icons.appendChild(editIcon);

                        editIcon.addEventListener('click', function () {
                            chrome.storage.local.set({ 'existNoteId': id }, function () { });
                            openEditor(id);
                        });

                        const viewIcon = document.createElement('img');
                        viewIcon.src = '../images/view.png';
                        viewIcon.setAttribute('class', 'icon-small');
                        viewIcon.title = 'View';
                        viewIcon.alt = 'View';
                        icons.appendChild(viewIcon);

                        viewIcon.addEventListener('click', function () {
                            openViewer(id);
                        });
                    }
                });

                container.appendChild(noteDiv);

            });
        }
    });
}

function deleteAll(){
    noteList.delAll().then(() => {
        updateNoteList();
    });
}

//Main panel

document.getElementById('add-btn').addEventListener('click', function () {
    openEditor();
});

document.getElementById('del-all').addEventListener('click', function () {
    deleteAll();
});

document.getElementById('exit-btn').addEventListener('click', function () {
    window.close();
});

//Settings

function loadSettings() {
    settings.getSettings().then(settings => {
        document.querySelectorAll('textarea').forEach((textarea) => {
            textarea.style.fontSize = `${settings.size}px`;
            textarea.setAttribute('wrap', settings.wrapping ? 'hard' : 'off');
        });
    });
}

function applySettings(){
    const fontSize = parseInt(document.getElementById('font-size').value);
    const wrapping = document.getElementById('wrapping').checked;

    settings.updateSettings(fontSize, wrapping).then(() => {
        loadSettings();
        closeSettings();
    });
}

function openSettings(){
    settings.getSettings().then(settings => {
        document.getElementById('font-size').value = parseInt(settings.size);
        document.getElementById('wrapping').checked = settings.wrapping;

        document.getElementById('settings-panel').classList.remove('hidden');
    });
}

function closeSettings(){
    document.getElementById('settings-panel').classList.add('hidden');
}

document.getElementById('settings-btn').addEventListener('click', function () {
    openSettings();
});

document.getElementById('apply-btn').addEventListener('click', function () {
    applySettings();
});

document.getElementById('reset-settings').addEventListener('click', function () {
    document.getElementById('font-size').value = 16;
    document.getElementById('wrapping').checked = false;
});

//Editor panel

function openEditor(id) {
    document.getElementById("editor-panel").classList.remove('hidden');
    
    if(id){
        chrome.storage.local.get(id, function(result) {
            document.getElementById("textarea").value = result[id].text;
            document.getElementById("name").value = result[id].name;
            getCursorPosition("textarea", "ln-editor", "col-editor");
        });
    }

}

function closeEditor() {
    document.getElementById("textarea").value = "";
    document.getElementById("name").value = "";
    resetCursorPositions("ln-editor", "col-editor");
    document.getElementById("editor-panel").classList.add('hidden');

    chrome.storage.local.set({"existNoteId": ""}, function(){});
}

document.getElementById('exit-editor-btn').addEventListener('click', function () {
    closeEditor();
});

document.getElementById('save-btn').addEventListener('click', function () {
    const text = document.getElementById('textarea').value;
    const name = document.getElementById('name').value;

    if (text === '' || name === '') {
        return;
    }

    noteList.addNote(name, text).then(() => {
        closeEditor();
        updateNoteList();
    })
});

document.getElementById('copy-btn-editor').addEventListener('click', function () {
    tools.copySelected('textarea');
    document.getElementById('textarea').focus();
});

document.getElementById('paste-btn-editor').addEventListener('click', function () {
    tools.pasteText('textarea');
    document.getElementById('textarea').focus();
});

document.getElementById('cut-btn-editor').addEventListener('click', function () {
    tools.cutText('textarea');
    document.getElementById('textarea').focus();
});

document.getElementById('select-btn-editor').addEventListener('click', function () {
    tools.selectAll('textarea');
    document.getElementById('textarea').focus();
});

//Viewer panel

function openViewer(id){
    document.getElementById('viewer-panel').classList.remove('hidden');

    chrome.storage.local.get(id, function (result) {
        document.getElementById('textarea-readonly').value = result[id].text;
        document.getElementById('name-readonly').value = result[id].name;
    });
}

function closeViewer(){
    document.getElementById('viewer-panel').classList.add('hidden');
    document.getElementById('textarea-readonly').value = '';
    document.getElementById('name').value = '';
}

document.getElementById('exit-viewer-btn').addEventListener('click', function () {
    closeViewer();
});

document.getElementById('copy-viewer-text').addEventListener('click', function () {
    tools.copyAll('textarea-readonly');
});

document.getElementById('copy-selected-viewer-text').addEventListener('click', function () {
    tools.copySelected('textarea-readonly');
});

//Context

window.oncontextmenu = function () {
    return false;
}

document.getElementById('textarea').oncontextmenu = function (e) {
    context.openContextMenu('textarea', 'context', e)
};

document.getElementById('textarea-readonly').oncontextmenu = function (e) {
    context.openContextMenu('textarea-readonly', 'context-viewer', e)
};

window.onclick = function () {
    context.closeContextMenu();
};

document.getElementById('copy-context').addEventListener('click', function () {
    tools.copySelected('textarea');
    document.getElementById('textarea').focus();
});

document.getElementById('paste-context').addEventListener('click', async function () {
    tools.pasteText('textarea');
    document.getElementById('textarea').focus();
});

document.getElementById('cut-context').addEventListener('click', async function () {
    tools.cutText('textarea');
    document.getElementById('textarea').focus();
});

document.getElementById('select-context').addEventListener('click', function () {
    tools.selectAll('textarea');
    document.getElementById('textarea').focus();
});

document.getElementById('copy-all-context').addEventListener('click', function () {
    tools.copyAll('textarea-readonly');
});

document.getElementById('copy-selected-context').addEventListener('click', function () {
    tools.copySelected('textarea-readonly');
});

//Cursor position

export function getCursorPosition(textareaID, lnID, colID) {
    const lnSpan = document.getElementById(lnID);
    const colSpan = document.getElementById(colID);
    const position = cursor.getPosition(textareaID);

    lnSpan.textContent = position.row;
    colSpan.textContent = position.col;
}

function resetCursorPositions(lnID, colID) {
    document.getElementById(lnID).textContent = '1';
    document.getElementById(colID).textContent = '0';
}

document.getElementById('textarea').addEventListener('click', function () {
    getCursorPosition('textarea', 'ln-editor', 'col-editor');
});

document.getElementById('textarea').addEventListener('input', function () {
    getCursorPosition('textarea', 'ln-editor', 'col-editor');
});

document.getElementById('textarea').addEventListener('keydown', function (e) {
    if (e.key == 'ArrowUp' || e.key == 'ArrowDown' || e.key == 'ArrowLeft' || e.key == 'ArrowRight') {
        setTimeout(function () {
            getCursorPosition('textarea', 'ln-editor', 'col-editor');
        }, 1);
    }
});

window.onload = function () {
    updateNoteList();
    loadSettings();
}

/*
20.01.2025 I looked at my old code and had a question. 
What state did I write it in? It's one big swamp. 
I don't exclude the possibility that my code remained the same swamp after the redesign, but still, it's obviously better than it was.
*/