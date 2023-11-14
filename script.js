const gameContainer = document.getElementById('game-container');
const mapContainer = document.getElementById('map-container');

const tileSize = 32; // Will be converted to pixels
const mapWidth = 28; // Map width in tiles
const mapHeight = 18; // Map height in tiles

const blankImgSrc = "assets/img/blank.png";
const playerImgSrc = "assets/img/player_32px.png";
const dirtImgSrc = "assets/img/dirt.png";

const Map = (function () {
    const tileCountX = 28;
    const tileCountY = 18;
    const gridRows = [];
    const dirtChance = 0.07;

    const _setTileCounts = () => {
        mapContainer.style.gridTemplateRows = `repeat(${tileCountY}, ${tileSize}px)`;
        mapContainer.style.gridTemplateColumns = `repeat(${tileCountX}}, ${tileSize}px)`;
    };
    const _createGrid = () => {
        for (y = 1; y <= tileCountY; y++) {
            let gridRow = [];
            for (x = 1; x <= tileCountX; x++) {
                let gridSquareDiv = document.createElement('div');
                gridSquareDiv.style.gridArea = `${y} / ${x} / ${y+1} / ${x+1}`;
                gridSquareDiv.style.width = `${tileSize}px`;
                gridSquareDiv.style.height = `${tileSize}px`;
                gridSquareDiv.classList.add('grid-square');
                mapContainer.appendChild(gridSquareDiv);
                const gridSquare = {
                    div: gridSquareDiv,
                    actor: null,
                    items: [],
                    object: null,
                    imgSrc: "",
                };
                gridRow.push(gridSquare);
            };
            gridRows.push(gridRow);
        };
    };
    const _populateGrid = () => {
        for (y = 0; y < tileCountY; y++) {
            let gridRow = gridRows[y]; // Get row by grid y index
            for (x = 0; x < tileCountX; x++) {
                let gridSquareDiv = gridRow[x].div; // Get div by row x index
                let randomNumber = Math.random();
                let tileImage = new Image(tileSize, tileSize);
                if (randomNumber <= dirtChance) {
                    tileImage.src = dirtImgSrc;
                } else {
                    tileImage.src = blankImgSrc;
                };
                gridSquareDiv.appendChild(tileImage);
            };
        };
    };
    const createGrid = () => {
        _setTileCounts();
        _createGrid();
        _populateGrid();
    };

    return {
        createGrid,
    };
})();

Map.createGrid();
