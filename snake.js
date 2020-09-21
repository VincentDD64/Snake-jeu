$(document).ready(function() {


    var LARGEUR = 900;
    var HAUTEUR = 500;
    var TAILLECASE = 20;
    var VITESSE = 140;

    function creerCanvas(l, h) {

        $('#jeu').append(
            $('<canvas />')
				.attr('id', 'canvas')
                .attr('width', l)
                .attr('height', h)
				.text("Quel dommage ! Votre navigateur internet ne supporte pas la technologie utilisée pour le jeu.")
                .css({
                    'border' : '2px solid #FFFFFF',
                    'border-radius' : '20px',
                    'display': 'none'
                })
        );
    }

    creerCanvas(LARGEUR, HAUTEUR);

   
    var canvas = $('#canvas');

    
    var ctx = canvas[0].getContext("2d");

    var direction;
    var nourriture;
    var serpent;
    var score;
    var enPause;
    var touchePressee;

    
    $(document).keydown(function (e) {

        var key = e.which;

        if (key == "37" && direction != "droite" && !touchePressee) {
            direction = "gauche";
            touchePressee = true;
        }

        else if (key == "38" && direction != "bas" && !touchePressee) {
            direction = "haut";
            touchePressee = true;
        }

        else if (key == "39" && direction != "gauche" && !touchePressee) {
            direction = "droite";
            touchePressee = true;
        }

        else if (key == "40" && direction != "haut" && !touchePressee) {
            direction = "bas";
            touchePressee = true;
        }
    });


    $('#commencer').click(function() {
        $('footer').fadeOut(500);
        $('#menu').fadeOut(500, function() {
            $('header').slideDown(500);
            canvas.slideDown(500, function() {
                $('footer').slideDown(500, function() {
                    enPause = false;
                    touchePressee = false;
                    canvas.focus();
                    initialisation();
                    jouer();
                })
            });
        });
    });


    $('#recommencer').click(function() {
        $('footer').fadeOut(500);
        $('#fin').fadeOut(500, function() {
            $('#fin-desc').text('Le serpent a touché sa queue !');
            $('header').slideDown(500);
            canvas.slideDown(500, function() {
                $('footer').slideDown(500, function() {
                    enPause = false;
                    touchePressee = false;
                    canvas.focus();
                    initialisation();
                    jouer();
                })
            });
        });
    });


   
    $('#pause').click(function() {
        if (enPause) {
            canvas.focus();
            $('#pause').text("Pause");
            enPause = false;
            jouer();
        } else {
            $('#pause').text("Continuer");
            enPause = true;
            pause();
        }
    });

    $('#reset').click(function() {
        pause();
        $('#pause').text("Pause");
        $('#pause').addClass("disabled");
        $(this).addClass("disabled");
        $('footer').slideUp(500);
        canvas.slideUp(500, function() {
            ctx.clearRect(0, 0, LARGEUR, HAUTEUR);
            canvas.slideDown(500, function() {
                $('footer').slideDown(500, function() {
                    enPause = false;
                    touchePressee = false;
                    canvas.focus();
                    $('#pause').removeClass("disabled");
                    $('#reset').removeClass("disabled");
                    initialisation();
                    jouer();
                })
            })
        });
    });


    function initialisation() {

        direction = "droite";
        creerSerpent();
        creerNourriture();
        score = 0;
    }


    function jouer() {

        if (typeof Game_Interval != "undefined") {
            clearInterval(Game_Interval);
        }

        Game_Interval = setInterval(actualiser, VITESSE);
        allowPressKeys = true;
    }

    function pause() {

        clearInterval(Game_Interval);
        allowPressKeys = false;
    }

    function fin(score) {

        $('footer').delay(600).slideUp(500, function() {
            canvas.slideUp(500, function() {
                ctx.clearRect(0, 0, LARGEUR, HAUTEUR);
            });
            $('header').slideUp(500, function() {
                $('#fin').fadeIn(500, function() {
                    $('#fin-desc').append('<br />Votre score est de ' + score + '.');
                })
                $('footer').fadeIn(500);
            })
        });
    }

    function creerSerpent() {

        var longueurDepart = 5;
        serpent = [];
        for (var i = longueurDepart - 1; i >= 0; i--) {
            serpent.push({x: i, y: 0});
        }
    }

    function creerNourriture() {

        nourriture = {
            x: Math.round(Math.random() * (LARGEUR - 20) / TAILLECASE),
            y: Math.round(Math.random() * (HAUTEUR - 20) / TAILLECASE)
        };
    }

    function dessiner(caseX, caseY, couleur) {

        ctx.fillStyle = couleur;
        ctx.fillRect(caseX * TAILLECASE, caseY * TAILLECASE, TAILLECASE, TAILLECASE);
        ctx.strokeStyle = "white";
        ctx.strokeRect(caseX * TAILLECASE, caseY * TAILLECASE, TAILLECASE, TAILLECASE);
    }

    function collision(caseX, caseY, serpent) {

        for (var i = 0; i < serpent.length; i++) {
            if (serpent[i].x == caseX && serpent[i].y == caseY) {
                return true;
            }
        }

        return false;
    }

    function actualiser() {

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, LARGEUR, HAUTEUR);

        var caseX = serpent[0].x;
        var caseY = serpent[0].y;

        if (direction == "droite") {
            caseX++;
            touchePressee = false;
        }

        else if (direction == "gauche") {
            caseX--;
            touchePressee = false;
        }

        else if (direction == "haut") {
            caseY--;
            touchePressee = false;
        }

        else if (direction == "bas") {
            caseY++;
            touchePressee = false;
        }

        if (caseX == -1) {
            caseX = (LARGEUR / TAILLECASE) - 1;
        } else if (caseX == LARGEUR / TAILLECASE) {
            caseX = 0;
        }

        if (caseY == -1) {
            caseY = (HAUTEUR / TAILLECASE) - 1;
        } else if (caseY == HAUTEUR / TAILLECASE) {
            caseY = 0;
        }

        if (collision(caseX, caseY, serpent)) {
            pause();
            fin(score);
        }

        if (caseX == nourriture.x && caseY == nourriture.y) {
            var queue = {x: caseX, y: caseY};
            score++;
            creerNourriture();
        } else {
            var queue = serpent.pop();
            queue.x = caseX;
            queue.y = caseY;
        }

        serpent.unshift(queue);

        for (var i = 0; i < serpent.length; i++) {
            var corps = serpent[i];
            dessiner(corps.x, corps.y, "#000000");
        }

        dessiner(nourriture.x, nourriture.y, "#FF0000");
        $('#score').text("Score : " + score);
    }
});