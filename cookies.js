window.addEventListener("load", showLastVisit, false);

function showLastVisit() {

    // Display last visit cookie if exists
    if (document.cookie != "") {
        var thisCookie = document.cookie.split("; "); // first step to split by ; 

        // Second step split by =
        for (var i = 0; i < thisCookie.length; i++) {
            var key = thisCookie[i].split("=")[0];
            if (key == "last_visit") {
                document.getElementById("last_visit").innerHTML = thisCookie[i].split("=")[1];
            }
        }
    }

    // Set last visit cookie
    document.cookie = "last_visit=" + new Date();
}
