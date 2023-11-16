const gameContainer = document.getElementById('game-container');
const mapContainer = document.getElementById('map-container');

const blankImgSrc = "assets/img/blank.png";
const playerImgSrc = "assets/img/player_32px.png";
const dirtImgSrc = "assets/img/dirt.png";
const wallImgSrc = "assets/img/wall.png";

const moveUp = "w";
const moveLeft = "a";
const moveDown = "s";
const moveRight = "d";

const Map = (function () {
    const tileSize = 32; // Will be converted to pixels
    const tileCount = {X: 35, Y: 21}; // Map width and height in tiles
    const playerStartPos = {X: 11, Y: 6};
    const gridRows = [];
    const dirtChance = 0.13;
    const wallChance = 0.1;

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
                    obstacle: null,
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
                if (randomNumber <= wallChance) {
                    let wallTile = Obstacle("wall", wallImgSrc);
                    gridTile.obstacle = wallTile;
                    baseImgSrc = wallTile.imgSrc;
                } else if (randomNumber <= dirtChance) {
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
    const _updateTileImg = (tile, newImgSrc) => {
        tile.displayImgSrc = newImgSrc;
        tile.img.src = tile.displayImgSrc;
    };
    const getTile = (tilePos) => {
        return gridRows[tilePos.Y][tilePos.X];
    };
    const updateTileActor = (tilePos, tileActor) => {
        let tile = getTile(tilePos);
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
        getTile,
        updateTileActor,
    };
})();

const Actor = (actorType, actorImgSrc, startPos) => {
    const type = actorType;
    const pos = {X: startPos.X, Y: startPos.Y};
    let imgSrc = actorImgSrc;

    const _setPos = (newPos) => {
        pos.X = newPos.X;
        pos.Y = newPos.Y;
    };
    const _validateMove = (prevPos, nextPos) => {
        let xLimit = {left: 0, right: Map.tileCount.X};
        let yLimit = {top: 0, bottom: Map.tileCount.Y};
        let result = {newPos: prevPos, message: ""};
        let nextTile = Map.getTile(nextPos);
        if (nextPos.X < xLimit.left || nextPos.X >= xLimit.right ||
            nextPos.Y < yLimit.top || nextPos.Y >= yLimit.bottom) {
            result.message = "Invalid move: Cannot move outside map";
        } else if (nextTile.obstacle !== null && nextTile.obstacle.walkable === false) {
            result.message = `Invalid move: ${nextTile.obstacle.name} in the way`;
        } else {
            result.newPos = nextPos;
            result.message = `Moved from X:${prevPos.X},Y:${prevPos.Y} to X:${nextPos.X},Y:${nextPos.Y}`;
        };
        return result;
    };
    const move = (keyDown) => {
        pressedKey = `${keyDown.key}`.toLowerCase();
        let prevPos = {X: pos.X, Y: pos.Y};
        let nextPos = {X: pos.X, Y: pos.Y};
        if (pressedKey === moveUp) {
            nextPos.Y = (pos.Y - 1);
        } else if (pressedKey === moveLeft) {
            nextPos.X = (pos.X - 1);
        } else if (pressedKey === moveDown) {
            nextPos.Y = (pos.Y + 1);
        } else if (pressedKey === moveRight){
            nextPos.X = (pos.X + 1);
        } else {
            console.log(`Invalid key input: "${pressedKey}"`);
        };
        let validatedMove = _validateMove(prevPos, nextPos);
        _setPos(validatedMove.newPos);
        console.log(validatedMove.message);
        if (prevPos !== validatedMove.newPos) {
            Map.updateTileActor(prevPos, null);
            Map.updateTileActor(nextPos, Player);
        };
    };

    return {
        type,
        pos,
        imgSrc,
        move,
    };
};
const Obstacle = (obsName, obsImgSrc) => {
    const name = obsName;
    const imgSrc = obsImgSrc;
    let walkable = false;

    return {
        name,
        imgSrc,
        walkable,
    };
};

Map.initializeGrid();

const Player = Actor("player", playerImgSrc, Map.playerStartPos);
Map.updateTileActor(Player.pos, Player);
document.addEventListener("keydown", Player.move)


