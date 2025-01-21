export default class EditorTools {
    copyAll(textareaID) {
        navigator.clipboard.writeText(document.getElementById(textareaID).value)
            .catch(err => {
                console.error('Ошибка при копировании:', err);
            });
    }

    copySelected(textareaID) {
        const txtarea = document.getElementById(textareaID);
        const start = txtarea.selectionStart;
        const finish = txtarea.selectionEnd;
        const selected = txtarea.value.substring(start, finish);

        navigator.clipboard.writeText(selected);
    }

    pasteText(textareaID) {
        navigator.clipboard.readText()
            .then(clipboardText => {
                const textarea = document.getElementById(textareaID);
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;

                const currentValue = textarea.value;

                textarea.value = currentValue.slice(0, start) + clipboardText + currentValue.slice(end);

                const newPosition = start + clipboardText.length;
                textarea.setSelectionRange(newPosition, newPosition);
            })
    }

    cutText(textareaID) {
        const textarea = document.getElementById(textareaID);
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const cutText = textarea.value.slice(start, end);

        navigator.clipboard.writeText(cutText)
            .then(() => {
                textarea.value = textarea.value.slice(0, start) + textarea.value.slice(end);
                textarea.selectionStart = textarea.selectionEnd = start;
            })
            .catch(err => {
                console.error('Ошибка при вырезании текста:', err);
            });
    }

    selectAll(textareaID) {
        document.getElementById(textareaID).select();
    }
}
