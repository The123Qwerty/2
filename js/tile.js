function Tile(position, value, text, id = -1) {
  this.x                = position.x;
  this.y                = position.y;
  this.value            = value;
  this.text             = text;
  this.id               = id;

  this.previousPosition = null;
  this.mergedFrom       = null; // Tracks tiles that merged together
}

Tile.prototype.savePosition = function () {
  this.previousPosition = { x: this.x, y: this.y };
};

Tile.prototype.updatePosition = function (position) {
  this.x = position.x;
  this.y = position.y;
};
