export default class ContextMenu {
    openContextMenu(textareaID, contextID, e) {
        e.preventDefault();

        const context = document.getElementById(contextID);
        context.style.display = 'flex';

        const clickX = e.pageX + 15;
        const clickY = e.pageY + 15;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const menuWidth = context.offsetWidth;
        const menuHeight = context.offsetHeight;

        if ((clickX + menuWidth) > windowWidth) {
            context.style.left = (windowWidth - menuWidth) + 'px';
        } else {
            context.style.left = clickX + 'px';
        }

        if ((clickY + menuHeight) > windowHeight) {
            context.style.top = (windowHeight - menuHeight) + 'px';
        } else {
            context.style.top = clickY + 'px';
        }

        document.getElementById(textareaID).style.cursor = 'default'
    }

    closeContextMenu() {
        document.getElementById('context').style.display = 'none';
        document.getElementById('textarea').style.cursor = 'auto';

        document.getElementById('context-viewer').style.display = 'none';
        document.getElementById('textarea-readonly').style.cursor = 'auto';
    }
}