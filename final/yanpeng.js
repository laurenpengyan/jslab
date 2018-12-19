// Global variables
var play_times = 0;
var won_times = 0;
var played_stats = [0, 0, 0, 0, 0, 0, 0];

// Initialize the variables
function init() {
    play_times = 0;
    won_times = 0;
    played_stats = [0, 0, 0, 0, 0, 0, 0];
}

// Roll dice
function roll() {

    // Roll the dice
    var die1 = document.getElementById("die1");
    var die2 = document.getElementById("die2");

    var d1 = Math.floor(Math.random() * 6 + 1);
    var d2 = Math.floor(Math.random() * 6 + 1);

    // Increase the play times
    play_times++;
    played_stats[d1] = played_stats[d1] + 1;
    played_stats[d2] = played_stats[d2] + 1;

    var diceTotal = d1 + d2;

    // Set the display
    die1.innerHTML = d1;
    die2.innerHTML = d2;

    // Current result
    var status = document.getElementById("status");
    status.innerHTML = "You rolled a total of " + diceTotal + ". </p>";

    if (d1 == d2) {
        status.innerHTML += "DOUBLES! YOU GET A FREE TURN!  ";
        status.innerHTML += "You have rolled two " + d1 + " for " + played_stats[d1] + " times or " + (
            played_stats[d1] / (play_times * 2.0) * 100.0).toFixed(2) + "% of your rolls! ";
        won_times++;
    } else {
        status.innerHTML += "You have rolled a " + d1 + " for " + played_stats[d1] + " times or " + (
                played_stats[d1] / (play_times * 2.0) * 100.0).toFixed(2) + "% of your rolls and a " + d2 + " for " +
            played_stats[d2] + " times or " + (
                played_stats[d2] / (play_times * 2.0) * 100.0).toFixed(2) + "% of your rolls! ";
    }

}

// Stop and show the statistics
function stop() {

    var status = document.getElementById("status");
    status.innerHTML = "Played " + play_times + " times! " + won_times + " WON!";

    reset();

}