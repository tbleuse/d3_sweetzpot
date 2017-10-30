var keycodes = [];
let before, after;
document.addEventListener('keydown', (e) => {
    if(!before) {
        before = moment();
    }
    switch(e.key) {
        case "Alt": break;
        case "AltGraph": break;
        case "Shift": break;
        case "Enter": break;
        default: keycodes.push(e.key); break;
    }
    
    after = moment();
});

document.getElementById('btn').addEventListener('click', () => {
    const resultString = keycodes.join('');
    alert(resultString);
});