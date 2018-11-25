document.querySelector('input[type=button]').addEventListener('click', function () { rollTheDice(); });

var rollTheDice = function () {
    var i,
        faceValue,
        output = '',
        diceCount = document.querySelector('input[type=number]').value || 1;
    for (i = 0; i < diceCount; i++) {
        faceValue = Math.floor(Math.random() * 6);
        output += "&#x268" + faceValue + "; ";
    }
    document.getElementById('dice').innerHTML = output;
}