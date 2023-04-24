function tournamentRanking(tournamentName, teamNames, matches) {
  const teamInfo = new Map(
    teamNames.map((teamName) => [
      teamName,
      {
        points: 0,
        gamesPlayed: 0,
        wins: 0,
        ties: 0,
        losses: 0,
        goalsScored: 0,
        goalsAgainst: 0,
        goalDifference: 0,
      },
    ])
  );

  matches.forEach((match) => {
    const [team1, result, team2] = match.split("#");
    const [goals1, goals2] = result.split("@").map(Number);
    teamInfo.get(team1).gamesPlayed += 1;
    teamInfo.get(team2).gamesPlayed += 1;
    teamInfo.get(team1).goalsScored += goals1;
    teamInfo.get(team2).goalsScored += goals2;
    teamInfo.get(team1).goalsAgainst += goals2;
    teamInfo.get(team2).goalsAgainst += goals1;
    if (goals1 > goals2) {
      teamInfo.get(team1).points += 3;
      teamInfo.get(team1).wins += 1;
      teamInfo.get(team2).losses += 1;
    } else if (goals1 < goals2) {
      teamInfo.get(team2).points += 3;
      teamInfo.get(team2).wins += 1;
      teamInfo.get(team1).losses += 1;
    } else {
      teamInfo.get(team1).points += 1;
      teamInfo.get(team2).points += 1;
      teamInfo.get(team1).ties += 1;
      teamInfo.get(team2).ties += 1;
    }
    teamInfo.get(team1).goalDifference =
      teamInfo.get(team1).goalsScored - teamInfo.get(team1).goalsAgainst;
    teamInfo.get(team2).goalDifference =
      teamInfo.get(team2).goalsScored - teamInfo.get(team2).goalsAgainst;
  });

  const sortedTeams = Array.from(teamInfo.keys()).sort((a, b) => {
    if (teamInfo.get(a).points !== teamInfo.get(b).points) {
      return teamInfo.get(b).points - teamInfo.get(a).points;
    }
    if (teamInfo.get(a).wins !== teamInfo.get(b).wins) {
      return teamInfo.get(b).wins - teamInfo.get(a).wins;
    }
    if (teamInfo.get(a).goalDifference !== teamInfo.get(b).goalDifference) {
      return teamInfo.get(b).goalDifference - teamInfo.get(a).goalDifference;
    }
    if (teamInfo.get(a).goalsScored !== teamInfo.get(b).goalsScored) {
      return teamInfo.get(b).goalsScored - teamInfo.get(a).goalsScored;
    }
    if (teamInfo.get(a).gamesPlayed !== teamInfo.get(b).gamesPlayed) {
      return teamInfo.get(a).gamesPlayed - teamInfo.get(b).gamesPlayed;
    }
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });

  const standings = sortedTeams.map((team, index) => {
    const {
      points,
      gamesPlayed,
      wins,
      ties,
      losses,
      goalsScored,
      goalsAgainst,
      goalDifference,
    } = teamInfo.get(team);
    return `${index + 1}) ${team} ${points}p, ${gamesPlayed}g (${wins}-${ties}-${losses}), ${goalDifference}gd (${goalsScored}-${goalsAgainst})`;
  });

  return `${tournamentName}\n${standings.join("\n")}\n`;
}

function processInput(input) {
  const lines = input.trim().split("\n");
  const n = Number(lines.shift());
  let output = "";
  for (let i = 0; i < n; i++) {
    // read tournament name, team names, and matches
    const tournamentName = lines.shift();
    const numTeams = Number(lines.shift());
    const teamNames = [];
    for (let j = 0; j < numTeams; j++) {
      teamNames.push(lines.shift());
    }
    const numMatches = Number(lines.shift());
    const matches = [];
    for (let j = 0; j < numMatches; j++) {
      matches.push(lines.shift());
    }
    // calculate tournament ranking and add to output string
    output += tournamentRanking(tournamentName, teamNames, matches);
  }
  return output.trim();
}

// example usage:
const input = `2
World Cup 1998 - Group A
4
Brazil
Norway
Morocco
Scotland
6
Brazil#2@1#Scotland
Norway#2@2#Morocco
Scotland#1@1#Norway
Brazil#3@0#Morocco
Morocco#3@0#Scotland
Brazil#1@2#Norway
Some strange tournament
5
Team A
Team B
Team C
Team D
Team E
5
Team A#1@1#Team B
Team A#2@2#Team C
Team A#0@0#Team D
Team E#2@1#Team C
Team E#1@2#Team D`;
console.log(processInput(input));
