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
        `,

        campaignWinners: `
        select winner_id, players.name, count(*) as wins
        from games
        left join players on players.id = games.winner_id
        where games.campaign_id = $1
        group by winner_id, players.name
        `,

        campaignGames: `
        select *, locations.id as layout_id, games.id as game_id, st_asgeojson(geom) as geojson
        from games
        left join locations on games.location_id = locations.id
        where campaign_id = $1
        order by gamedate desc
        `,

        game: `
        select * from games
        where id = $1
        `,
        
        gameLayout: `
        select st_asgeojson(geom) as geojson, 'poly'
        from layoutpolygons
        where game_id = $1
        union
        select st_asgeojson(geom) as geojson, 'line'
        from layoutlines
        where game_id = $1
        `
    }
}