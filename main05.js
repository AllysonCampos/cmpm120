
// define game
//works best in Safari
//Game states, Animation, and Texture Atlas code from Nathan Atlice CMPM120 Slides
//player sprite art asset provided by Kenny
//random item, enemy generation, collisionHandler from youtube tutorial by Magic Monk
//music by dklon,p0ss,Viktor Kraus
var game = new Phaser.Game(760, 450, Phaser.AUTO);


var score = 0; //score variable to 0 at beginning of game
var scoreText; //variable for the score to be displayed

//background image
var starfield;
//bullets - looks like a magical ball of energy in game
var bullets;
var bulletTime = 0;
var fireButton;
var menu;
var gameOver;

var player;

//the time in ms between each enemy created
var enemyRate = 1000;
//the time in ms since the start of the game when the next enemy will be created
var nextEnemyTime = 0;

//the time in ms between each enemy created
var starRate = 3000;
//the time in ms since the start of the game when the next enemy will be created
var nextStarTime = 0;

//main background music
var music;
//will store sound effect for when bullet hits enemy
var hitEnemy;
//will store sound effect for when enemy collides with player
var killPlayer;
//will store sound effect for when player collects star
var collectSound;



// MainMenu state and methods
var MainMenu = function(game) {};
MainMenu.prototype = {
	preload: function() {
        //loads assets via texture atlas
		game.load.atlas('test','assets/img/spritesheet4.png','assets/img/sprites4.json');
		console.log('MainMenu: preload'); //print to console to check that game is in Mainmenu preload state
	},
	create: function() {
		console.log('MainMenu: create');//print to console to check that game is in Mainmenu create state
        //adds and displays the menu image
		menu = game.add.sprite(0,0,'test','menu');


	},
	update: function() {
		// when player presses spacebar it switches to next state
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			game.state.start('GamePlay'); //switch to game play state
		}
	}
}

// GamePlay state and methods
var GamePlay = function(game) {};
GamePlay.prototype = {
	preload: function() {
		console.log('GamePlay: preload');//print to console to check that game is in Mainmenu preload state
        //loads the main background music
        game.load.audio('Blueberries', ['assets/audio/Blueberries.mp3', 'assets/audio/Blueberries.ogg']);
        //loads the sounds effect for when bullet hits enemy
        game.load.audio('bomb', ['assets/audio/bomb.mp3', 'assets/audio/bomb.ogg']);
        //loads the sounds effect for when enemy collides with player
        game.load.audio('laser', ['assets/audio/laser.mp3', 'assets/audio/laser.ogg']);
        //loads the sounds effect for when player collects star
        game.load.audio('collect', ['assets/audio/appear.mp3', 'assets/audio/appear.ogg']);



	},
	create: function() {
		console.log('GamePlay: create'); //print to console to check that game is in gameplay create state

		starfield = game.add.tileSprite(0,0,760,450,'test','Bg');//adds and displays the main background image
        //adds in music
        music = game.add.audio('Blueberries'); 
        //plays music and loops it
        music.play();
        music.loopFull(0.6);
        //lowers the volume of the music
        music.volume = 0.2;

        //plays sound effect and lowers the volume of the music
        hitEnemy = game.add.audio('bomb');
        hitEnemy.volume = 0.15;
        //plays sound and lowers the volume of the music
        killPlayer = game.add.audio('laser');
        killPlayer.volume = 0.2;

        //plays sound effect and lowers the volume of the music
        collectSound = game.add.audio('collect');
        collectSound.volume = 0.3;

        //creates a group for enemies
		enemies = game.add.group();
        //enable physics 
		enemies.enableBody = true;
		enemies.physicsBodyType = Phaser.Physics.ARCADE;
        //checks enemies when on screen and checks their bounds and when they go off screen
		enemies.setAll('checkWorldBounds',true);
		enemies.setAll('outOfBoundsKill',true);


        //creates a group for stars
        stars = game.add.group();
        //enable physics
        stars.enableBody = true;
        stars.physicsBodyType = Phaser.Physics.ARCADE;
        //checks stars when on screen and checks their bounds and when they go off screen
        stars.setAll('checkWorldBounds',true);
        stars.setAll('outOfBoundsKill',true);
    	

    	// creates the player sprite and adds it to the game
        player = game.add.sprite(32, game.world.height - 150, 'test','moveUp00001');
        //positions the sprite's anchor to the middle
        player.anchor.x = 0.5;
        player.anchor.y = 0.5;
        //scale sprite to half its size
        player.scale.setTo(0.7, 0.7);
        //add the sprite frames from the texture atlas
        player.animations.add('moveUp', Phaser.Animation.generateFrameNames('moveUp',3,4,'',5),4,true); // moving up animation
        player.animations.add('moveDown', Phaser.Animation.generateFrameNames('moveDown',3,4,'',5),4,true); //moving down animation
        player.animations.add('shoot', Phaser.Animation.generateFrameNames('shoot',2,4,'',5),4,true); //shooting animation
        

    	// enable physics on the player
    	game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true; 

 
        //creates group for bullets
		bullets = game.add.group();
        //enable physics
		bullets.enableBody = true;
		bullets.physicsBodyType = Phaser.Physics.ARCADE;
        //creates one bullet
		bullets.createMultiple(1,'test','spell');
        //readjusts the anchor point for bullet sprite
		bullets.setAll('anchor.x',0.5);
		bullets.setAll('anchor.y',1);
        //checks bullets on bounds and when it goes off screen
		bullets.setAll('outOfBoundsKill',true);
		bullets.setAll('checkWorldBounds',true);

        //when player presses S key they can shoot a bullet
		fireButton = game.input.keyboard.addKey(Phaser.Keyboard.S);

        //this is where the game displays the player's score on the screen
        scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#ffffff' });
        //creates cursors input for when arrows keys are used by player
        cursors = this.input.keyboard.createCursorKeys();
	},
	update: function() {

        //checks for when player overlaps with enemies then calls die function
		game.physics.arcade.overlap(player,enemies,die);

		starfield.tilePosition.x -=2;

    	//  Reset player velocity 
    	player.body.velocity.x = 0;
    	//checks if left button is pressed
    	if (cursors.up.isDown)
    	{
        	//  Moves upwards
        	player.body.velocity.y = -300;
            //plays the moveUp animation 
        	player.animations.play('moveUp');
    	}
    	//checks if right button is pressed
    	else if (cursors.down.isDown)
    	{
        	//  Moves downward
        	player.body.velocity.y = 300;
            //plays the moveDown animation. 
        	player.animations.play('moveDown');
    	}
    	else if (cursors.left.isDown)
    	{
        	//  Moves to the left
            //turns around sprite to face left
            player.scale.x = -0.7;
        	player.body.velocity.x = -300;
    	}
    	else if (cursors.right.isDown)
    	{
        	//  Moves to the right
        	player.body.velocity.x = 300;
        	//turns the sprite to face right
            player.scale.x = 0.7;

    	}
    	else
    	{
        	//if neither button is pressed then play idle animation. Also set velocity to 0
        	player.body.velocity.y = 0;
        	player.animations.play();

    	}


    	if(fireButton.isDown)
    	{
            //if S key is being pressed call fireBullet function
            player.animations.play('shoot');
    		fireBullet();
    	}
   
        //checks the current time against when the next enemy will spawn
    	if(game.time.now>nextEnemyTime){
    		nextEnemyTime = game.time.now + enemyRate;
            //call generateEnmey function to spawn an enemy
    		generateEnemy();
    		
    	}
        //checks the current time against when the next star will spawn
        if(game.time.now>nextStarTime){
            nextStarTime = game.time.now + starRate;
            //call generateEnmey function to spawn an enemy
            generateStar();
            
        }


        //checks for when player collides with star
        game.physics.arcade.overlap(player, stars, collectStar, null, this);
        //if there is an overlap between star and player then goes to collectStar function
        function collectStar (player, star) {

            // Removes the star from the screen when player collides
            star.kill();
            //sound effect played
            collectSound.play();
            //updates score by 10 when player collects star
            score += 5;
            //the score being displayed on the screen is updated
            scoreText.text = 'Score: ' + score;

        }
        //checks for collision between enemy and bullet
    	game.physics.arcade.overlap(bullets,enemies,collisionHandler);

	}
}

    // GameOver state and methods
    var GameOver = function(game) {};
    GameOver.prototype = {
	   preload: function() {
		  console.log('GameOver: preload'); //print to console to check that game is in gameover preload state
	   },
	   create: function() {
		  console.log('GameOver: create'); //print to console to check that game is in gameover create state
          gameOver = game.add.sprite(0,0,'test','gameOver');
	   },
	   update: function() {
		// GameOver logic
		  if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			game.state.start('MainMenu'); //switch to main menu state
		}
	}
}

function fireBullet(){
	if(game.time.now > bulletTime){
        //checks to see if there is already a bullet on screen
		bullet = bullets.getFirstExists(false);

		if(bullet){
            //spawns bullet in front of player
            //if player if facing right shoot towards the right
			if(player.scale.x == 0.7){
                bullet.reset(player.x + 50,player.y+50);
				bullet.body.velocity.x = 600;

			}
			else{
                //if player if facing left shoot towards the left
                bullet.reset(player.x - 50,player.y+50);
				bullet.body.velocity.x = -600;
			}
            //spaces out the spawn rate between bullets shot
			bulletTime = game.time.now + 100;
		}
	}
}


function die(){
    //player removes from screen
	player.kill();
    //play sound effect
    killPlayer.play();
    //stops background music
    music.stop();
    //goes to GameOver state
	game.state.start('GameOver');
}

function collisionHandler(bullet,enemy){
    //bullet removes from screen
	bullet.kill();
    //plays sound effect
    hitEnemy.play();
    //enemy removed from screen
	enemy.kill();
    //adds 10 pts to score
	score += 10;
    //the score being displayed on the screen is updated
    scoreText.text = 'Score: ' + score;
    
}

function generateEnemy(){
    //enemy spawns off screen
	enemyX = 760;
    //enemy given random Y coordinate
	enemyY = game.rnd.integerInRange(80,410);
    //adds and displays enemy to screen
	enemy = game.add.sprite(enemyX,enemyY,'test','enemy00000');
	enemy.anchor.setTo(0.5,0,5);
    //scales enemy to half its original size
    enemy.scale.x = 0.5;
    enemy.scale.y = 0.5;

    //enable physics and move enemy to the left
	game.physics.arcade.enable(enemy);
	enemy.body.velocity.x = -100;
    //add newly created enemy to group
	enemies.add(enemy);
}

function generateStar(){
    //star spawns off screen
    starX = 760;
    //star given random Y coordinate
    starY = game.rnd.integerInRange(80,410);
    //adds and displays enemy to screen
    star = game.add.sprite(enemyX,enemyY,'test','star');
    //scales enemy to half its original size
    star.scale.x = 0.5;
    star.scale.y = 0.5;
    star.anchor.setTo(0.5,0,5);
    //enable physics and move enemy to the left
    game.physics.arcade.enable(star);
    star.body.velocity.x = -100;
    //add newly created enemy to group
    stars.add(star);
}


// add states to StateManager and start MainMenu
game.state.add('MainMenu', MainMenu);
game.state.add('GamePlay', GamePlay);
game.state.add('GameOver', GameOver);
game.state.start('MainMenu');