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
    const tileCount = {X: 28, Y: 18}; // Map width and height in tiles
    const playerStartPos = {X: 11, Y: 6};
    const gridRows = [];
    const dirtChance = 0.07;

    const _setTileCounts = () => {
        mapContainer.style.gridTemplateRows = `repeat(${tileCount.Y}, ${tileSize}px)`;
        mapContainer.style.gridTemplateColumns = `repeat(${tileCount.X}}, ${tileSize}px)`;
    };
    const _createGrid = () => {
        for (y = 1; y <= tileCount.Y; y++) {
            let gridRow = [];
            for (x = 1; x <= tileCount.X; x++) {
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
        for (y = 0; y < tileCount.Y; y++) {
            let gridRow = gridRows[y]; // Get row by grid y index
            for (x = 0; x < tileCount.X; x++) {
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
        tileSize,
        tileCount,
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
        if (pressedKey === moveUp && oldPos.Y !== 0) {
            newPos.Y = (pos.Y - 1);
        } else if (pressedKey === moveLeft && oldPos.X !== 0) {
            newPos.X = (pos.X - 1);
        } else if (pressedKey === moveDown && oldPos.Y < (Map.tileCount.Y - 1)) {
            newPos.Y = (pos.Y + 1);
        } else if (pressedKey === moveRight && oldPos.X < (Map.tileCount.X - 1)){
            newPos.X = (pos.X + 1);
        } else {
            console.log(`Invalid key input: "${pressedKey}"`);
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


