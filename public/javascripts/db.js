const { Pool } = require('pg');
const pool = new Pool();

module.exports = {

    query: async (text, params, callback) => {

        return pool.query(text, params, callback);

    },

    sql: {
        campaigns: `
        select * from campaigns;
        `,

        campaign: `
        select * from campaigns
        where id = $1;
        `,

        campaignPlayers: `
        select players.* from players
        join campaignparticipants on players.id = campaignparticipants.player_id
        where campaignparticipants.campaign_id = $1
        `
    }
}