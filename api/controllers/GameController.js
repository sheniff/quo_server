/*---------------------
	:: Game
	-> controller
---------------------*/
var GameController = {

  start: function(req,res) {
    Game.create({
      joined: Game.attributes.joined.defaultValue,
      players: req.param('players') || Game.attributes.players.defaultValue
    }).done(function(err, game) {

      if (err) return res.send(err,500);

      res.json(game);

    });
  },

	// To trigger this action locally, visit: `http://localhost:port/game/join`
	join: function (req,res) {

    Game.find(req.param('id')).done(function (err,game) {
      if (err) return res.send(err,500);
      if (!game) return res.send("No other game with that id exists!", 404);
      if (game.joined >= game.players) return res.send("No more players can join this game!", 403);

      game.joined += 1;

      // Persist the change
      Game.update(game.id, game, function (err) {
        if (err) return res.send(err,500);

        // If number of users is complete, start the game
        if(game.joined == game.players)
          Move.create({
            game_id: game.id,
            gamer_id: 0,
            act: 'start'
          }).done(function(err, move){
            if (err) return res.send(err,500);
          });

        // Returning the position of the player
        res.json(game.joined-1);
      });
    });

	}

};
module.exports = GameController;
