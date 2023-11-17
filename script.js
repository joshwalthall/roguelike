import { Map } from "./map.js";

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

// const Map = (function () {
//     const tileSize = 32; // Will be converted to pixels
//     const tileCount = {X: 38, Y: 26}; // Map width and height in tiles
//     const xLimit = {left: 0, right: (tileCount.X - 1)};
//     const yLimit = {top: 0, bottom: (tileCount.Y - 1)};
//     const playerStartPos = {X: 11, Y: 6};
//     const gridRows = [];
//     const dirtChance = 0.13;
//     const wallChance = 0.1;

//     const _setTileCounts = () => {
//         mapContainer.style.gridTemplateRows = `repeat(${tileCount.Y}, ${tileSize}px)`;
//         mapContainer.style.gridTemplateColumns = `repeat(${tileCount.X}}, ${tileSize}px)`;
//     };
//     const _createGrid = () => {
//         for (y = 1; y <= tileCount.Y; y++) {
//             let gridRow = [];
//             for (x = 1; x <= tileCount.X; x++) {
//                 let tileDiv = document.createElement('div');
//                 tileDiv.style.gridArea = `${y} / ${x} / ${y+1} / ${x+1}`;
//                 tileDiv.style.width = `${tileSize}px`;
//                 tileDiv.style.height = `${tileSize}px`;
//                 tileDiv.classList.add('grid-tile');
//                 mapContainer.appendChild(tileDiv);
//                 const tile = {
//                     div: tileDiv,
//                     img: null,
//                     obstacles: [],
//                     constructs: [],
//                     actors: [],
//                     items: [],
//                     walkable: true,
//                     baseImgSrc: "",
//                     displayImgSrc: "",
//                 };
//                 gridRow.push(tile);
//             };
//             gridRows.push(gridRow);
//         };
//     };
//     const _populateGrid = () => {
//         for (y = 0; y < tileCount.Y; y++) {
//             let gridRow = gridRows[y]; // Get row by grid y index
//             for (x = 0; x < tileCount.X; x++) {
//                 let tile = gridRow[x]
//                 let tileDiv = tile.div; // Get div by row x index
//                 let tileImage = new Image(tileSize, tileSize);
//                 tile.img = tileImage;
//                 let baseImgSrc = "";
//                 let randomNumber = Math.random();                
//                 if (randomNumber <= wallChance) {
//                     let wallTile = Obstacle("wall", wallImgSrc, {X:x,Y:y});
//                     tile.obstacles.push(wallTile);
//                     tile.walkable = false;
//                     baseImgSrc = wallTile.imgSrc;
//                 } else if (randomNumber <= dirtChance) {
//                     baseImgSrc = dirtImgSrc;
//                 } else {
//                     baseImgSrc = blankImgSrc;
//                 };
//                 tile.baseImgSrc = baseImgSrc;
//                 tile.displayImgSrc = tile.baseImgSrc;
//                 tileImage.src = tile.displayImgSrc;
//                 tileDiv.appendChild(tileImage);
//             };
//         };
//     };
//     const _updateTileImg = (tile, newImgSrc) => {
//         tile.displayImgSrc = newImgSrc;
//         tile.img.src = tile.displayImgSrc;
//     };
//     const getTile = (tilePos) => {
//         return gridRows[tilePos.Y][tilePos.X];
//     };
//     const tileWalkable = (tile) => {
//         let result = true;
//         let blocker = null;
//         for (x = 0; x < tile.obstacles.length; x++) {
//             let obstacle = tile.obstacles[x];
//             if (obstacle.walkable === false) {
//                 result = false;
//                 blocker = obstacle;
//                 break;
//             };
//         };
//         if (result === true) {
//             for (x = 0; x < tile.constructs.length; x++) {
//                 let construct = tile.constructs[x];
//                 if (construct.walkable === false) {
//                     result = false;
//                     blocker = construct;
//                     break;
//                 };
//             };
//         };
//         if (result === true) {
//             for (x = 0; x < tile.actors.length; x++) {
//                 let actor = tile.actors[x];
//                 if (actor.walkable === false) {
//                     result = false;
//                     blocker = actor;
//                     break;
//                 };
//             };
//         };

//         return {result, blocker};
//     };
//     const removeEntity = (entity, listName, tilePos) => {
//         let tile = getTile(tilePos);
//         let entList = tile[listName];
//         if (entList.includes(entity) === true) {
//             let entIndex = entList.indexOf(entity);
//             entList.splice(entIndex, 1); // Remove entity from tile list
//         };
//         _updateTileImg(tile, tile.baseImgSrc);
//         return;
//     };
//     const addEntity = (entity, listName, tilePos) => {
//         let tile = getTile(tilePos);
//         let entList = tile[listName];
//         if (entList.includes(entity) === false) {
//             entList.push(entity);
//         };
//         _updateTileImg(tile, entity.imgSrc);
//         return;
//     };
//     const initializeGrid = () => {
//         _setTileCounts();
//         _createGrid();
//         _populateGrid();
//     };

//     return {
//         tileSize,
//         tileCount,
//         xLimit,
//         yLimit,
//         playerStartPos,
//         initializeGrid,
//         getTile,
//         tileWalkable,
//         removeEntity,
//         addEntity,
//     };
// })();

const Entity = (entName, entImgSrc, entPos = {X:0,Y:0}) => {
    let name = entName;
    let imgSrc = entImgSrc;
    let walkable = false;
    let pos = entPos;

    return {
        name,
        imgSrc,
        walkable,
        pos,
    };
};
const Obstacle = (obsName, obsImgSrc, obsPos) => {
    let {name, imgSrc, walkable, pos} = Entity(obsName, obsImgSrc, obsPos);

    return {
        name,
        imgSrc,
        walkable,
        pos,
    };
};
const Construct = (conName, conImgSrc) => {
    const name = conName;
    const imgSrc = conImgSrc;
    let walkable = false;

    return {
        name,
        imgSrc,
        walkable,
    };
};
const Actor = (actorName, actorImgSrc, startPos, actorType) => {
    let {name, imgSrc, walkable, pos} = Entity(actorName, actorImgSrc);
    pos.X = startPos.X;
    pos.Y = startPos.Y;
    let type = actorType;

    const _setPos = (newPos) => {
        pos.X = newPos.X;
        pos.Y = newPos.Y;
    };
    const _validateMove = (prevPos, nextPos) => {
        let result = {newPos: prevPos, message: ""};
        if (nextPos.X < Map.xLimit.left || nextPos.X > Map.xLimit.right ||
            nextPos.Y < Map.yLimit.top || nextPos.Y > Map.yLimit.bottom) {
            result.message = "Invalid move: cannot move outside map";
        } else {
            let nextTile = Map.getTile(nextPos);
            let tileWalkable = Map.tileWalkable(nextTile);
            if (tileWalkable.result === false) {
                result.message = `Invalid move: ${tileWalkable.blocker.name} in the way`;
            } else if (tileWalkable.result === true) {
                result.newPos = nextPos;
                result.message = `${name} moved from X:${prevPos.X},Y:${prevPos.Y} to X:${nextPos.X},Y:${nextPos.Y}`;
            };
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
            Map.removeEntity(Player, "actors", prevPos);
            Map.addEntity(Player, "actors", validatedMove.newPos);
        };
    };

    return {
        name,
        type,
        pos,
        imgSrc,
        walkable,
        move,
    };
};

Map.initializeGrid(mapContainer);

const Player = Actor("Player", playerImgSrc, Map.playerStartPos, "player");
Map.addEntity(Player, "actors", Map.playerStartPos);
document.addEventListener("keydown", Player.move)


