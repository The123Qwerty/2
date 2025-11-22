function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");
  this.sharingContainer = document.querySelector(".score-sharing");
  this.animationRunning = false;
  this.tileData = [
    ["2", 10000000, '#2170c4'],
    ["Z", 1000000000, '#2f88ff'],
    ["Y", 500000000, '#c05495'],
    ["X", 200000000, '#a179af'],
    ["W", 100000000, '#a1d206'],
    ["V", 50000000, '#aa665d'],
    ["U", 40000000, '#f3e7f1'],
    ["T", 35000000, '#e9ccea'],
    ["S", 30000000, '#8e69d9'],
    ["R", 25000000, '#883661'],
    ["Q", 20000000, '#906132'],
    ["P", 15000000, '#1c5e4f'],
    ["O", 10000000, '#8a85a7'],
    ["N", 5000000, '#2198d5'],
    ["M", 2500000, '#cc4f3c'],
    ["L", 1600000, '#1a519c'],
    ["K", 1000000, '#5fd65a'],
    ["J", 600000, '#a09940'],
    ["I", 400000, '#a684da'],
    ["H", 250000, '#229a39'],
    ["G", 180000, '#a6e7a9'],
    ["F", 120000, '#783205'],
    ["E", 75000, '#f8f5f3'],
    ["D", 50000, '#c6a182'],
    ["C", 30000, '#a4b9d2'],
    ["B", 15000, '#a1191d'],
    ["A", 10000, "#725e6b"],
    ["1.99", 1000000, '#b696af'],
    ["1.75", 80000, '#96b697'],
    ["1.5", 40000, '#705982'],
    ["1.4", 17500, '#825f59'],
    ["1.3", 9000, '#827f59'],
    ["1.2", 3000, '#679889'],
    ["1.1", 950, '#596b82'],
    ["1", 1, "#7c7f66"]
  ];
  this.secondaryTileRarity = [   
    ["Z", 1000000]
    ["Y", 100000],
    ["X", 80000],
    ["W", 60000],
    ["V", 40000],
    ["U", 20000],
    ["T", 10000],
    ["S", 7500],
    ["R", 5000],
    ["Q", 4000],
    ["P", 3000],
    ["O", 2500],
    ["N", 2000],
    ["M", 1500],
    ["L", 1000],
    ["K", 800],
    ["J", 600],
    ["I", 500], 
    ["H", 400],
    ["G", 300],
    ["F", 250],
    ["E", 160],
    ["D", 100],
    ["C", 50],
    ["B", 20],
    ["A", 10],
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
  if (!/[A-Z]/.test(tileText[0]))
    {
      bgColorsForThisTile.push(this.getTileColor(tileText));
    }
  else
  {
    for (let i = 0; i < tileText.length; i++)
    {
      bgColorsForThisTile.push(this.getTileColor(tileText[i]));
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
  if (!/[A-Z]/.test(fullText[0]))
  {
    for (let i = 0; i < this.tileData.length; i++)
      {
        if (this.tileData[i][0] == fullText)
        {
          rarity *= this.tileData[i][1];
          break;
        }
      }
  }
  else
  {
    for (let j = 0; j < fullText.length; j++)
    {
      if (j == 0)
      {
        for (let i = 0; i < this.tileData.length; i++)
        {
          if (this.tileData[i][0] == fullText[j])
          {
            rarity *= this.tileData[i][1];
            break;
          }
        }
      }
      else
      {
        for (let i = 0; i < this.secondaryTileRarity.length; i++)
        {
          if (this.secondaryTileRarity[i][0] == fullText[j])
          {
            rarity *= this.secondaryTileRarity[i][1];
            break;
          }
        }
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
