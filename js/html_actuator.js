function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");
  this.sharingContainer = document.querySelector(".score-sharing");
  this.animationRunning = false;
  this.discoveredTiles = window.localStorage.getItem("discoveredTiles") == undefined ? [] : window.localStorage.getItem("discoveredTiles");
  this.tileData = [
    ["3", 10000000, '#2170c4'],
    ["Z", 1000000000, '#2f88ff'],
    ["Y", 500000000, '#c05495'],
    ["X", 200000000, '#18bf95'],
    ["W", 100000000, '#21b616'],
    ["V", 50000000, '#854fba'],
    ["U", 40000000, '#f3e7f1', '#2170c4'],
    ["T", 35000000, '#e9ccea'],
    ["S", 30000000, '#8e69d9'],
    ["R", 26000000, '#883661'],
    ["Q", 20000000, '#906132'],
    ["P", 15000000, '#1c5e4f'],
    ["O", 10000000, '#d100c0'],
    ["N", 5000000, '#65bbe7'],
    ["M", 2500000, '#cc4f3c'],
    ["L", 1600000, '#1a519c'],
    ["K", 1200000, '#5fd65a'],
    ["J", 600000, '#1d6e91'],
    ["I", 400000, '#a684da'],
    ["H", 250000, '#229a39'],
    ["G", 180000, '#a6e7a9'],
    ["F", 120000, '#783205'],
    ["E", 75000, '#d98d5e'],
    ["D", 50000, '#c6a182'],
    ["C", 30000, '#a4b9d2'],
    ["B", 15000, '#843939'],
    ["A", 10000, "#725e6b"],
    [".", 4000000000, '#000000'],
    ['\xa0', 400000000, '#ffffff'],
    ["-", 40000000, '#00ff00'],
    ["⅌", 380000000, '#666666', '#ccffcc'],
    ["⅄", 360000000, '#666666', '#ccccff'],
    ["℈", 340000000, '#666666', '#ccffff'],
    ["ℨ", 320000000, '#666666', '#ffcccc'],
    ["⅏", 300000000, '#666666', '#ffffcc'],
    ["⁂", 1100000000, '#cccccc', '#cc33ff'],
    ["⁑", 111000000, '#cccccc', '#3399ff'],
    ["※", 11000000, '#cccccc', '#66ff99'],
    ["⁜", 1100000, '#cccccc', '#ffcc00'],
    ["🟐", 3000000000, '#807f5b', '#e28418'],
    ["🟂", 250000000, '#e03800', '#1c9fb0'],
    ["●", 75000000, '#5f7df7', '#daa520'],
    ["◆", 6000000, '#e3bdff'],
    ["▲", 1000000, '#bdbdbd'],
    ["■", 100000, '#00a8a5'],
    ["-98", 98000000000, '#000000', '#02ff70'],
    ["8", 550000000, '#0066ff', '#66ccff'],
    ["7", 440000000, '#00cc00', '#99ff99'],
    ["6", 330000000, '#ff9900', '#ffcc99'],
    ["5", 220000000, '#9933ff', '#ff99ff'],
    ["4", 110000000, '#3944db'],
    ["3.01", 101000000, '#ff0000', '#ffb8b8'],
    ["98", 98000000, '#02ff70', '#000000'],
    ["82", 25000000, '#a48158'],
    ["-3", 21000000, '#7a8f3b'],
    ["2.99", 2000000, '#2170c4', '#ffb8b8'],
    ["2.95", 999999, '#e6c698'],
    ["2.5", 500000, '#4a8cb0'],
    ["2", 150000, '#8f8ed2'],
    ["1.75", 80000, '#B691A7'],
    ["1.5", 40000, '#775591'],
    ["1.4", 17500, '#825f59'],
    ["1.3", 9000, '#96b697'],
    ["1.2", 3000, '#679889'],
    ["1.1", 950, '#596b82'],
    ["1", 1, "#7c7f66"]
  ];
  this.secondaryTileRarity = [   
    [".", 1000000000],
    ['\xa0', 100000000],
    ["-", 10000000],
    ["Z", 1000000],
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
    ["", 1]
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

HTMLActuator.prototype.setTileColor = function (tileText, inner, newTile, wrapper) {
  var bgColorsForThisTile = [];
  inner.style.color = '#f9f6f2';
  if (/\d/.test(tileText))
    {
      bgColorsForThisTile.push(this.getTileColor(tileText));
      if (this.getTileColor(tileText, true) != "")
      {
        inner.style.color = this.getTileColor(tileText, true);
      }
    }
  else
  {
    for (let i = 0; i < tileText.length; i++)
    {
      bgColorsForThisTile.push(this.getTileColor(tileText[i]));
      if (this.getTileColor(tileText[i], true) != "")
      {
        inner.style.color = this.getTileColor(tileText[i], true);
      }
    }
  }
  var lastColor = bgColorsForThisTile[bgColorsForThisTile.length - 1];
  
  if (bgColorsForThisTile.length == 2)
  {
    bgColorsForThisTile.unshift(bgColorsForThisTile[0]);
  }
  
  while (bgColorsForThisTile.length < 4)
  {
    bgColorsForThisTile.push(lastColor);
  }
  
  if (this.getTotalRarity(tileText) >= 1000000 && newTile)
  {
    if (this.getTotalRarity(tileText) >= 10000000000)
    {
      this.ultraRareAnimation(bgColorsForThisTile, inner, wrapper, tileText);
    }
    else
    {
      this.triggerRarityGlow(tileText, bgColorsForThisTile);
    }
  }
  
  inner.style.background = 'linear-gradient(to right, ' + bgColorsForThisTile[0] + ', ' + bgColorsForThisTile[1] + ', ' + bgColorsForThisTile[2] + ', ' + bgColorsForThisTile[3] + ')';
}

HTMLActuator.prototype.updateDiscoveredTiles = function(inner, text)
{
  if (!this.discoveredTiles.includes("|"))
  {
    console.log("Discovered tiles didn't follow format: " + this.discoveredTiles + ". Currently trying to add " + text);
    this.discoveredTiles = ("|" + text + "|");
    console.log("Fixed by setting it to " + this.discoveredTiles);
    window.localStorage.setItem("discoveredTiles", this.discoveredTiles);
    this.newTilePopup(inner, text);
  }
  else
  {
    if (this.discoveredTiles[0] != "|")
    {
      this.discoveredTiles = "|" + this.discoveredTiles;
      window.localStorage.setItem("discoveredTiles", this.discoveredTiles);
    }
    if (!this.discoveredTiles.includes("|" + text + "|"))
    {
       console.log("New tile discovered: " + text + ". Current discovered tiles: " + this.discoveredTiles);
       try
       {
         this.discoveredTiles += (text + "|");
       }
       catch
       {
         alert("Apparently this is not a list: " + this.discoveredTiles.toString())
       }
       window.localStorage.setItem("discoveredTiles", this.discoveredTiles);
       this.newTilePopup(inner, text);
    }
    else
    {
      console.log("Not a new tile because " + this.discoveredTiles + " contains " + "|" + text + "|");
    }
  }
}

HTMLActuator.prototype.newTilePopup = function(inner, text)
{
  const displayTile = document.createElement("div");
  const rarityBox = document.createElement("div");
  rarityBox.style.position = 'absolute';
  rarityBox.style.left = (window.innerWidth/2 - 150) + "px";
  rarityBox.style.top = '0%';
  rarityBox.style.width = '300px';
  rarityBox.style.height = '80px';
  rarityBox.style.zIndex = '101';
  rarityBox.style.borderRadius = '0px 0px 6px 6px';
  rarityBox.style.background = '#857e77';
  rarityBox.style.fontWeight = 'bold';
  rarityBox.style.textAlign = 'center';
  rarityBox.style.fontSize = '23px';
  rarityBox.style.color = '#f9f6f2';
  rarityBox.style.padding = '10px 10px';
  rarityBox.textContent = "New tile!";
  rarityBox.style.display = "inline-block";
  rarityBox.style.verticalAlign = "middle";
  rarityBox.style.opacity = '1';
  rarityBox.style.animation = 'fade-in 3s ease 6s';
  var temp = inner.cloneNode(true);
  displayTile.appendChild(temp);
  displayTile.classList.add("tile");
  displayTile.style.position = 'absolute';
  displayTile.style.left = '5%';
  displayTile.style.transform = 'scale(1)';
  displayTile.style.zIndex = '101';
  displayTile.style.opacity = '1';
  displayTile.style.display = "inline-block";
  displayTile.style.verticalAlign = "middle";
  document.body.appendChild(rarityBox);
  this.animationRunning = true;
  setTimeout(() => {rarityBox.textContent = "1 in " + this.addCommas(this.getTotalRarity(text)); rarityBox.appendChild(displayTile); rarityBox.style.textAlign = 'right';}, 2000);
  setTimeout(() => {this.animationRunning = false; displayTile.remove(); rarityBox.remove();}, 6000);
}

HTMLActuator.prototype.getTileColor = function(text, font = false)
  {
    for (let i = 0; i < this.tileData.length; i++)
    {
      if (this.tileData[i][0] == text)
      {
        if (font)
        {
          if (this.tileData[i].length < 4)
          {
            return "";
          }
          else
          {
            return this.tileData[i][3];
          }
        }
        return this.tileData[i][2];
      }
    }
  }

HTMLActuator.prototype.getTotalRarity = function (fullText) {
  var rarity = 1;
  if (/\d/.test(fullText))
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
  r.style.setProperty('--tileColor4', bgColors[3]);
  var q = document.querySelector('html');
  q.classList.remove("rarityGlow");
  void q.offsetWidth;
  q.classList.add("rarityGlow");
  q.style.setProperty('--tileColor1', bgColors[0]);
  q.style.setProperty('--tileColor2', bgColors[1]);
  q.style.setProperty('--tileColor3', bgColors[2]);
  q.style.setProperty('--tileColor4', bgColors[3]);
  this.animationRunning = true;
  setTimeout(() => {this.animationRunning = false;}, 3000);
}

HTMLActuator.prototype.superRareTileReveal = function (inner, wrapper, text) {
  const displayTile = document.createElement("div");
  const rarityBox = document.createElement("div");
  rarityBox.style.position = 'absolute';
  rarityBox.style.left = (window.innerWidth/2 - 185) + "px";
  rarityBox.style.top = '65%';
  rarityBox.style.width = '350px';
  rarityBox.style.zIndex = '101';
  rarityBox.style.borderRadius = '6px';
  rarityBox.style.background = '#857e77';
  rarityBox.style.fontWeight = 'bold';
  rarityBox.style.textAlign = 'center';
  rarityBox.style.fontSize = '30px';
  rarityBox.style.color = '#f9f6f2';
  rarityBox.style.padding = '30px';
  rarityBox.textContent = "Rarity: 1 in " + this.addCommas(this.getTotalRarity(text));
  rarityBox.style.opacity = '0';
  rarityBox.style.animation = 'fade-in 3s ease 5s';
  var temp = inner.cloneNode(true);
  displayTile.appendChild(temp);
  displayTile.classList.add("tile");
  displayTile.style.position = 'absolute';
  displayTile.style.left = '50%';
  displayTile.style.top = '40%';
  displayTile.style.transform = 'scale(4)';
  displayTile.style.zIndex = '101';
  displayTile.style.opacity = '0';
  displayTile.style.animation = 'fade-in 3s ease 2s';
  displayTile.style.animationFillMode = 'forwards';
  const blackLayer = document.createElement("div");
  blackLayer.style.position = 'absolute';
  blackLayer.style.background = 'rgba(0, 0, 0, 0.7)';
  blackLayer.style.left = '0px';
  blackLayer.style.top = '0px';
  blackLayer.style.width = '100vw';
  blackLayer.style.height = '100vh';
  blackLayer.style.zIndex = '100';
  document.body.appendChild(rarityBox);
  if (this.getTotalRarity(text) < 10000000000)
  {
    document.body.appendChild(blackLayer);
  }
  document.body.appendChild(displayTile);
  this.animationRunning = true;
  setTimeout(() => {this.animationRunning = false; blackLayer.remove(); displayTile.remove(); rarityBox.remove(); this.tileContainer.appendChild(wrapper); this.updateDiscoveredTiles(inner, text);}, 8000);
}

HTMLActuator.prototype.ultraRareAnimation = function (bgColors, inner, wrapper, text) {
  var r = document.querySelector('body');
  wrapper.appendChild(inner);
  r.style.setProperty('--tileColor1', bgColors[0]);
  r.style.setProperty('--tileColor2', bgColors[1]);
  r.style.setProperty('--tileColor3', bgColors[2]);
  r.style.setProperty('--tileColor4', bgColors[3]);
  var g = r.getElementsByClassName("game-container")[0];
  var fakeBoard = g.cloneNode(true);
  fakeBoard.style.position = 'absolute';
  fakeBoard.style.zIndex = '102';
  fakeBoard.style.animation = 'rotateBoard 5s ease-in 2s forwards';
  fakeBoard.style.transformOrgin = 'center';
  fakeBoard.style.left = (window.innerWidth/2 - 300) + "px";
  fakeBoard.style.top = '20%';
  const blackLayer = document.createElement("div");
  blackLayer.style.position = 'absolute';
  blackLayer.style.background = 'rgba(255, 255, 255, 1)';
  blackLayer.style.left = '0px';
  blackLayer.style.top = '0px';
  blackLayer.style.width = '100vw';
  blackLayer.style.height = '100vh';
  blackLayer.style.zIndex = '100';
  const blackLayer2 = document.createElement("div");
  blackLayer2.style.position = 'absolute';
  blackLayer2.style.background = 'conic-gradient(white 35deg, black 45deg, white 55deg, white 95deg, black 105deg, white 115deg, white 155deg, black 165deg, white 175deg, white 215deg, black 225deg, white 235deg, white 275deg, black 285deg, white 295deg, white 335deg, black 345deg, white 355deg)';
  blackLayer2.style.left = '0px';
  blackLayer2.style.top = '0px';
  blackLayer2.style.width = '100vw';
  blackLayer2.style.height = '100vh';
  blackLayer2.style.zIndex = '101';
  blackLayer2.style.animation = 'flash 3s ease-out 7s forwards';
  blackLayer2.style.transformOrgin = 'center';
  document.body.appendChild(blackLayer);
  document.body.appendChild(blackLayer2);
  document.body.appendChild(fakeBoard);
  this.animationRunning = true;
  setTimeout(() => {this.superRareTileReveal(inner, wrapper, text);}, 8000);
  setTimeout(() => {blackLayer.remove(); blackLayer2.remove(); fakeBoard.remove();}, 16000);
}

HTMLActuator.prototype.addCommas = function (number) {
  var result = "";
  var k = 0;
  var string = number.toString();
  for (let i = string.length - 3; i > 0; i -= 3)
  {
    result = "," + string.substring(i, i + 3) + result;
    k = i - 1;
  }
  result = string.substring(0, k + 1) + result;
  if (string == "950")
  {
    return string;
  }
  return result;
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

  if (tile.text.length > 3)
  {
    if (tile.text.includes("."))
    {
      inner.style.fontSize = "22px";
    }
    else
    {
      inner.style.fontSize = "18px";
    }
  }
  if (tile.text.length == 3 && !(tile.text.includes(".")))
  {
    inner.style.fontSize = "25px";
  }

  this.setTileColor(tile.text, inner, classes.includes("tile-new"), wrapper);

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  if (classes.includes("tile-new") && this.getTotalRarity(tile.text) >= 100000000 && this.getTotalRarity(tile.text) < 10000000000)
  {
    setTimeout(() => {this.superRareTileReveal(inner, wrapper, tile.text);}, 3000);
  }
  else
  {
    if (!(classes.includes("tile-new")) || this.getTotalRarity(tile.text) < 10000000000)
    {
      // Put the tile on the board
      this.tileContainer.appendChild(wrapper);
    }
  }
  if (classes.includes("tile-new"))
  {
    if (this.getTotalRarity(tile.text) < 1000000)
    {
      this.updateDiscoveredTiles(inner, tile.text);
    }
    if (this.getTotalRarity(tile.text) < 100000000 && this.getTotalRarity(tile.text) >= 1000000)
    {
      setTimeout(() => {this.updateDiscoveredTiles(inner, tile.text);}, 3000);
    }
  }
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
