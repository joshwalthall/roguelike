const gameContainer = document.getElementById('game-container');
const mapContainer = document.getElementById('map-container');

const blankImgSrc = "assets/img/blank.png";
const playerImgSrc = "assets/img/player_32px.png";
const dirtImgSrc = "assets/img/dirt.png";
const brickWallImgSrc = "assets/img/wall.png";
const doorImgSrc = "assets/img/door.png";

const moveUp = "w";
const moveLeft = "a";
const moveDown = "s";
const moveRight = "d";


const Entity = (entName, entImgSrc, entPos={X:0,Y:0}, entWalkable=false) => {
    let name = entName;
    let imgSrc = entImgSrc;
    let walkable = entWalkable;
    let pos = entPos;

    const getPos = () => {
        return pos;
    };
    const setPos = (newPos) => {
        pos.X = newPos.X;
        pos.Y = newPos.Y;
    };

    return {
        name,
        imgSrc,
        walkable,
        pos,
        getPos,
        setPos,
    };
};

const Floor = (floorName, floorImgSrc, floorPos={X:0,Y:0}, floorWalkable=true) => {
    let {name, imgSrc, walkable, pos, getPos, setPos} = Entity(floorName, floorImgSrc, floorPos, floorWalkable);
    const category = "floor";

    return {
        name,
        imgSrc,
        walkable,
        pos,
        category,
        getPos,
        setPos,
    };
};

const Obstacle = (obsName, obsImgSrc, obsPos={X:0,Y:0}) => {
    let {name, imgSrc, walkable, pos, getPos, setPos} = Entity(obsName, obsImgSrc, obsPos);
    const category = "obstacles";

    return {
        name,
        imgSrc,
        walkable,
        pos,
        category,
        getPos,
        setPos,
    };
};

const Construct = (conName, conImgSrc, conPos={X:0,Y:0}, conWalkable=false) => {
    let {name, imgSrc, walkable, pos, getPos, setPos} = Entity(conName, conImgSrc, conPos, conWalkable);
    const category = "constructs";
    
    return {
        name,
        imgSrc,
        walkable,
        pos,
        category,
        getPos,
        setPos,
    };
};

const Actor = (actorName, actorType, actorImgSrc, startPos={X:0,Y:0}) => {
    let {name, imgSrc, walkable, pos, getPos, setPos} = Entity(actorName, actorImgSrc);
    pos.X = startPos.X;
    pos.Y = startPos.Y;
    let type = actorType;
    const category = "actors";

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
        setPos(validatedMove.newPos);
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
        category,
        getPos,
        setPos,
        move,
    };
};

const Entities = {
    floors: {
        dirtFloor: function() {return Floor("dirt floor", dirtImgSrc)},
    },
    obstacles: {
        blank: function() {return Obstacle("blank", blankImgSrc)},
        brickWall: function() {return Obstacle("brick wall", brickWallImgSrc)},
    },
    constructs: {
        door: function() {return Construct("door", doorImgSrc)},
    },
    actors: {
        placeholder: function() {return "placeholder"},
    },
};

const Player = Actor("Player", "player", playerImgSrc);

// -=-=-=-=-=-=-= WORK IN PROGRESS =-=-=-=-=-=-=-=-
// const Action = (actName) => {
//     const name = actName;

//     return {
//         name,
//     };
// };

// const WalkAction = (actor, targetPos) => {
//     const {name} = Action("walk");

//     const analyze = () => {

//     };
// };


const Map = (function () {
    const tileSize = 32; // Will be converted to pixels
    const tileCount = {X: 38, Y: 28}; // Map width and height in tiles
    const xLimit = {left: 0, right: (tileCount.X - 1)};
    const yLimit = {top: 0, bottom: (tileCount.Y - 1)};
    const gridRows = [];

    const Tile = (tileDiv) => {
        const div = tileDiv;
        let img = new Image(tileSize, tileSize);
        let floor = null;
        let obstacles = [];
        let constructs = [];
        let actors = [];
        let items = [];
        let walkable = true;
        let baseImgSrc = null;
        let displayImgSrc = null;

        return {
            div,
            img,
            floor,
            obstacles,
            constructs,
            actors,
            items,
            walkable,
            baseImgSrc,
            displayImgSrc,
        }
    };
    const _setTileCounts = () => {
        mapContainer.style.gridTemplateRows = `repeat(${tileCount.Y}, ${tileSize}px)`;
        mapContainer.style.gridTemplateColumns = `repeat(${tileCount.X}}, ${tileSize}px)`;
    };
    const _createGrid = () => {
        for (y = 1; y <= tileCount.Y; y++) {
            let gridRow = [];
            for (x = 1; x <= tileCount.X; x++) {
                let tileDiv = document.createElement('div');
                const tile = Tile(tileDiv);
                tileDiv.style.gridArea = `${y} / ${x} / ${y+1} / ${x+1}`;
                tileDiv.style.width = `${tileSize}px`;
                tileDiv.style.height = `${tileSize}px`;
                tileDiv.classList.add('grid-tile');
                tileDiv.appendChild(tile.img);
                mapContainer.appendChild(tileDiv);
                gridRow.push(tile);
            };
            gridRows.push(gridRow);
        };
    };
    const _parseLevelText = (levelText) => {
        textRows = levelText.split("\n");
        let parsedText = [];
        for (i = 0; i < textRows.length; i++) {
            let textRow = textRows[i];
            let parsedRow = textRow.split("");
            parsedText.push(parsedRow);
        };
        return parsedText;
    };
    const _populateGrid = (levelText) => {
        const seed = _parseLevelText(levelText);
        console.log(`Populating grid with seed: ${seed}`);
        for (y = 0; y < seed.length; y++) {
            const seedRow = seed[y];
            console.log(`  - Processing seed row ${y}: ${seedRow}`);
            for (x = 0; x < seedRow.length; x++) {
                let tileSeed = seedRow[x];
                console.log(`  --- Processing tile seed ${x}: ${tileSeed}`);
                let tile = getTile({X:x,Y:y});
                console.log(`  --- Got tile: ${tile}`);
                if (tileSeed in tileIndex) {
                    let entities = tileIndex[tileSeed];
                    for (i = 0; i < entities.length; i++) {
                        let entity = entities[i];
                        let entCategory = entity.category
                        if (entCategory === "floor" && tile.floor !== null) {
                            break;
                        };
                        entity.setPos({X:x,Y:y});
                        if (entity.walkable === false) {tile.walkable = false};
                        if (tile.baseImgSrc === null) {tile.baseImgSrc = entity.imgSrc};
                        if (entCategory === "floor") {
                            tile[entCategory] = entity;
                        } else {
                            tile[entCategory].push(entity);
                        };
                    };
                };
                _updateTileImg({X:x,Y:y});
            };
        };
    };
    const _updateTileImg = (tilePos) => {
        let tile = getTile(tilePos);
        if (tile.actors.length > 0) {
            if (tile.actors.includes(Player)) {
                tile.img.src = Player.imgSrc;
            } else if (!tile.actors.includes(Player)) {
                tile.img.src = tile.actors.slice(-1).imgSrc;
            };
        } else if (tile.obstacles.length > 0) {
            tile.img.src = tile.obstacles[0].imgSrc;
        } else if (tile.items.length > 0) {
            tile.img.src = tile.items.slice(-1).imgSrc;
        } else {
            tile.img.src = tile.baseImgSrc;
        };
    };
    const getTile = (tilePos) => {
        return gridRows[tilePos.Y][tilePos.X];
    };
    const tileWalkable = (tile) => {
        let result = true;
        let blocker = null;
        for (x = 0; x < tile.obstacles.length; x++) {
            let obstacle = tile.obstacles[x];
            if (obstacle.walkable === false) {
                result = false;
                blocker = obstacle;
                break;
            };
        };
        if (result === true) {
            for (x = 0; x < tile.constructs.length; x++) {
                let construct = tile.constructs[x];
                if (construct.walkable === false) {
                    result = false;
                    blocker = construct;
                    break;
                };
            };
        };
        if (result === true) {
            for (x = 0; x < tile.actors.length; x++) {
                let actor = tile.actors[x];
                if (actor.walkable === false) {
                    result = false;
                    blocker = actor;
                    break;
                };
            };
        };
        tile.walkable = result;

        return {result, blocker};
    };
    const addEntity = (entity, category, tilePos) => {
        entity.pos = tilePos;
        let tile = getTile(tilePos);
        let entCategory = tile[category];
        if (entCategory.includes(entity) === false) {
            entCategory.push(entity);
            _updateTileImg(tilePos);
        };
        return;
    };
    const removeEntity = (entity, category, tilePos) => {
        let tile = getTile(tilePos);
        let entCategory = tile[category];
        if (entCategory.includes(entity) === true) {
            let entIndex = entCategory.indexOf(entity);
            entCategory.splice(entIndex, 1); // Remove entity from tile list
        };
        _updateTileImg(tilePos);
        return;
    };
    const tileIndex = {
        " ": [Entities.obstacles.blank()],
        "@": [Entities.floors.dirtFloor(), Player],
        ".": [Entities.floors.dirtFloor()],
        "#": [Entities.obstacles.brickWall()],
        "+": [Entities.constructs.door()],
    }
    const initializeGrid = () => {
        _setTileCounts();
        _createGrid();
        _populateGrid(Levels.level01);
    };

    return {
        tileSize,
        tileCount,
        xLimit,
        yLimit,
        getTile,
        tileWalkable,
        addEntity,
        removeEntity,
        tileIndex,
        initializeGrid,
    };
})();

const GameMaster = (function () {
    // Turn queue
    // Action requests
    // Action results
    // AI Director
})();

const Levels = {
    level00:
`######################################
#....................................#
#....................................#
#....................................#
#.......@............................#
#....................................#
#....................................#
#....................................#
#....................................#
#....................................#
#..............###.###...............#
#..............#.....#...............#
#..............#.....#...............#
#....................................#
#..............#.....#...............#
#..............#.....#...............#
#..............###.###...............#
#....................................#
#....................................#
#....................................#
#....................................#
#....................................#
#....................................#
#....................................#
#....................................#
#....................................#
#....................................#
######################################`,
    level01:
`                                      
 #################################### 
 #..................................# 
 #..................................# 
 #..................................# 
 #..................................# 
 #..................................# 
 #..................................# 
 #..................................# 
 #..................................# 
 #............###+###...............# 
 #............#.....#...............# 
 #............#.....#...............# 
 #............+..@..+...............# 
 #............#.....#...............# 
 #............#.....#...............# 
 #............###.###...............# 
 #..................................# 
 #..................................# 
 #..................................# 
 #..................................# 
 #..................................# 
 #..................................# 
 #..................................# 
 #..................................# 
 #..................................# 
 #################################### 
                                      `,
};

Map.initializeGrid();

document.addEventListener("keydown", Player.move)
