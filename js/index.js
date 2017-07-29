let symbols = ['bicycle', 'bicycle', 'leaf', 'leaf', 'cube', 'cube', 'anchor', 'anchor', 'paper-plane-o', 'paper-plane-o', 'bolt', 'bolt', 'bomb', 'bomb', 'diamond', 'diamond'],
		opened = [],
		match = 0,
		moves = 0,
		clicks = 0,
		$deck = jQuery('.deck'),
		$scorePanel = $('#score-panel'),
		$moveNum = $('.moves'),
		$ratingStars = $('i'),
		$restart = $('.restart'),
		timer;
		
let gameTimer = () => {
	let startTime = new Date().getTime();

	// Update the timer every second
	timer = setInterval(() => {

		let now = new Date().getTime();

		// Find the time elapsed between now and start
		let elapsed = now - startTime;

		// Calculate minutes and seconds
		let minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
		let seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

		// Add starting 0 if seconds < 10
		if (seconds < 10) {
			seconds = "0" + seconds;
		}

		let currentTime = minutes + ':' + seconds;

		// Update clock on game screen and modal
		$(".clock").text(currentTime);
	}, 750);
};

// Initialize Memory Game
let init = ()=> {
  let cards = shuffle(symbols);
  $deck.empty();
  match = 0;
  moves = 0;
  $moveNum.text('0');
  $ratingStars.removeClass('fa-star-o').addClass('fa-star');
	for (let i = 0; i < cards.length; i++) {
		$deck.append($('<li class="card"><i class="fa fa-' + cards[i] + '"></i></li>'))
	}
	addClkListener();
	$(".clock").text("0:00");
	
};


let shuffle = (array)=> {
  let index = array.length, temp, randomIndex;
  while (0 !== index) {
    randomIndex = Math.floor(Math.random() * index);
    index -= 1;
    temp = array[index];
    array[index] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
}

// Set Rating and final Score
let setRating =(moves)=> {
	let score = 3;
	if(moves <= 10) {
		$ratingStars.eq(3).removeClass('fa-star').addClass('fa-star-o');
		score = 3;
	} else if (moves > 10 && moves <= 14) {
		$ratingStars.eq(2).removeClass('fa-star').addClass('fa-star-o');
		score = 2;
	} else if (moves > 14) {
		$ratingStars.eq(1).removeClass('fa-star').addClass('fa-star-o');
		score = 1;
	}
	return { score };
};

// End The Memory Game
// Open Popup for showing required details 
// On configuaration, show default view
let endGame = (moves, score) => {
	let msg = score == 1 ? score + ' Star' :score +' Stars';
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Congratulations! You Won!',
		text: 'With ' + moves + ' Moves and ' + msg + '\n Woooooo!',
		type: 'success',
		confirmButtonColor: '#02ccba',
		confirmButtonText: 'Play again!'
	}).then((isConfirm)=> {
		if (isConfirm) {
			clicks = 0;
			clearInterval(timer);
			init();
		}
	})
}

let addClkListener = ()=> {
	// Card click listner for flipping card
	$deck.find('.card:not(".match, .open")').bind('click' , function() {
		clicks++ ;
		clicks == 1 ? gameTimer() :'';
		// Check for call to be heppend before all dom update
		if($('.show').length > 1) { return true; };
		let $this = $(this), card = $this.context.innerHTML;
		// Check if the player has clicked the same card
		if($this.hasClass('open')){ return true;};
	  $this.addClass('open show');
		opened.push(card);
		// Check with opened card
		// Add view changes in cards
		// Remove css animation classes
	  if (opened.length > 1) {
	    if (card === opened[0]) {
	      $deck.find('.open').addClass('match animated infinite rubberBand');
	      setTimeout(()=> {
	        $deck.find('.match').removeClass('open show animated infinite rubberBand');
	      }, 800);
	      match++;
	    } else {
	      $deck.find('.open').addClass('notmatch animated infinite wobble');
				setTimeout(()=> {
					$deck.find('.open').removeClass('animated infinite wobble');
				}, 800 / 1.5);
	      setTimeout(()=> {
	        $deck.find('.open').removeClass('open show notmatch animated infinite wobble');
	      }, 800);
	    }
	    opened = [];
			moves++;
			setRating(moves);
			$moveNum.html(moves);
	  }
		
		// End Memory Game if all cards matched
		if (match === 8) {
			setRating(moves);
			let score = setRating(moves).score;
			setTimeout(()=> {
				endGame(moves, score);
			}, 500);
	  }	
	});
};

// Bind the restart click event
// Restart the Memory Game
// Open Popup for showing required details 
// On configuaration, show default view
$restart.bind('click', ()=> {
  swal({
    allowEscapeKey: false,
    allowOutsideClick: false,
    title: 'Are you sure?',
    text: "Your progress will be Lost!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#02ccba',
    cancelButtonColor: '#f95c3c',
    confirmButtonText: 'Yes, Restart Game!'
  }).then((isConfirm)=> {
    if (isConfirm) {
			clicks = 0;
			clearInterval(timer);
      init();
    }
  })
});

// Initialize the Memory Game
init();