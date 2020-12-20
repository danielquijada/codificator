let translationMap = {};
populateMap();

document.getElementById('input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        transform();
    }
});

function transform() {
    const inputText = document.getElementById('input').value;
    let output = [];

    for (let i = 0; i < inputText.length; i++) {
        output.push(translateLetter(inputText.charAt(i)));
    }

    document.getElementById('output').innerText = output.join(translationMap.separator || ' ');
}

function translateLetter(letter) {
    const translated = translationMap[letter] || translationMap[letter.toLowerCase()] || translationMap[letter.toUpperCase()];
    return translated || translationMap.default || '?';
}

function populateMap () {
    const savedMap = localStorage.getItem('map');
    if (savedMap) {
        translationMap = JSON.parse(savedMap);
        refreshMap();
    } else {
        populateDefaultMap();
    }
}

function populateDefaultMap() {
    translationMap = {};
    const defaultMap = 'zywvutsrqponmlkihgfedcba';
    for (let i = 1; i <= defaultMap.length; i++) {
        translationMap[defaultMap.charAt(i - 1)] = i;
    }
    translationMap.separator = ' ';
    translationMap.default = '?';
    refreshMap();
}

function remove(key) {
    delete translationMap[key];
    refreshMap();
}

function edit(key) {
    const value = prompt (`Modify translation for ${key}. Value:`);
    translationMap[key] = value;
    refreshMap();
}

function add() {
    const key = prompt ("Add new translation. Key:");
    const value = prompt ("Add new translation. Value:");
    translationMap[key] = value;
    refreshMap();
}

function refreshMap() {
    const trs = Array.from(document.getElementsByClassName('map-tr'));
    for (e of trs) {
        e.parentNode.removeChild(e);
    }
    showMap();
    localStorage.setItem('map', JSON.stringify(translationMap));
}

function showMap() {
    const mapNode = document.getElementById('map');
    const keys = Object.keys(translationMap).sort(compareFunction);
    
    for (let key of keys) {
        let tr = document.createElement('tr');
        tr.className = 'map-tr';

        let tdKey = document.createElement('td');
        tdKey.innerHTML = key === ' ' ? '<space></space>' : key;

        let tdValue = document.createElement('td');
        tdValue.innerHTML = translationMap[key] === ' ' ? '<space></space>' : translationMap[key];

        let tdActions = document.createElement('td');
        tdActions.innerHTML = `<button class="remove-btn" onclick="remove('${key}')">X</button>`;
        tdActions.innerHTML += `<button class="edit-btn" onclick="edit('${key}')">✎</button>`;

        tr.appendChild(tdKey);
        tr.appendChild(tdValue);
        tr.appendChild(tdActions);
        mapNode.appendChild(tr);
    }
}

function compareFunction(a, b) {
    if (a === 'separator') {
        return -1;
    } else if (b === 'separator') {
        return 1;
    } else if (a === 'default') {
        return -1;
    } else if (b === 'default') {
        return 1;
    } else {
        return a.localeCompare(b);
    }
}