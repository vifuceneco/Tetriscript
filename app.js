document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startButton = document.querySelector('#start-button');
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue',
    ]

    // Formas

    const lShape = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const oShape = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]

    const tShape = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ]

    const iShape = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ]

    const zShape = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
    ]

    const theShapes = [lShape, zShape, tShape, oShape, iShape]

    let currentPosition = 4;
    let currentRotation = 0;

    console.log(theShapes[0][0])

    // Selecciono una forma random y su primera rotacion
    let random = Math.floor(Math.random()*theShapes.length)
    let current = theShapes[random][currentRotation]

    // Dibujo la primera rotación en la primera forma

    function draw() {
        current.forEach(index => {
           squares[currentPosition + index].classList.add('shape');
           squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('shape')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }

    // Asigno funcion a las keyboards
    function control(e) {
        if(e.keyCode === 37) {
            // Muevo a la izquierda
            moveLeft()
        } else if (e.keyCode === 38) {
            // Rotacion
            rotate()
        } else if (e.keyCode === 39) {
            // Muevo a la derecha
            moveRight()
        } else if (e.keyCode === 40) {
            // Muevo abajo
            moveDown()
        }
    }
    document.addEventListener('keyup', control)

    // Funcion moveDown

    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    // Funcion freeze

    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            // Nueva forma cayendo
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theShapes.length)
            current = theShapes[random][currentRotation]
            currentPosition = 4
            draw ();
            displayShape();
            addScore();
            gameOver();
        }
    }

    // Mover la forma a la izq/der, excepto si esta en el borde

    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        if(!isAtLeftEdge) currentPosition -=1
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }
        draw()
    }

    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
        if(!isAtRightEdge) currentPosition +=1
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }
        draw()
    }

    function checkRotatedPosition(P){
        P = P || currentPosition       //Toma la posicion inicial y se fija si esta cerca del borde izq
        if ((P+1) % width < 4) {             
          if (isAtRightEdge()){     
            currentPosition += 1   
            checkRotatedPosition(P) 
            }
        }
        else if (P % width > 5) {
          if (isAtLeftEdge()){
            currentPosition -= 1
          checkRotatedPosition(P)
          }
        }
      }

    function rotate() {
        undraw()
        currentRotation ++
        if(currentRotation === current.length) { // Si la rotacion llega a 4, que vuelva a 0
            currentRotation = 0
        }
        current = theShapes[random][currentRotation]
        checkRotatedPosition();
        draw()
    }

    // Mostrar la siguiente figura

    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0


    // Las figuras sin rotacion
    const upNextShape = [
        [1, displayWidth+1, displayWidth*2+1, 2], //l
        [0, displayWidth, displayWidth+1, displayWidth*2+1], //z
        [1, displayWidth, displayWidth+1, displayWidth+2], //t
        [0, 1, displayWidth, displayWidth+1], //o
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1], //i
      ]

    function displayShape () {
        displaySquares.forEach(square => {
            square.classList.remove('shape')
            square.style.backgroundColor = ''
        })
        upNextShape[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('shape')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }


    // Agrego la funcionalidad del boton

    startButton.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random()*theShapes.length);
            displayShape();
        }
    })

    // Score

    function addScore() {
        for (let i = 0; i < 199; i +=width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score +=10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('shape');
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }


    // Perder

    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'End'
            clearInterval(timerId);
            document.removeEventListener("keyup",control);
        }
    }

})
