var loadState = {
	preload: function(){
		var txtLoading = game.add.text(game.world.centerX,150,'LOADING...',{font:'15px emulogic',fill:'#fff'});
			txtLoading.anchor.set(.5);
	
		var progressBar = game.add.sprite(game.world.centerX,250,'progressBar');
			progressBar.anchor.set(.5);
			
		game.load.setPreloadSprite(progressBar);
		
		game.load.image('bg','img/bg.png');
		game.load.image('block','img/block.png');
		game.load.image('part','img/part.png');
		game.load.image('partlife','img/partlife.png');

		game.load.spritesheet('coin','img/coin.png',32,32);
		game.load.spritesheet('enemy','img/enemy.png',32,32);
		game.load.spritesheet('player','img/player.png',32,32);
		
		game.physics.startSystem(Phaser.Physics.ARCADE);
	},
	
	create: function(){
		game.state.start('menu');
	}
};
