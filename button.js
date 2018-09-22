window.onload = yp_function;

function yp_function() {
  document.getElementById("Tokyo").onclick = showTextMessage;
  document.getElementById("Osaka").onclick = showTextMessage;
  document.getElementById("Hokkaido").onclick = showTextMessage;

	document.getElementById("Tokyo1").onclick = showTextMessageEmbedded;
  document.getElementById("Osaka1").onclick = showTextMessageEmbedded;
  document.getElementById("Hokkaido1").onclick = showTextMessageEmbedded;



  


}

function showTextMessage() {
  switch (this.id) {
    case "Tokyo":
		  alert("Japan's capital and the world's most populous metropolis");
      break;
    case "Osaka":
		  alert("Osaka is Japan's second city");
      break;
    case "Hokkaido":
		  alert("The second largest island of Japan");
      break;
    default:
  }
}
