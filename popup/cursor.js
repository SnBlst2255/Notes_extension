export default class Cursor{
    getPosition() {
        const position = textarea.selectionStart;
        const textBeforeCursor = textarea.value.slice(0, position); 
    
        const lines = textBeforeCursor.split('\n'); 
        const row = lines.length;
        
        const col = lines[lines.length - 1].length + 1; 
    
        return { row, col };
    }
}