var Hangman = function(elem) {

    var alphabet = "abcdefghijklmnopqrstuvwxyz",
        request,
        word = "testin",
        word_length,
        difficulty = document.querySelector('input[name ="difficulty"]:checked').value,
        letters_guessed = [],
        displayed_word,
        lives_left = 7,
        game_complete = false;
    // create DOM
    var top_display = quickCreateElement("div", "top-display"),     
        DOM_displayed_word = quickCreateElement("div", "displayed-word"),
        DOM_lives_left = quickCreateElement("div", "lives-left"),
        DOM_game_message = quickCreateElement("div", "message"),
        buttons_section = quickCreateElement("div", "buttons-section"),
        letter_buttons = [];    
        
    // create buttons
    for (var i=0; i<26; i++) {
        letter_buttons.push(quickCreateElement("button", "letter-button", alphabet[i]));
    }
    
    // organise DOM       
    top_display.appendChild(DOM_displayed_word);
    top_display.appendChild(DOM_lives_left);
    top_display.appendChild(DOM_game_message);
    
    for (var i = 0; i < 26; i++) {
        buttons_section.appendChild(letter_buttons[i]);
    }
    
    function quickCreateElement(type, cls, id) {
        var ret = document.createElement(type);
        if (cls) { ret.classList.add(cls); }
        if (id) { ret.id = id; }
        return ret
    }
        
    function contains(arr, el) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == el) { return true }
        }
        return false
    };


    // PROCESS FUNCTIONS
    
    function reset () {
      myStickman = document.getElementById("stickman");
      context = myStickman.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
        while(elem.lastChild) {
            elem.removeChild(elem.firstChild);
        }

        
    };
    
    function getWord() {
        request = new XMLHttpRequest;
        request.open('GET', 'https://it3049c-hangman-service-kbravilsky.now.sh?difficulty='+difficulty);
        request.onload = function() {
            console.log(difficulty);
            if (request.status == 200){     
               const response = JSON.parse(request.responseText);
               
                word = response.word;
              
              console.log(word);
                loadInitialDOM();
                render();   
            }
           
        };
        request.onerror = function() {
            console.log('connection error');
        };
        request.send();     
    };
    

    
    function loadInitialDOM() {    
        elem.appendChild(top_display);
        elem.appendChild(buttons_section);
    };

    function render() {
        renderDisplayedWord();
        DOM_lives_left.innerHTML = "Lives left: " + lives_left;
        Result();
        if (game_complete) {
            DOM_game_message.innerHTML = game_complete;
        }
        renderButtons(game_complete);
    };

    function renderDisplayedWord() {
        displayed_word = "";
        for (var i = 0; i < word.length; i++) {
            if (contains(letters_guessed, word[i])) {
                displayed_word += word[i];
            }
            else {
                displayed_word += "_";
            }
            displayed_word += (i == word.length) ? "" : " " ;
        }
        DOM_displayed_word.innerHTML = displayed_word;
    };
    
    function Result() {
        if (!contains(displayed_word, "_")) {
            game_complete = "Congratulations! You correctly guessed the word " + word;
        }
        if (lives_left <= 0) {
            game_complete = "Bad luck, you lose! The correct word was " + word;
        }
    };

    function renderButtons(game_over) {
        for (var i = 0; i < 26; i++) {
            b = letter_buttons[i];
            b.innerHTML = "";
            b.removeEventListener("click", letter_select);
            b.innerHTML = alphabet[i];
            if (!game_over && !contains(letters_guessed, alphabet[i])) {
                b.addEventListener("click", letter_select);
            }
            else {
                b.classList.add("deactivated");
            }
        }
    };
    var animate = function () {
      var drawMe = lives_left ;
      drawArray[drawMe]();
      
    }
  canvas =  function(){

    myStickman = document.getElementById("stickman");
    context = myStickman.getContext('2d');
    context.beginPath();
    context.strokeStyle = "#fff";
    context.lineWidth = 2;
  };

  head = function(){
    myStickman = document.getElementById("stickman");
    context = myStickman.getContext('2d');
    context.beginPath();
    context.arc(60, 25, 10, 0, Math.PI*2, true);
    context.stroke();
  }

  draw = function($pathFromx, $pathFromy, $pathTox, $pathToy) {
    context.moveTo($pathFromx, $pathFromy);
    context.lineTo($pathTox, $pathToy);
    context.stroke();
  }

  frame1 = function() {
    draw (0, 150, 150, 150);
  };

  frame2 = function() {
    draw (10, 0, 10, 600);
  };

  frame3 = function() {
    draw (0, 5, 70, 5);
  };

  frame4 = function() {
    draw (60, 5, 60, 15);
  };

  torso = function() {
    draw (60, 36, 60, 70);
  };

  rightArm = function() {
    draw (60, 46, 100, 50);
  };

  leftArm = function() {
    draw (60, 46, 20, 50);
  };

  rightLeg = function() {
    draw (60, 70, 100, 100);
  };

  leftLeg = function() {
    draw (60, 70, 20, 100);
  };

  drawArray = [rightLeg, leftLeg, rightArm, leftArm,  torso,  head, frame4, frame3, frame2, frame1];

    function letter_select() {
        var letter = event.target.id;
        letters_guessed.push(letter);
        if (!contains(word, letter)) {
            lives_left -= 1;
            animate();
        }
        render();
    };


    reset();
    getWord(); 

};

document.addEventListener('DOMContentLoaded', function() {

    var new_game_button = document.getElementById("new-game-button")
        hangman_div = document.getElementById("hangman");
    var reset_game_button = document.getElementById("reset-game-button")
        hangman_div = document.getElementById("hangman");




    new_game_button.addEventListener("click", function() {
        new Hangman(hangman_div);
    });
    reset_game_button.addEventListener("click", function() {
      location.reload();
  });
});
