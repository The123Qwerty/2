function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");
  this.sharingContainer = document.querySelector(".score-sharing");

  this.score = 0;
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
      } else if (metadata.won) {
        self.message(true); // You win!
      }
    }

  });
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continue = function () {
  if (typeof ga !== "undefined") {
    ga("send", "event", "game", "restart");
  }

  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.setTileColor = function (id, tileText, colorNum, inner) {
  var r = document.querySelector('html');
  if (tileText == "A") {
    r.style.setProperty('--tile' + id + 'bgcolor' + colorNum, '#725e6b');
  }
  if (tileText == "B") {
    r.style.setProperty('--tile' + id + 'bgcolor' + colorNum, '#a1191d');
  }
  if (tileText == "C") {
    r.style.setProperty('--tile' + id + 'bgcolor' + colorNum, '#a4b9d2');
  }
  if (tileText == "D") {
    r.style.setProperty('--tile' + id + 'bgcolor' + colorNum, '#c6a182');
  }
  if (tileText == "E") {
    r.style.setProperty('--tile' + id + 'bgcolor' + colorNum, '#f8f5f3');
  }
  if (tileText == "F") {
    r.style.setProperty('--tile' + id + 'bgcolor' + colorNum, '#783205');
  }
  if (tileText == "G") {
    r.style.setProperty('--tile' + id + 'bgcolor' + colorNum, '#a6e7a9');
  }
  if (tileText == "H") {
    r.style.setProperty('--tile' + id + 'bgcolor' + colorNum, '#229a39');
  }
  if (tileText == "I") {
    r.style.setProperty('--tile' + id + 'bgcolor' + colorNum, '#a684da');
  }
  if (tileText == "J") {
    r.style.setProperty('--tile' + id + 'bgcolor' + colorNum, '#a09940');
  }
  if (tileText == "K") {
    r.style.setProperty('--tile' + id + 'bgcolor' + colorNum, '#5fd65a');
  }
  if (tileText == "L") {
    r.style.setProperty('--tile' + id + 'bgcolor' + colorNum, '#1a519c');
  }
  if (tileText == "M") {
    r.style.setProperty('--tile' + id + 'bgcolor' + colorNum, '#cc4f3c');
  }
  if (tileText == "N") {
    r.style.setProperty('--tile' + id + 'bgcolor' + colorNum, '#2198d5');
  }
  if (tileText == "O") {
    r.style.setProperty('--tile' + id + 'bgcolor' + colorNum, '#8a85a7');
  }
  if (tileText == "P") {
    r.style.setProperty('--tile' + id + 'bgcolor' + colorNum, '#1c5e4f');
  }
  if (tileText == "Q") {
    r.style.setProperty('--tile' + id + 'bgcolor' + colorNum, '#906132');
  }
  if (tileText == "R") {
    r.style.setProperty('--tile' + id + 'bgcolor' + colorNum, '#883661');
  }
  if (tileText == "S") {
    r.style.setProperty('--tile' + id + 'bgcolor' + colorNum, '#8e69d9');
  }
  if (tileText == "T") {
    r.style.setProperty('--tile' + id + 'bgcolor' + colorNum, '#e9ccea');
  }
  if (tileText == "U") {
    r.style.setProperty('--tile' + id + 'bgcolor' + colorNum, '#f3e7f1');
  }
  if (tileText == "V") {
    r.style.setProperty('--tile' + id + 'bgcolor' + colorNum, '#aa665d');
  }
  if (tileText == "W") {
    r.style.setProperty('--tile' + id + 'bgcolor' + colorNum, '#a1d206');
  }
  if (tileText == "X") {
    r.style.setProperty('--tile' + id + 'bgcolor' + colorNum, '#a179af');
  }
  if (tileText == "Y") {
    r.style.setProperty('--tile' + id + 'bgcolor' + colorNum, '#c05495');
  }
  if (tileText == "Z") {
    r.style.setProperty('--tile' + id + 'bgcolor' + colorNum, '#2f88ff');
  }
  if (tileText == "1") {
    //r.style.setProperty('--tile' + id + 'bgcolor' + colorNum, '#7c7f66');
    inner.style.background = '#7c7f66';
    inner.style.color = '#000000';
  }

  if (colorNum == 1)
  {
    var color1 = getComputedStyle(r).getPropertyValue('--tile' + id + 'bgcolor1');
    r.style.setProperty('--tile' + id + 'bgcolor2', color1);
    r.style.setProperty('--tile' + id + 'bgcolor3', color1);
  }
  if (colorNum == 2)
  {
    var color2 = getComputedStyle(r).getPropertyValue('--tile' + id + 'bgcolor2');
    r.style.setProperty('--tile' + id + 'bgcolor3', color2);
  }
}

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + tile.id, positionClass];

  if (tile.value > 999999999999999999999999999999999999999999999) classes.push("tile-super");

  this.applyClasses(wrapper, classes);

  inner.classList.add("tile-inner");
  inner.textContent = tile.text;
  for (let i = 0; i < tile.text.length; i++)
    {
      this.setTileColor(tile.id, tile.text[i], i + 1, inner);
    }

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = score - this.score;
  this.score = score;

  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.message = function (won) {
  var type    = won ? "game-won" : "game-over";
  var message = won ? "You win!" : "Game over!";

  if (typeof ga !== "undefined") {
    ga("send", "event", "game", "end", type, this.score);
  }

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;

  this.clearContainer(this.sharingContainer);
  this.sharingContainer.appendChild(this.scoreTweetButton());
  twttr.widgets.load();
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};

HTMLActuator.prototype.scoreTweetButton = function () {
  var tweet = document.createElement("a");
  tweet.classList.add("twitter-share-button");
  tweet.setAttribute("href", "https://twitter.com/share");
  tweet.setAttribute("data-via", "fluff");
  tweet.textContent = "Tweet";

  var text = "My score ended up as " + this.score + " this on 10, a game where you " +
             "join numbers to get 10s! #10game";
  tweet.setAttribute("data-text", text);

  return tweet;
};
