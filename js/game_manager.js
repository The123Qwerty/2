function GameManager(size, InputManager, Actuator, ScoreManager) {
  this.size         = size; // Size of the grid
  this.inputManager = new InputManager;
  this.scoreManager = new ScoreManager;
  this.actuator     = new Actuator;

  this.startTiles   = 1;
  this.ids          = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];

  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));
  this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));

  this.setup();
}

// Restart the game
GameManager.prototype.restart = function () {
  this.actuator.continue();
  this.setup();
};

// Keep playing after winning
GameManager.prototype.keepPlaying = function () {
  this.keepPlaying = true;
  this.actuator.continue();
};

GameManager.prototype.isGameTerminated = function () {
  if (this.over || (this.won && !this.keepPlaying)) {
    return true;
  } else {
    return false;
  }
};

// Set up the game
GameManager.prototype.setup = function () {
  this.grid        = new Grid(this.size);

  this.score       = 0;
  this.over        = false;
  this.won         = false;
  this.keepPlaying = false;

  // Add the initial tiles
  this.addStartTiles();

  // Update the actuator
  this.actuate();
};

// Set up the initial tiles to start the game with
GameManager.prototype.addStartTiles = function () {
  for (var i = 0; i < this.startTiles; i++) {
    this.addRandomTile();
  }
};

// Adds a tile in a random position
GameManager.prototype.addRandomTile = function () {
  const alphabet = [" ", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  if (this.grid.cellsAvailable()) {
    //var value = Math.random() < 0.999999999 ? Math.random() < 0.999999998 ? Math.random() < 0.999999995 ? Math.random() < 0.99999999 ? Math.random() < 0.99999998 ? Math.random() < 0.999999975 ? Math.random() < 0.999999971428571 ? Math.random() < 0.9999999666 ? Math.random() < 0.99999996 ? Math.random() < 0.99999995 ? Math.random() < 0.9999999333 ? Math.random() < 0.9999999 ? Math.random() < 0.9999998 ? Math.random() < 0.9999996 ? Math.random() < 0.999999375 ? Math.random() < 0.999999 ? Math.random() < 0.9999984 ? Math.random() < 0.9999975 ? Math.random() < 0.999996 ? Math.random() < 0.99999444 ? Math.random() < 0.999991667 ? Math.random() < 0.99998666 ? Math.random() < 0.99998 ? Math.random() < 0.9999666 ? Math.random() < 0.9999333 ? Math.random() < 0.9999 ? 1: 99991: 99992: 99993: 99994: 99995: 99996: 99997: 99998: 99999: 999910: 999911: 999912: 999913: 999914: 999915: 999916: 999917: 999918: 999919: 999920: 999921: 999922: 999923: 999924: 999925: 999926;
    var value = this.randomTile(this.actuator.tileData);
    var text = value.toString();
    if (value > 99990) {
      text = alphabet[value % 10];
      if (value > 999900) { text = alphabet[value % 100]; }

      for (let i = 0; i < 2; i++) {
          //var tempText = Math.random() < 0.999999 ? Math.random() < 0.99999 ? Math.random() < 0.9999875 ? Math.random() < 0.99998333 ? Math.random() < 0.999975 ? Math.random() < 0.99995 ? Math.random() < 0.9999 ? Math.random() < 0.995 ? Math.random() < 0.9998 ? Math.random() < 0.99975 ? Math.random() < 0.99966666667 ? Math.random() < 0.9996 ? Math.random() < 0.9995 ? Math.random() < 0.9993333333 ? Math.random() < 0.999 ? Math.random() < 0.99875 ? Math.random() < 0.998333333 ? Math.random() < 0.998 ? Math.random() < 0.9975 ? Math.random() < 0.9966666667 ? Math.random() < 0.996 ? Math.random() < 0.99375 ? Math.random() < 0.99 ? Math.random() < 0.98 ? Math.random() < 0.95 ? Math.random() < 0.9 ? "": "A": "B": "C": "D": "E": "F": "G": "H": "I": "J": "K": "L": "M": "N": "O": "P": "Q": "R": "S": "T": "U": "V": "W": "X": "Y": "Z";
          var tempText = this.randomTile(this.actuator.secondaryTileRarities);
          if (tempText == "") {break;}
          text += tempText;
        }
    }

    //Assign the first available id and mark it as taken
    var id = -1;
    for (let i = 0; this.ids[i]; i++)
    {
      id = i;
    }
    id++;
    this.ids[id] = true;
    id++;
    
    var tile = new Tile(this.grid.randomAvailableCell(), value, text, id);
    
    this.grid.insertTile(tile);
    this.score += 1;
  }
};

GameManager.prototype.randomTile = function (list) {
    for (let i = 0; i < list.length; i++)
    {
      if (!Math.random() < 1 - (1 / list[i][1]))
      {
        return list[i][0];
      }
    }
};

// Sends the updated grid to the actuator
GameManager.prototype.actuate = function () {
  if (this.scoreManager.get() < this.score) {
    this.scoreManager.set(this.score);
  }

  this.actuator.actuate(this.grid, {
    score:      this.score,
    over:       this.over,
    won:        this.won,
    bestScore:  this.scoreManager.get(),
    terminated: this.isGameTerminated()
  });

};

// Save all tile positions and remove merger info
GameManager.prototype.prepareTiles = function () {
  this.grid.eachCell(function (x, y, tile) {
    if (tile) {
      tile.mergedFrom = null;
      tile.savePosition();
    }
  });
};

// Move a tile and its representation
GameManager.prototype.moveTile = function (tile, cell) {
  this.grid.cells[tile.x][tile.y] = null;
  this.grid.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);
};

// Move tiles on the grid in the specified direction
GameManager.prototype.move = function (direction) {
  // 0: up, 1: right, 2:down, 3: left
  var self = this;

  if (this.isGameTerminated() || this.actuator.animationRunning) return; // Don't do anything if the game's over or an animation is running

  var cell, tile;

  var vector     = this.getVector(direction);
  var traversals = this.buildTraversals(vector);
  var moved      = false;

  // Save the current tile positions and remove merger information
  this.prepareTiles();

  // Traverse the grid in the right direction and move tiles
  traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {
      cell = { x: x, y: y };
      tile = self.grid.cellContent(cell);

      if (tile) {
        var positions = self.findFarthestPosition(cell, vector);
        var next      = self.grid.cellContent(positions.next);

        // Only one merger per row traversal?
        if (next && next.text === tile.text && !next.mergedFrom) { 
          var merged = new Tile(positions.next, tile.value, tile.text, Math.min(next.id, tile.id));
          
          self.ids[Math.max(next.id, tile.id) - 1] = false;
          merged.mergedFrom = [tile, next];

          self.grid.insertTile(merged);
          self.grid.removeTile(tile);

          // Converge the two tiles' positions
          tile.updatePosition(positions.next);

          // The mighty 10 tile
          if (merged.value === 10) self.won = true;
          if (merged.value === 110) self.over = true;
        } else {
          self.moveTile(tile, positions.farthest);
        }

        if (!self.positionsEqual(cell, tile)) {
          moved = true; // The tile moved from its original cell!
        }
      }
    });
  });

  if (moved) {
    this.addRandomTile();

    if (!this.movesAvailable()) {
      this.over = true; // Game over!
    }

    this.actuate();
  }
};

// Get the vector representing the chosen direction
GameManager.prototype.getVector = function (direction) {
  // Vectors representing tile movement
  var map = {
    0: { x: 0,  y: -1 }, // up
    1: { x: 1,  y: 0 },  // right
    2: { x: 0,  y: 1 },  // down
    3: { x: -1, y: 0 }   // left
  };

  return map[direction];
};

// Build a list of positions to traverse in the right order
GameManager.prototype.buildTraversals = function (vector) {
  var traversals = { x: [], y: [] };

  for (var pos = 0; pos < this.size; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
  }

  // Always traverse from the farthest cell in the chosen direction
  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();

  return traversals;
};

GameManager.prototype.findFarthestPosition = function (cell, vector) {
  var previous;

  // Progress towards the vector direction until an obstacle is found
  do {
    previous = cell;
    cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (this.grid.withinBounds(cell) &&
           this.grid.cellAvailable(cell));

  return {
    farthest: previous,
    next: cell // Used to check if a merge is required
  };
};

GameManager.prototype.movesAvailable = function () {
  return this.grid.cellsAvailable() || this.tileMatchesAvailable();
};

// Check for available matches between tiles (more expensive check)
GameManager.prototype.tileMatchesAvailable = function () {
  var self = this;

  var tile;

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      tile = this.grid.cellContent({ x: x, y: y });

      if (tile) {
        for (var direction = 0; direction < 4; direction++) {
          var vector = self.getVector(direction);
          var cell   = { x: x + vector.x, y: y + vector.y };

          var other  = self.grid.cellContent(cell);

          if (other && other.value === tile.value) {
            return true; // These two tiles can be merged
          }
        }
      }
    }
  }

  return false;
};

GameManager.prototype.positionsEqual = function (first, second) {
  return first.x === second.x && first.y === second.y;
};



