export const getPlayers = async ({ lineup }) => {
    const players = [];

    // Don't continue until we've loaded all players
    // TODO: This would need to more gracefully fail if we're unable to
    // load one or more players; currently the whole app will fail to load
    // if that happens.
    await Promise.all(lineup.map(async ({ id: playerId }) => {
        if (!playerId) {
            return;
        }

        // Load the information for this player
        const playerResponse = await fetch(
            `https://lookup-service-prod.mlb.com/json/named.player_info.bam?sport_code=%27mlb%27&player_id=${playerId}&player_info.col_in=player_id,name_full,team_name,jersey_number,team_abbrev,name_last,name_first,name_use`
        );

        const {
            player_info: {
                queryResults: { row: player },
            },
        } = await playerResponse.json();

        players.push(player);
    }));

    return players
        // And then sort by player last name
        .sort((a, b) => a.name_last.localeCompare(b.name_last))

        // Sort first by team name
        .sort((a, b) => a.team_name.localeCompare(b.team_name));
}