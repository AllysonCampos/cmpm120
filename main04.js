
// define game
//works best in Safari
//Game states, Animation, and Texture Atlas code from Nathan Atlice CMPM120 Slides
//player sprite art asset provided by Kenny
//Todo: input art assets
//get audio
//decrease num of townsPpl
var game = new Phaser.Game(760, 450, Phaser.AUTO);


var score = 0; //score variable to 0 at beginning of game
var scoreText; //variable for the score to be displayed

var townsPpl = 0; //score variable to 0 at beginning of game
var townsPplText; //variable for the score to be displayed

var starfield;
var bullets;
var bulletTime = 0;
var fireButton;

var player;

//the time in ms between each enemy created
var enemyRate = 1800;
//the time in ms since the start of the game when the next enemy will be created
var nextEnemyTime = 0;


// MainMenu state and methods
var MainMenu = function(game) {};
MainMenu.prototype = {
	preload: function() {
		console.log('MainMenu: preload'); //print to console to check that game is in Mainmenu preload state
	},
	create: function() {
		console.log('MainMenu: create');//print to console to check that game is in Mainmenu create state
		game.stage.backgroundColor = "#add8c6"; // light sea blue for menu screen
		mainMenuText = game.add.text(120, 300, 'Start Game', { fontSize: '32px', fill: '#ffffff' }); // Start Game Text
		mainMenuText = game.add.text(60, 340, 'Switch states by pressing SPACEBAR!', { fontSize: '16px', fill: '#ffffff' }); //on-screen instructions that tells player how to seiwtch states


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
		console.log('GamePlay: preload'); //print to console to check that game is in gameplay preload state
        game.load.atlas('test','assets/img/spritesheet.png','assets/img/sprites.json'); // load art assests using a texture atlas
        game.load.image('starfield','assets/img/Bg.png');
        game.load.image('bullet','assets/img/bullet.png');
        game.load.image('enemy','assets/img/enemy.png');

	},
	create: function() {
		console.log('GamePlay: create'); //print to console to check that game is in gameplay create state

		starfield = game.add.tileSprite(0,0,760,450,'starfield');

		bullets = game.add.group();
		bullets.enableBody = true;
		bullets.physicsBodyType = Phaser.Physics.ARCADE;
		bullets.createMultiple(1,'bullet');
		bullets.setAll('anchor.x',0.5);
		bullets.setAll('anchor.y',1);
		bullets.setAll('outOfBoundsKill',true);
		bullets.setAll('checkWorldBounds',true);

		fireButton = game.input.keyboard.addKey(Phaser.Keyboard.S);


		enemies = game.add.group();
		enemies.enableBody = true;
		enemies.physicsBodyType = Phaser.Physics.ARCADE;
		enemies.setAll('checkWorldBounds',true);
			
		enemies.setAll('outOfBoundsKill',true);
		


		generateEnemy();
    	

    	// creates the player sprite and adds it to the game
        player = game.add.sprite(32, game.world.height - 150, 'test','player01');
        //positions the sprite's anchor to the middle
        player.anchor.x = 0.5;
        player.anchor.y = 0.5;
        //scale sprite to half its size
        player.scale.setTo(0.5, 0.5);
        //add the sprite frames from the texture atlas
        player.animations.add('player', Phaser.Animation.generateFrameNames('player',1,2,'',2),30,true);

    	// enable physics on the player
    	game.physics.arcade.enable(player);

    	player.body.collideWorldBounds = true; 

        //this is where the game displays the player's score on the screen
        scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#ffffff' });
        townsPplText = game.add.text(16, 32, 'townsppl: 10', { fontSize: '32px', fill: '#ffffff' });
        //creates cursors input for when arrows keys are used by player
        cursors = this.input.keyboard.createCursorKeys();
	},
	update: function() {


		game.physics.arcade.overlap(player,enemies,die);


		starfield.tilePosition.x -=2;
		//  player and the stars can collide with the platforms
    	//var hitPlatform = game.physics.arcade.collide(player, platforms);
    	//  Reset player velocity 
    	player.body.velocity.x = 0;
    	//checks if left button is pressed
    	if (cursors.up.isDown)
    	{
        	//  Moves to the left
        	player.body.velocity.y = -300;

        	//plays the left animation. 1st and 2nd frame
        	//player.animations.play('player');
    	}
    	//checks if right button is pressed
    	else if (cursors.down.isDown)
    	{
        	//  Moves to the right
        	player.body.velocity.y = 300;
        	//turns the sprite to turn right
            player.scale.x = 0.5;
            //plays the right animation. 1st and 2nd frame
        	//player.animations.play('player');
    	}
    	else if (cursors.left.isDown)
    	{
        	//  Moves to the right
            //this.player.scale.setTo(0.5, 0.5);
            player.scale.x = -0.5;
        	player.body.velocity.x = -300;
            //plays the right animation. 1st and 2nd frame
        	//player.animations.play('player');
    	}
    	else if (cursors.right.isDown)
    	{
        	//  Moves to the right
        	player.body.velocity.x = 300;
        	//turns the sprite to turn right
            player.scale.x = 0.5;
            //plays the right animation. 1st and 2nd frame
        	//player.animations.play('player');
    	}
    	else
    	{
        	//if neither button is pressed then stop animation
        	player.body.velocity.y = 0;
        	player.animations.stop();

    	}


    	if(fireButton.isDown)
    	{
    		fireBullet();
    	}
   

    	if(game.time.now>nextEnemyTime){
    		nextEnemyTime = game.time.now + enemyRate;
    		generateEnemy();
    	}

    	if(enemy.outOfBoundsKill == true){
    		townsPpl -=1;
    		townsPplText.text = 'townsppl: ' + townsPpl;
    	}

    	/*if(enemies.x < -30){
    		townsPpl -=1;
    		townsPplText.text = 'townsppl: ' + townsPpl;
    	}*/

    	game.physics.arcade.overlap(bullets,enemies,collisionHandler);


		// GamePlay logic
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			game.state.start('GameOver'); //switch to game over state
		}
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
		  game.stage.backgroundColor = "#665e61"; // grey colored background
		  gameOverText = game.add.text(120, 300, 'Game Over', { fontSize: '32px', fill: '#ffffff' }); //Game Over text in white
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
		bullet = bullets.getFirstExists(false);

		if(bullet){
			bullet.reset(player.x + 9,player.y);
			if(player.scale.x == 0.5){
				bullet.body.velocity.x = 600;
			}
			else{
				bullet.body.velocity.x = -600;
			}
			bulletTime = game.time.now + 1;
		}
	}
}


function die(){
	player.kill();
	game.state.start('GameOver');
}

function collisionHandler(bullet,enemy){
	bullet.kill();
	enemy.kill();
	score += 10;
    //the score being displayed on the screen is updated
    scoreText.text = 'Score: ' + score;
    
}

function generateEnemy(){
	enemyX = 760;
	enemyY = game.rnd.integerInRange(0,430);
	enemy = game.add.sprite(enemyX,enemyY,'enemy');
	enemy.anchor.setTo(0.5,0,5);

	game.physics.arcade.enable(enemy);
	enemy.body.velocity.x = -100;
	enemies.add(enemy);
}


// add states to StateManager and start MainMenu
game.state.add('MainMenu', MainMenu);
game.state.add('GamePlay', GamePlay);
game.state.add('GameOver', GameOver);
game.state.start('MainMenu');