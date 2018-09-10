var view = {
  displayMessage: function (msg) {
    var messageArea = document.getElementById('messageArea');
    messageArea.innerHTML = msg;
  },

  displayHit: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute('class', 'hit');
  },

  displayMiss: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute('class', 'miss');
  }
};

var model = {
  boardSize: 7,
  numShips: 3,
  shipLength: 3,
  shipsSunk: 0,
  prevGuessess: [],
  ships: [{
    locations: [0, 0, 0], // ship 1
    hits: ['', '', '']
  },

  {
    locations: [0, 0, 0], // ship 2
    hits: ['', '', '']
  },

  {
    locations: [0, 0, 0], // ship 3
    hits: ['', '', '']
  }
  ],

  fire: function (guess) {
    if (this.prevGuessess.indexOf(guess) >= 0) {
      return;
    }
    this.prevGuessess.push(guess);

    for (let i = 0; i < this.shipLength; i++) {
      var ship = this.ships[i];
      var shiplocation = ship.locations.indexOf(guess);


      if (shiplocation >= 0) {
        ship.hits[shiplocation] = 'hit';
        view.displayMessage("It's a Hit!");
        view.displayHit(guess);
        if (this.isSunk(ship)) {
          view.displayMessage('You sunk my battleship!');
          this.shipsSunk++;
        }
        console.log(`Number of ships sunk: ${this.shipsSunk}`)
        return true;
      }
    }

    view.displayMessage('You missed');
    view.displayMiss(guess);
    return false;
  },
  isSunk: function (ship) {
    for (var i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== 'hit') {
        return false;
      }
    }
    return true;
  },


  generateShipLocation: function () {
    for (let i = 0; i < this.numShips; i++) {
      do {
        var locations = this.generateShip();
      } while (this.collision(locations));
      this.ships[i].locations = locations;
    }
  },
  generateShip: function () {
    var newShipLocation = [];
    var direction = Math.floor(Math.random() * 2);
    if (direction === 1) {
      // Generate starting location for horizontal ship
      var row = Math.floor(Math.random() * this.boardSize);
      var col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    } else {
      // Generate starting location for vertical ship
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
      col = Math.floor(Math.random() * this.boardSize);
    }

    for (var i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        // add new location to array for horizontal ship
        newShipLocation.push(row + '' + (col + i));
      } else {
        // add new location to array for vertical ship
        newShipLocation.push((row + i) + '' + col);
      }
    }

    return newShipLocation;
  },

  collision: function (locations) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = model.ships[i];
      for (var j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  }

};


// Get and process the player’s guess (like “A0” or “B1”). Make sure its valid.
// Keep track of the number of guesses.
// Ask the model to update itself based on the latest guess.
// Determine when the game is over (that is, when all ships have been sunk).

var controller = {
  guesses: 0,
  parseGuess: function (guess) { // guess is D3 for example
    var guess = guess.toUpperCase();
    var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

    if (guess === null || guess.length !== 2) {
      alert('Please enter a valid guess');
    } else {
      firstChar = guess.charAt(0); // D
      var row = alphabet.indexOf(firstChar);
    } // row = index of D which is 3
    var column = guess.charAt(1); // 3

    if (isNaN(row) || isNaN(column)) { // if row or column is not a number
      alert("Oops this value isn't on the board");
    } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
      // if row or column is greater than 0 or greater than the size of the board
      alert('This value is off the board');
    } else {
      return row + column;
    }
    return null;
  },

  fireGuess: function (guess) {
    var location = this.parseGuess(guess);
    if (location) {
      this.guesses++;
      var hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage('You sank all my ships in ' + this.guesses + ' guesses!');
      }
    }
  }

};

function init () {
  var firebutton = document.getElementById('firebutton');
  firebutton.onclick = handleFireButton;
  var guessinput = document.getElementById('guessinput');
  guessinput.onkeypress = handleKeyPress;

  model.generateShipLocation();
}

function handleFireButton () {
  var input = document.getElementById('guessinput');
  var guess = input.value;
  controller.fireGuess(guess);

  guess.value = ' ';
}

function handleKeyPress (e) {
  var fireButton = document.getElementById('firebutton');
  if (e.keyCode === 13) {
    fireButton.onclick();
    return false;
  }
}

document.getElementById('resetbutton').addEventListener('click', function () {
  window.location.reload();
})



window.onload = init;
