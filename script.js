const gameContainer = document.getElementById('game-container');
const mapContainer = document.getElementById('map-container');

const blankImgSrc = "assets/img/blank.png";
const playerImgSrc = "assets/img/player_32px.png";
const dirtImgSrc = "assets/img/dirt.png";

const moveUp = "w";
const moveLeft = "a";
const moveDown = "s";
const moveRight = "d";

const Map = (function () {
    const tileSize = 32; // Will be converted to pixels
    const tileCountX = 28; // Map width in tiles
    const tileCountY = 18; // Map height in tiles
    const playerStartPos = {X: 11, Y: 6};
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
                let gridTileDiv = document.createElement('div');
                gridTileDiv.style.gridArea = `${y} / ${x} / ${y+1} / ${x+1}`;
                gridTileDiv.style.width = `${tileSize}px`;
                gridTileDiv.style.height = `${tileSize}px`;
                gridTileDiv.classList.add('grid-tile');
                mapContainer.appendChild(gridTileDiv);
                const gridTile = {
                    div: gridTileDiv,
                    img: null,
                    actor: null,
                    object: null,
                    items: [],
                    baseImgSrc: "",
                    displayImgSrc: "",
                };
                gridRow.push(gridTile);
            };
            gridRows.push(gridRow);
        };
    };
    const _populateGrid = () => {
        for (y = 0; y < tileCountY; y++) {
            let gridRow = gridRows[y]; // Get row by grid y index
            for (x = 0; x < tileCountX; x++) {
                let gridTile = gridRow[x]
                let gridTileDiv = gridTile.div; // Get div by row x index
                let tileImage = new Image(tileSize, tileSize);
                gridTile.img = tileImage;
                let baseImgSrc = "";
                let randomNumber = Math.random();                
                if (randomNumber <= dirtChance) {
                    baseImgSrc = dirtImgSrc;
                } else {
                    baseImgSrc = blankImgSrc;
                };
                gridTile.baseImgSrc = baseImgSrc;
                gridTile.displayImgSrc = gridTile.baseImgSrc;
                tileImage.src = gridTile.displayImgSrc;
                gridTileDiv.appendChild(tileImage);
            };
        };
    };
    const _getTile = (tilePos) => {
        return gridRows[tilePos.Y][tilePos.X];
    };
    const _updateTileImg = (tile, newImgSrc) => {
        tile.displayImgSrc = newImgSrc;
        tile.img.src = tile.displayImgSrc;
    };
    const updateTileActor = (tilePos, tileActor) => {
        let tile = _getTile(tilePos);
        tile.actor = tileActor;
        let newImgSrc = "";
        if (tileActor === null) {
            newImgSrc = tile.baseImgSrc;
        } else {
            newImgSrc = tileActor.imgSrc;
        };
        _updateTileImg(tile, newImgSrc);
    };
    const initializeGrid = () => {
        _setTileCounts();
        _createGrid();
        _populateGrid();
    };

    return {
        playerStartPos,
        initializeGrid,
        updateTileActor,
    };
})();

const Actor = (actorType, actorImgSrc, startPos) => {
    const type = actorType;
    const pos = {X: startPos.X, Y: startPos.Y};
    let imgSrc = actorImgSrc;

    const _setPos = (newPosX, newPosY) => {
        pos.X = newPosX;
        pos.Y = newPosY;
    };
    const move = (keyDown) => {
        pressedKey = `${keyDown.key}`.toLowerCase();
        let oldPos = {X: pos.X, Y: pos.Y};
        let newPos = {X: pos.X, Y: pos.Y};
        if (pressedKey === moveUp) {
            newPos.Y = (pos.Y - 1);
        } else if (pressedKey === moveLeft) {
            newPos.X = (pos.X - 1);
        } else if (pressedKey === moveDown) {
            newPos.Y = (pos.Y + 1);
        } else if (pressedKey === moveRight) {
            newPos.X = (pos.X + 1);
        } else {
            console.log(`Invalid key input: "${pressedKey}" not bound to any action`);
        };
        _setPos(newPos.X, newPos.Y);
        Map.updateTileActor(oldPos, null);
        Map.updateTileActor(newPos, Player);
    };

    return {
        type,
        pos,
        imgSrc,
        move,
    };
};

Map.initializeGrid();

const Player = Actor("player", playerImgSrc, Map.playerStartPos);
Map.updateTileActor(Player.pos, Player);
document.addEventListener("keydown", Player.move)


