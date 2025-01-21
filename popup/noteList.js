export default class NoteList {
    getNotes() {
        return new Promise(resolve => {
            chrome.storage.local.get(['count'], result => {
                if (!result.count || result.count === 0) {
                    chrome.storage.local.set({ 'count': 0 }, () => {
                        resolve(false);
                    });
                } else if (Number(result.count) > 0) {
                    chrome.storage.local.get(null, items => {
                        const noteObj = {};
                        for (let key in items) {
                            if (key !== 'count' && key !== 'size' && key !== 'wrapping' && key !== 'existNoteId') {
                                noteObj[key] = items[key];
                            }
                        }
                        resolve(noteObj);
                    });
                }
            });
        });
    }

    addNote(name, text) {
        return new Promise(resolve => {
            chrome.storage.local.get(['existNoteId'], result => {
                const existNoteId = result.existNoteId;

                if (!existNoteId) {
                    const date = new Date();
                    const noteId = `${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;

                    const note = {};
                    note.text = text;
                    note.name = name;

                    chrome.storage.local.set({ [noteId]: note }, () => {
                        chrome.storage.local.get(['count'], result => {
                            const count = result.count + 1;
                            chrome.storage.local.set({ count }, () => {
                                resolve();
                            })
                        });
                    });
                } else if (existNoteId) {

                    const noteId = existNoteId;

                    const note = {};
                    note.text = text;
                    note.name = name;

                    chrome.storage.local.set({ [noteId]: note }, () => {
                        chrome.storage.local.set({ 'existNoteId': '' }, () => { 
                            resolve();
                        });
                    });
                }
            });
        })
    }

    delAll() {
        return new Promise(resolve => {
            chrome.storage.local.get(null, result => {
                const noteIDs = Object.keys(result);
                noteIDs.forEach(id => {
                    if (id != 'size' && id != 'wrapping' && id != 'existNoteId') {
                        chrome.storage.local.remove([id], () => { });
                    }
                });
                resolve();
            });
        });
    }

    delNote(id) {
        return new Promise(resolve => {
            chrome.storage.local.remove(id, () => {
                chrome.storage.local.get(["count"], result => {
                    const count = result.count - 1;
                    chrome.storage.local.set({ count }, () => {
                        resolve();
                    })
                })
            });
        });
    }
}
