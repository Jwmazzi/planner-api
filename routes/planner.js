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
  let players = await db.query(db.sql.campaignPlayers, [req.params.campaignId]);

  res.send({
    "campaignInfo": campaign.rows,
    "players": players.rows
  });

});


module.exports = router;
