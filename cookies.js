window.addEventListener("load", showVisitInfo, false);

function showVisitInfo() {

    var visit_count = 0;

    // Display last visit cookie if exists
    if (document.cookie != "") {
        var thisCookie = document.cookie.split("; "); // first step to split by ; 

        // Second step split by =
        for (var i = 0; i < thisCookie.length; i++) {
            var key = thisCookie[i].split("=")[0];

            if (key == "last_visit") {
                document.getElementById("last_visit").innerHTML = thisCookie[i].split("=")[1];
            } else if (key == "visit_count") {
                visit_count = parseInt(thisCookie[i].split("=")[1]);
                document.getElementById("visit_count").innerHTML = visit_count;
            }

        }
    }

    // Set visit cookies
    document.cookie = "last_visit=" + new Date();
    document.cookie = "visit_count=" + (++visit_count);

}
