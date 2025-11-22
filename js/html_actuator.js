function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");
  this.sharingContainer = document.querySelector(".score-sharing");
  this.animationRunning = false;
  this.tileData = [
    ["A", 10000, "#725e6b"],
    ["B", 15000, '#a1191d'],
    ["C", 30000, '#a4b9d2'],
    ["D", 50000, '#c6a182'],
    ["E", 75000, '#f8f5f3'],
    ["F", 120000, '#783205'],
    ["G", 180000, '#a6e7a9'],
    ["H", 250000, '#229a39'],
    ["I", 400000, '#a684da'],
    ["J", 600000, '#a09940'],
    ["K", 1000000, '#5fd65a'],
    ["L", 1600000, '#1a519c'],
    ["M", 2500000, '#cc4f3c'],
    ["N", 5000000, '#2198d5'],
    ["O", 10000000, '#8a85a7'],
    ["P", 15000000, '#1c5e4f'],
    ["Q", 20000000, '#906132'],
    ["R", 25000000, '#883661'],
    ["S", 30000000, '#8e69d9'],
    ["T", 35000000, '#e9ccea'],
    ["U", 40000000, '#f3e7f1'],
    ["V", 50000000, '#aa665d'],
    ["W", 100000000, '#a1d206'],
    ["X", 200000000, '#a179af'],
    ["Y", 500000000, '#c05495'],
    ["Z", 1000000000, '#2f88ff'],
    ["1", 1, "#7c7f66"]
  ];

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

HTMLActuator.prototype.setTileColor = function (tileText, inner, newTile) {
  var bgColorsForThisTile = [];
  for (let i = 0; i < tileText.length; i++)
  {
    bgColorsForThisTile.push(this.getTileColor(tileText[i]));
    if (!/[A-Z]/.test(tileText[i]))
    {
      break;
    }
  }
  var lastColor = bgColorsForThisTile[bgColorsForThisTile.length - 1];
  while (bgColorsForThisTile.length < 3)
  {
    bgColorsForThisTile.push(lastColor);
  }
  
  if (this.getTotalRarity(tileText) >= 1000000 && newTile)
  {
      this.triggerRarityGlow(tileText, bgColorsForThisTile);
  }
  
  inner.style.background = 'linear-gradient(to right, ' + bgColorsForThisTile[0] + ', ' + bgColorsForThisTile[1] + ', ' + bgColorsForThisTile[2] + ')';
}

HTMLActuator.prototype.getTileColor = function(text)
  {
    for (let i = 0; i < this.tileData.length; i++)
    {
      if (this.tileData[i][0] == text)
      {
        return this.tileData[i][2];
      }
    }
  }

HTMLActuator.prototype.getTotalRarity = function (fullText) {
  var rarity = 1;
  var i = 0;
  for (let j = 0; j < fullText.length; j++)
  {
    for (; i < this.tileData.length; i++)
    {
      if (this.tileData[i][0] == fullText[j])
      {
        rarity *= this.tileData[i][1];
        break;
      }
    }
  }
  return rarity;
}

HTMLActuator.prototype.triggerRarityGlow = function (tileText, bgColors) {
  var r = document.querySelector('body');
  r.classList.remove("rarityGlow");
  void r.offsetWidth;
  r.classList.add("rarityGlow");
  r.style.setProperty('--tileColor1', bgColors[0]);
  r.style.setProperty('--tileColor2', bgColors[1]);
  r.style.setProperty('--tileColor3', bgColors[2]);
  var q = document.querySelector('html');
  q.classList.remove("rarityGlow");
  void q.offsetWidth;
  q.classList.add("rarityGlow");
  q.style.setProperty('--tileColor1', bgColors[0]);
  q.style.setProperty('--tileColor2', bgColors[1]);
  q.style.setProperty('--tileColor3', bgColors[2]);
  this.animationRunning = true;
  setTimeout(() => {this.animationRunning = false;}, 4000);
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

  this.setTileColor(tile.text, inner, classes.includes("tile-new"));

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
