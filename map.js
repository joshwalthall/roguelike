const Map = (function () {
    const mapContainer = null;
    const tileSize = 32; // Will be converted to pixels
    const tileCount = {X: 38, Y: 26}; // Map width and height in tiles
    const xLimit = {left: 0, right: (tileCount.X - 1)};
    const yLimit = {top: 0, bottom: (tileCount.Y - 1)};
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
                let tileDiv = document.createElement('div');
                tileDiv.style.gridArea = `${y} / ${x} / ${y+1} / ${x+1}`;
                tileDiv.style.width = `${tileSize}px`;
                tileDiv.style.height = `${tileSize}px`;
                tileDiv.classList.add('grid-tile');
                mapContainer.appendChild(tileDiv);
                const tile = {
                    div: tileDiv,
                    img: null,
                    obstacles: [],
                    constructs: [],
                    actors: [],
                    items: [],
                    walkable: true,
                    baseImgSrc: "",
                    displayImgSrc: "",
                };
                gridRow.push(tile);
            };
            gridRows.push(gridRow);
        };
    };
    const _populateGrid = () => {
        for (y = 0; y < tileCount.Y; y++) {
            let gridRow = gridRows[y]; // Get row by grid y index
            for (x = 0; x < tileCount.X; x++) {
                let tile = gridRow[x]
                let tileDiv = tile.div; // Get div by row x index
                let tileImage = new Image(tileSize, tileSize);
                tile.img = tileImage;
                let baseImgSrc = "";
                let randomNumber = Math.random();                
                if (randomNumber <= wallChance) {
                    let wallTile = Obstacle("wall", wallImgSrc, {X:x,Y:y});
                    tile.obstacles.push(wallTile);
                    tile.walkable = false;
                    baseImgSrc = wallTile.imgSrc;
                } else if (randomNumber <= dirtChance) {
                    baseImgSrc = dirtImgSrc;
                } else {
                    baseImgSrc = blankImgSrc;
                };
                tile.baseImgSrc = baseImgSrc;
                tile.displayImgSrc = tile.baseImgSrc;
                tileImage.src = tile.displayImgSrc;
                tileDiv.appendChild(tileImage);
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

        return {result, blocker};
    };
    const removeEntity = (entity, listName, tilePos) => {
        let tile = getTile(tilePos);
        let entList = tile[listName];
        if (entList.includes(entity) === true) {
            let entIndex = entList.indexOf(entity);
            entList.splice(entIndex, 1); // Remove entity from tile list
        };
        _updateTileImg(tile, tile.baseImgSrc);
        return;
    };
    const addEntity = (entity, listName, tilePos) => {
        let tile = getTile(tilePos);
        let entList = tile[listName];
        if (entList.includes(entity) === false) {
            entList.push(entity);
        };
        _updateTileImg(tile, entity.imgSrc);
        return;
    };
    const initializeGrid = (mapContainerDiv) => {
        mapContainer = mapContainerDiv;
        _setTileCounts();
        _createGrid();
        _populateGrid();
    };

    return {
        tileSize,
        tileCount,
        xLimit,
        yLimit,
        playerStartPos,
        initializeGrid,
        getTile,
        tileWalkable,
        removeEntity,
        addEntity,
    };
})();

export { Map };