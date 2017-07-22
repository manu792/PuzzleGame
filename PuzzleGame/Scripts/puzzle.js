(function () {
    'use strict';

    var board = {
        //Variable to keep track of number of moves
        moves: 0,

        //Variable to track when user has clicked Shuffle
        hasBeenShuffled: false,

        // For each array element, the value is the number tile currently in that slot.
        // The value 0 represents the blank slot.
        state: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0],
        blankSlot: 15,  // Index of where the blank is, ie. the 0 value.

        completedState: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0],

        // For each array element, the value is a subarray that lists the adjacent slots.
        adjacent: [
                     [1, 4], [0, 2, 5], [1, 3, 6], [2, 7],
                     [0, 5, 8], [1, 4, 6, 9], [2, 5, 7, 10], [3, 6, 11],
                     [4, 9, 12], [5, 8, 10, 13], [6, 9, 11, 14], [7, 10, 15],
                     [8, 13], [9, 12, 14], [10, 13, 15], [11, 14]
                  ],


        renderTiles: function () {
            $('td').each(
              function renderOneSlot() {
                  var id = $(this).attr('id');
                  var idNum = id.substring(5);  // Strip off the leading "slot-" to extract just the number.
                  var tile = board.state[idNum];
                  if (tile === 0) {  // It's the blank slot.
                      $(this).addClass('blank');
                      $(this).text('');
                  }
                  else {
                      $(this).removeClass('blank');
                      $(this).text(tile);
                  }
                  $(this).removeClass('initial-setup');
                  $(this).removeClass('clickable');
              }
            );

            board.makeSlotsClickable(board.blankSlot);
        },

        makeSlotsClickable: function (idNum) {

            var movableSlots = board.adjacent[idNum];
            var selector = "";
            for (var i = 0; i < movableSlots.length; i++) {
                selector += ", #slot-" + movableSlots[i];
            }
            selector = selector.substring(2);  // Strip off the leading ", ".
            //$(selector).wrapInner('<a href="#"></a>');
            $(selector).addClass('clickable');
        },

        makeMove: function (tile) {

            var idNum = $(tile).attr('id').substring(5);
            var tileValue = board.state[idNum];
            board.state[idNum] = 0;
            board.state[board.blankSlot] = tileValue;
            board.blankSlot = idNum;

            board.renderTiles();
        },

        setSlotHandler: function () {
            $('td').on('click',
              function (event, shuffling) {
                  if (board.hasBeenShuffled && $(this).hasClass('clickable')) {
                      board.makeMove(this);
                      // While shuffling, don't check for whether the game is finished
                      if (!shuffling) {
                          board.incrementMoves();

                          if (board.isGameFinished()) {
                              board.userWon();
                          }
                      }
                  }
              }
            );
        },

        setModalHandlers: function(){
            $('#open-modal').on('click', function () {
                $('#modal').show();
            });

            $('#modal-close').on('click', function () {
                $('#modal').hide();
            });
        },

        isGameFinished: function () {

            for (var i = 0; i < board.state.length; i++) {

                if (board.state[i] != board.completedState[i]) return false;
            }

            return true;
        },

        userWon: function () {
            alert('Has ganado en ' + board.moves + ' movimientos!');
        },

        setShuffleHandler: function () {
            $('#shuffle-board').on('click',
              function shuffleTheBoard() {
                  // Initialize moves to 0
                  board.moves = -1;
                  board.hasBeenShuffled = true;

                  $('#moves-count').removeClass('moves-counter-hidden');
                  $('#moves-count').addClass('moves-counter-visible');

                  // Make a bunch of random moves to do the shuffling
                  // by simulating user clicks on the tiles.

                  // 100 moves seem to be an adequate number for scrambling
                  // the tiles from whatever state the board is in.

                  for (var i = 0; i < 100; i++) {
                      var movableTiles = board.adjacent[board.blankSlot];
                      var whichTile = Math.floor(Math.random() * movableTiles.length);
                      var tileIdNum = 'slot-' + movableTiles[whichTile];

                      var selector = '#' + tileIdNum;
                      $(selector).trigger('click', [true]);
                  }

                  board.incrementMoves();
              }
            )
        },

        incrementMoves: function(){
            //Increment moves by one
            board.moves++;
            $('#moves-count').text('Movimientos: ' + board.moves);
        },

        removeTextDecoration: function() {
            $('td').each(
              function removeTextDecorationTd() {
                  $('.clickable').addClass('initial-setup');
              }
            );
        }
    };

    // Execute the following when DOM is ready, ie. same as $(document).ready()
    $(board.renderTiles);
    $(board.setSlotHandler);
    $(board.setShuffleHandler);
    $(board.setModalHandlers);
    $(board.removeTextDecoration);
})();