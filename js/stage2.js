var stage2State = {
	create: function(){
		this.onGame = true;
		
		game.add.sprite(0,0,'bg');
		
		this.maze = [
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,0,0,0,0,0,1,3,0,0,0,0,0,3,1],
			[1,0,1,3,1,0,1,1,0,1,1,1,1,0,1],
			[1,0,1,1,1,0,2,0,0,1,3,1,0,0,1],
			[1,0,0,0,0,0,1,1,3,1,0,0,0,1,1],
			[1,1,0,1,0,0,3,1,1,1,0,1,0,1,1],
			[1,0,0,1,0,0,0,0,0,0,0,1,3,0,1],
			[1,0,1,1,0,1,1,0,1,1,0,1,1,0,1],
			[1,0,3,0,0,1,3,0,3,1,0,0,0,0,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
		];
		
		this.blocks = game.add.group();
		this.blocks.enableBody = true;
		
		this.coinPositions = [];
		
		for(var row in this.maze){
			for(var col in this.maze[row]){
				var tile = this.maze[row][col];
				
				var x = col * 50;
				var y = row * 50;
				
				if(tile === 1){
					var block = this.blocks.create(x,y,'block');
						block.body.immovable = true;
				} else
				if(tile === 2){
					this.player = game.add.sprite(x + 25,y + 25,'player');
					this.player.anchor.set(.5);
					game.physics.arcade.enable(this.player);
					// (nome da animação, array de sequência, velocidade / framerate, loop)
						// pra baixo
						this.player.animations.add('goDown', [0, 1, 2, 3], 8, true);
						// esquerda
						this.player.animations.add('goLeft', [4, 5, 6, 7], 8, true);
						// direita
						this.player.animations.add('goRight', [8, 9, 10, 11], 8, true);
						// pra cima
						this.player.animations.add('goUp', [12, 13, 14, 15], 8, true);
				} else
				if(tile === 3){
					var position = {
						x: x + 25,
						y: y + 25
					};
					this.coinPositions.push(position);
				}
			}
		}
		
		//Inimigo
		this.enemy = game.add.sprite(75,75,'enemy');
		this.enemy.anchor.set(.5);
		game.physics.arcade.enable(this.enemy);
		this.enemy.animations.add('goDown', [0, 1, 2, 3], 8, true);
		// direita
		this.enemy.animations.add('goRight', [4, 5, 6, 7], 8, true);
		// pra cima
		this.enemy.animations.add('goUp', [8, 9, 10, 11], 8, true);
		// esquerda
		this.enemy.animations.add('goLeft', [12, 13, 14, 15], 8, true);
		this.enemy.direction = 'DOWN';
		
		//Criar a moeda
		this.coin = {};
		this.coin.position = this.newPosition();
		this.coin = game.add.sprite(this.coin.position.x,this.coin.position.y,'coin');
		this.coin.anchor.set(.5);
		this.coin.animations.add('spin',[0,1,2,3,4,5,6,7,8,9],10,true).play();
		game.physics.arcade.enable(this.coin);
		
		//coletar moeda
		this.coins = 0;
		this.txtCoins = game.add.text(15, 15,'COINS: ' + this.getText(this.coins),{font:'15px emulogic',fill:'#fff'});

		//exibir vidas
		this.lifes = 3;
		this.txtLifes = game.add.text(400, 15, 'LIFE: ' + this.getText(this.lifes), { font: '15px emulogic', fill: '#fff' });
		
		//exibir score
		this.txtScore = game.add.text(270,15,'SCORE: ' + this.getText(game.global.score),{font:'15px emulogic',fill:'#fff'});
		this.txtScore.anchor.set(.5,0);
		
		//controles
		this.controls = game.input.keyboard.createCursorKeys();
		
		//partículas da moeda
		this.emitter = game.add.emitter(0,0,15);
		this.emitter.makeParticles('part');
		this.emitter.setXSpeed(-50,50);
		this.emitter.setYSpeed(-50,50);
		this.emitter.gravity.y = 0;

		//partículas da vida
		this.emitterLife = game.add.emitter(0, 0, 15);
		this.emitterLife.makeParticles('partlife');
		this.emitterLife.setXSpeed(-50, 50);
		this.emitterLife.setYSpeed(-50, 50);
		this.emitterLife.gravity.y = 0;
		
		//Timer
		this.time = 100;
		this.txtTimer = game.add.text(game.world.width - 15,15,'TIME: ' + this.getText(this.time),{font:'15px emulogic',fill:'#fff'});
		this.txtTimer.anchor.set(1,0);
		this.timer = game.time.events.loop(1000,function(){
			this.time--;
			this.txtTimer.text = 'TIME: ' + this.getText(this.time);
		},this);
	},
	
	update: function(){
		if(this.onGame){
			game.physics.arcade.collide(this.player, this.blocks, this.loseLife, null, this);
			game.physics.arcade.overlap(this.player,this.coin,this.getCoin,null,this);
			game.physics.arcade.overlap(this.player,this.enemy,this.loseCoin,null,this);
		
			this.moveEnemy();
			this.movePlayer();
			
			if(this.time < 1 || this.coins >= 10 || this.lifes == 0){
				this.gameOver();
			}
		}
	},
	
	gameOver: function(){
		this.onGame = false;
		
		game.time.events.remove(this.timer);
		
		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = 0;
		this.player.animations.stop();
		this.player.frame = 0;
		
		this.enemy.animations.stop();
		this.enemy.frame = 0;
		
		if(this.coins >= 10){//Passou de fase
			var txtLevelComplete = game.add.text(game.world.centerX,150,'LEVEL COMPLETE',{font:'20px emulogic',fill:'#fff'});
				txtLevelComplete.anchor.set(.5);
				
			var bonus = this.time * 5;
			game.global.score += bonus;
			this.txtScore.text = 'SCORE: ' + this.getText(game.global.score);
			
			if(game.global.score > game.global.highScore){
				game.global.highScore = game.global.score;
			}
			
			var txtBonus = game.add.text(game.world.centerX,200,'TIME BONUS: ' + this.getText(bonus),{font:'20px emulogic',fill:'#fff'});
				txtBonus.anchor.set(.5);
				
			var txtFinalScore = game.add.text(game.world.centerX,250,'FINAL SCORE: ' + this.getText(game.global.score),{font:'20px emulogic',fill:'#fff'});
				txtFinalScore.anchor.set(.5);
			
		} else {//Acabou o tempo ou as vidas
			var txtGameOver = game.add.text(game.world.centerX,150,'GAME OVER',{font:'20px emulogic',fill:'#fff'});
				txtGameOver.anchor.set(.5);
		}
		
		var txtBestScore = game.add.text(game.world.centerX,350,'BEST SCORE: ' + this.getText(game.global.highScore),{font:'20px emulogic',fill:'#fff'});
			txtBestScore.anchor.set(.5);
			
		game.time.events.add(5000,function(){
			if(this.coins >= 10){
				game.state.start('end');
			} else {
				game.state.start('menu');
			}
		},this);
	},
	
	loseCoin: function(){
		
		if(this.coins > 0){
			this.emitter.x = this.player.position.x;
			this.emitter.y = this.player.position.y;
			this.emitter.start(true,500,null,15);
			
			this.coins = 0;
			this.txtCoins.text = 'COINS: ' + this.getText(this.coins);
		}
	},
	
	moveEnemy: function(){
		if(Math.floor(this.enemy.x -25)%50 === 0 && Math.floor(this.enemy.y -25)%50 === 0){
			var enemyCol = Math.floor(this.enemy.x/50);
			var enemyRow = Math.floor(this.enemy.y/50);
			var validPath = [];
			
			if(this.maze[enemyRow][enemyCol-1] !== 1 && this.enemy.direction !== 'RIGHT'){
				validPath.push('LEFT');
			}
			if(this.maze[enemyRow][enemyCol+1] !== 1 && this.enemy.direction !== 'LEFT'){
				validPath.push('RIGHT');
			}
			if(this.maze[enemyRow-1][enemyCol] !== 1 && this.enemy.direction !== 'DOWN'){
				validPath.push('UP');
			}
			if(this.maze[enemyRow+1][enemyCol] !== 1 && this.enemy.direction !== 'UP'){
				validPath.push('DOWN');
			}
			
			this.enemy.direction = validPath[Math.floor(Math.random()*validPath.length)];
		}
		
		switch(this.enemy.direction){
			case 'LEFT':
				this.enemy.x -= 1;
				this.enemy.animations.play('goLeft');
				break;
			case 'RIGHT':
				this.enemy.x += 1;
				this.enemy.animations.play('goRight');
				break;
			case 'UP':
				this.enemy.y -= 1;
				this.enemy.animations.play('goUp');
				break;
			case 'DOWN':
				this.enemy.y += 1;
				this.enemy.animations.play('goDown');
				break;
			
		}
	},
	
	getCoin: function(){
		this.emitter.x = this.coin.position.x;
		this.emitter.y = this.coin.position.y;
		this.emitter.start(true,500,null,15);
		
		this.coins++;
		this.txtCoins.text = 'COINS: ' + this.getText(this.coins);
		
		game.global.score += 5;
		this.txtScore.text = 'SCORE: ' + this.getText(game.global.score);
		
		if(game.global.score > game.global.highScore){
			game.global.highScore = game.global.score;
		}
		
		this.coin.position = this.newPosition();
	},
	
	getText: function(value){
		if(value < 10){
			return '00' + value.toString();
		}
		if(value < 100){
			return '0' + value.toString();
		}
		return value.toString();
	},
	
	movePlayer: function(){
		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = 0;
	
		if(this.controls.left.isDown && !this.controls.right.isDown){
			this.player.body.velocity.x = -100;
			this.player.direction = "left";
		} else
		if(this.controls.right.isDown && !this.controls.left.isDown){
			this.player.body.velocity.x = 100;
			this.player.direction = "right";
		}
		
		if(this.controls.up.isDown && !this.controls.down.isDown){
			this.player.body.velocity.y = -100;
			this.player.direction = "up";
		} else
		if(this.controls.down.isDown && !this.controls.up.isDown){
			this.player.body.velocity.y = 100;
			this.player.direction = "down";
		}
		
		switch(this.player.direction){
			case "left":
				this.player.animations.play('goLeft'); break;
			case "right":
				this.player.animations.play('goRight'); break;
			case "up":
				this.player.animations.play('goUp'); break;
			case "down":
				this.player.animations.play('goDown'); break;
		}
		
		if(this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0){
			this.player.animations.stop();
		}
	},
	
	newPosition: function(){
		var pos = this.coinPositions[Math.floor(Math.random() * this.coinPositions.length)];
		
		while(this.coin.position === pos){
			pos = this.coinPositions[Math.floor(Math.random() * this.coinPositions.length)];
		}
		
		return pos;
	},

	loseLife: function () {
		
		this.emitterLife.x = this.player.position.x;
		this.emitterLife.y = this.player.position.y;
		this.emitterLife.start(true, 500, null, 15);

		//alterando a posição para a posição inicial
		this.player.body.position.setTo(350, 310);

		if (this.lifes > 0) {

			this.lifes = this.lifes - 1;
			this.txtLifes.text = 'LIFE: ' + this.getText(this.lifes);
		}
	  }
};
