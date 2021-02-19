
const app = {

  colors: ['red','green','blue','yellow'],

  // la séquence jouer par Simon
  sequence: [],

  drawCells: function () {
    const playground = document.getElementById('playground');
    for (const color of app.colors) {
      let cell = document.createElement('div');
      cell.className = 'cell';
      cell.id = color;
      cell.style.backgroundColor = color;
      playground.appendChild(cell);
    }
  },

  bumpCell: function (color) {
    // on modifie le style directement
    document.getElementById(color).style.borderWidth = '45px';
  
    setTimeout( () => {
      document.getElementById(color).style.borderWidth = '0';
    }, 150);

  },

  newGame: function () {
    // on reset la sequence
    app.sequence = [];
    app.indiceJoueur = 0;
    
    for (let index = 0; index < 3; index++) {
      
      let random = Math.floor(Math.random()*4);

      app.sequence.push( app.colors[random] );
    }

    // debut de la séquence
    app.simonSays(app.sequence);
  },

  simonSays: function (sequence) {
    // on stop le timeout tant que Simon parle!
    app.stopTimeout();

    if (sequence && sequence.length) {
      app.showMessage('Mémorisez la séquence !');
      // after 500ms, bump the first cell
      setTimeout( app.bumpCell, 500, sequence[0] );
      // plays the rest of the sequence after a longer pause
      setTimeout( app.simonSays, 850, sequence.slice(1));
    } else {
      // toute la séquence a été jouée : on dis au joueur de jouer
      app.showMessage('Reproduisez la séquence !');
      // et on lance le timeout !
      app.startTimeout();
    }
  },

  init: function () {
    console.log('init');
    app.drawCells();

    // listen click on the "go" button
    document.getElementById('go').addEventListener('click', app.newGame );
    app.listenClickEvents();
  },

  showMessage: function (message) {
    let messageZone = document.getElementById('message');
    messageZone.style.display = 'block';
    messageZone.innerHTML = message;
    // on cache le bouton en mettant sa propriété CSS "display" à none.
    document.getElementById('go').style.display = 'none';
  },

  hideMessage: function () {
    // on cache la zone de message.
    document.getElementById('message').style.display = 'none';
    // on ré-affiche le bouton.
    document.getElementById('go').style.display = 'block';
  },

  /** Etape 3 */
  gameOver: function () {
    alert('Partie terminée. Votre score : '+app.sequence.length);
    app.hideMessage();
    // au passage, on vide la séquence 
    app.sequence = [];
    // et on arrete le timeout si besoin
    app.stopTimeout();
  },

  /** Etape 4 */
  // une variable pour savoir ou se situe le joueur dans la séquence 
  // on remet cette variable à zéro dans "newGame"
  indiceJoueur: 0,

  // on va attacher des event listeners sur chaque case. Cette méthode sera appelée par app.init.
  // on a donc modifié app.init à cette étape
  listenClickEvents: function () {
    let cells = document.getElementsByClassName('cell');
    for (const cell of cells) {
      cell.addEventListener('click', app.handleClickEvent);
    }
  },

  // la fonction qui sera déclenchée par les click sur les cases
  handleClickEvent: function (event) {
    // la cellule cliquée est dans event.target
    // et l'id de la cellule contient directement sa couleur ! malin !
    console.log(event.target.id);
    let couleur = event.target.id;

    // test au cas ou : si app.sequence est vide, c'est que la partie n'est pas commencée. Dans ce cas, on ne fait rien
    if (!app.sequence.length) { 
      return;
    }

    // on reset le timeout
    app.resetTimeout();

    // on applique l'effet visuel
    app.bumpCell(couleur);

    if (couleur == app.sequence[app.indiceJoueur] ) { // le joueur a cliqué la bonne couleur

      if (app.indiceJoueur == app.sequence.length-1) { // ... et la séquence est finie
        app.nextMove();
      } else {
        // sinon (la séquence n'est pas finie) : on incrémente l'indice
        app.indiceJoueur ++;
      }
    } else {
      // le joueur n'a pas cliqué sur la bonne couleur !
      app.gameOver();
    }
  },

  /** Etape 5 */
  nextMove: function () {
    // tirer un nombre aléatoire entre 0 et 3
    let random = Math.floor(Math.random()*4);
    // ajouter la couleur correspondante à la séquence
    app.sequence.push( app.colors[random] );
    // on remet l'indice joueur à zéro (il doit refaire toute la séquence !)
    app.indiceJoueur = 0;
    // Simon Says !
    app.simonSays(app.sequence);
  },

  /** Etape 6 : on modifie uniquement la fonction simonSays */

  timeoutRef: null,

  startTimeout: function () {
    // game over dans 5 secondes !
    // et on conserve la réf
    app.timeoutRef = setTimeout( app.gameOver, 5000);
  },
  
  stopTimeout: function () {
    clearTimeout(app.timeoutRef);
  },

  resetTimeout: function () {
    app.stopTimeout();
    app.startTimeout();
  }

};


document.addEventListener('DOMContentLoaded', app.init);