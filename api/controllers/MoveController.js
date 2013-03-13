/*---------------------
	:: Move
	-> controller
---------------------*/
var MoveController = {

	// To trigger this action locally, visit: `http://localhost:port/move/make`
	make: function (req,res) {

    if(!req.param('id')) return res.send("id must be defined", 404);
    if(!req.param('gamer_id')) return res.send("gamer_id must be defined", 404);
    if(!req.param('act')) return res.send("act must be defined", 404);
    if(!req.param('pos_x')) return res.send("pos_x must be defined", 404);
    if(!req.param('pos_y')) return res.send("pos_y must be defined", 404);
    if(req.param('act') == 'wall' && !req.param('align')) return res.send("align must be defined when act is 'wall'", 404);

    Game.find(req.param('id'))
    .done(function(err, game) {

      if (err) return res.send(err,500);

      Move.findAllByGame_id(game.id).sort('createdAt DESC').limit(1)
      .done(function(err, moves){
        if (err) return res.send(err,500);

        var last_move = moves[0];
        if(last_move.act == 'start' && req.param('gamer_id') != last_move.gamer_id)
          return res.send("It is not your turn to play!", 403);
        if(last_move.act != 'start' && req.param('gamer_id') != ((last_move.gamer_id + 1) % game.players))
          return res.send("It is not your turn to play!", 403);

        // Creating the move
        Move.create({
          game_id: game.id,
          gamer_id: parseInt(req.param('gamer_id'),10),
          act: req.param('act'),
          pos_x: parseInt(req.param('pos_x'),10),
          pos_y: parseInt(req.param('pos_y'),10),
          align: req.param('align')
        }).done(function(err,move){
          if (err) return res.send(err,500);
          res.json(move);
        });
      });

    });

	},

  check: function (req,res) {
    Move.findAll({
      game_id: req.param('id')
    })
    .sort('createdAt ASC')
    .done(function(err,moves){
      if (err) return res.send(err,500);
      res.json(moves);
    });
  }

};
module.exports = MoveController;
