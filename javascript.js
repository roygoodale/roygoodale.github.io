function createTeams(players) {
  // Sort the players by rating in descending order
  const sortedPlayers = players.slice().sort((a, b) => b.rating - a.rating);

  // Determine the number of teams based on the number of players
  let numTeams;
  if (players.length <= 10) {
    numTeams = 2;
  } else if (players.length <= 15) {
    numTeams = 3;
  } else if (players.length <= 20) {
    numTeams = 4;
  } else {
    // Handle additional cases as needed
    console.error("Unsupported number of players");
    return null;
  }

  // Initialize variables
  let minDifference = Infinity;
  let bestTeams = null;

  // Helper function to calculate the total rating of a team
  const calculateTotalRating = (team) => team.reduce((sum, player) => sum + player.rating, 0);

  // Helper function to generate all possible team combinations
  const generateTeamCombinations = (teams, index) => {
    if (index === sortedPlayers.length) {
      const teamRatings = teams.map(calculateTotalRating);
      const difference = Math.max(...teamRatings) - Math.min(...teamRatings);

      if (difference < minDifference) {
        minDifference = difference;
        bestTeams = teams.map(team => [...team]);
      }

      return;
    }

    for (let i = 0; i < numTeams; i++) {
      // Check if adding the player to the current team will maintain a small difference
      const currentTeamLengths = teams.map(team => team.length);
      const newTeamLengths = currentTeamLengths.map((length, j) => (j === i ? length + 1 : length));
      const newDifference = Math.max(...newTeamLengths) - Math.min(...newTeamLengths);

      if (newDifference <= 1) {
        teams[i].push(sortedPlayers[index]);
        generateTeamCombinations(teams, index + 1);
        teams[i].pop();
      }
    }
  };

  // Generate all possible team combinations
  generateTeamCombinations(Array.from({ length: numTeams }, () => []), 0);

  return bestTeams;
}

function printTeams(teams) {
  teams.forEach((team, index) => {
    const totalRating = team.reduce((sum, player) => sum + player.rating, 0);
    const playerNames = team.map(player => player.name).join(', ');
    $('#created-teams').append(`<p>Team ${index + 1}: ${playerNames} (Total Rating: ${totalRating})</p>`);
  });
}

var players = [

]

function deletePlayer(e) {
	console.log('clicked')
	var playerID = $(e.target).attr('data-playerid');

  console.log('playerID: ', playerID)
  players = players.filter(function( obj ) {
    return obj.id !== parseInt(playerID);
  });

  console.log(players)

  $(e.target).parent().remove()
}

$( document ).ready(function() {
  $('#save-player').click(function() {
    var playerName = $('#player-name').val();
    var playerRating = parseInt($('#player-rating').val());
    if (!playerName || !playerRating) {
      alert("Please fill in both fields.")
    }
    var nextID = Object.keys(players).length + 1
    players.push({id: nextID, name: playerName, rating: playerRating})

    console.log(players)

    $('#player-list').append(`<div data-id='${nextID}'>${playerName} [id: ${nextID}] <button data-playerid='${nextID}' className='del-player' onClick='deletePlayer(event)'>Delete</button></div>`)
  })

  $('#create-teams').click(function() {
    $('#created-teams').empty()
    const teams = createTeams(players);

    printTeams(teams)
  })
});


