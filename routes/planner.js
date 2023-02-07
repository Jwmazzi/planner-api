var express = require('express');
const { route } = require('.');
var router = express.Router();
const db = require('../public/javascripts/db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Please Choose from a Valid Route');
});

router.get('/campaigns', async (req, res, next) => {

  let campaigns = await db.query(db.sql.campaigns);

  res.send({
    "campaigns": campaigns.rows
  });

});

router.get('/campaigns/:campaignId', async (req, res, next) => {

  let campaign = await db.query(db.sql.campaign, [req.params.campaignId]);
  let players  = await db.query(db.sql.campaignPlayers, [req.params.campaignId]);
  let winners  = await db.query(db.sql.campaignWinners, [req.params.campaignId]);

  res.send({
    "campaignInfo": campaign.rows,
    "players": players.rows,
    "winners": winners.rows
  });

});

router.get('/campaigns/:campaignId/games', async (req, res, next) => {

  let games = await db.query(db.sql.campaignGames, [req.params.campaignId]);

  res.send({
    "games": games.rows,
  });

});

router.get('/layouts/:gameId', async (req, res, next) => {

  let layouts = await db.query(db.sql.gameLayout, [req.params.gameId]);

  res.send({
    "layouts": layouts.rows
  });

});


module.exports = router;
