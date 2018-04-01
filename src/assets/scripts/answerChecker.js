;(function () {
  'use strict'
  // Get number of songs in the game from data attributes.
  var max = document.getElementById('button0').getAttribute('data-max')
  // Parse it to integer (the number of songs in the database).
  max = parseInt(max)

  for (var i = 0; i < max; i++) {
    // FUNCTION SCOPE, NOT BLOCK SCOPE!
    (function () {
      var id = 'button' + i
      var btn = document.getElementById(id)
      var answer = btn.getAttribute('data-ans')
      var solution = btn.getAttribute('data-sol')
      var songList = btn.getAttribute('data-some')

      /* Hold the current value of 'i' in variable 'j', because
      the for loop will end, and the value of the 'i' will be 'max'.
      And that wrong value will be passed to the checkAnswer() function
      in the callback of the click events! */
      var j = i
      btn.addEventListener('click', function (event) {
        event.preventDefault()
        checkAnswer(answer, solution, j, songList)
      })
    }())
  }
  // Checks your answers you gave in the 'Recognize the music style' game.
  function checkAnswer (answer, solution, i, songList) {
    'use strict'
    // Get your answer
    var yourAnswer = document.getElementById(answer)

    // parse data from JSON
    var songs = JSON.parse(songList)

    // Get the DOM object where I put the solution
    var result = document.getElementById(solution)
    result.innerHTML = ''

    if (yourAnswer.value === 'nincsValasz') {
      result.innerHTML = ''
    } else if (yourAnswer.value === songs[i].style) {
      /* Append results. */
      result.innerHTML += 'Helyes válasz. A szám ' + songs[i].style + '.'
      result.style.color = 'green'
    } else {
      /* Append results. */
      result.innerHTML += 'Rossz válasz. A szám ' + songs[i].style + '.'
      result.style.color = 'red'
    }
  }
}())
