var mic = new Wit.Microphone(document.getElementById("microphone"));

var ACCESS_TOKEN = "HGQQIL4DFHTMQL3GTOUOCSFKVB53M24P";

var info = function (msg) {
    document.getElementById("info").innerHTML = msg;
};
var error = function (msg) {
    document.getElementById("error").innerHTML = msg;
};
mic.onready = function () {
    info("Shrota is ready to listen");
};
mic.onaudiostart = function () {
    info("Recording started");
    error("");
};
mic.onaudioend = function () {
    info("Recording stopped, processing started");
};
mic.onresult = function (intent, entities) {
    var r = kv("intent", intent);

    for (var k in entities) {
        var e = entities[k];

        if (!(e instanceof Array)) {
            r += kv(k, e.value);
        } else {
            for (var i = 0; i < e.length; i++) {
                r += kv(k, e[i].value);
            }
        }
    }
    document.getElementById("result").innerHTML = r;
    var values = r.split("=");
    var action = values[1];
    if (action.indexOf("send_sms") != -1) {
        if ((action.indexOf("contact") != -1) && (action.indexOf("message_body") != -1)) {
            console.log('contact and message body');
            var contactDetails = values[2];
            var msgBody = values[3];
            var contact = values[2].split("\n");
            var resultDiv = document.getElementById('result');
            resultDiv.innerHTML = resultDiv.innerHTML + 'Hey, Sending message to: ' + contact[0] + " with body: " + msgBody;
        } else if (action.indexOf("contact") != -1) {
            console.log('contact');
            var contactDetails = values[2];
            var contact = values[2].split("\n");
            var resultDiv = document.getElementById('result');
            resultDiv.innerHTML = resultDiv.innerHTML + 'Hey, Sending message to: ' + contact[0] + " , but sorry no proper message detected.";
        } else if (action.indexOf("message_body") != -1) {
            console.log('message_body');
            var msgBody = values[2].split("\n");
            var resultDiv = document.getElementById('result');
            resultDiv.innerHTML = resultDiv.innerHTML + 'Hey, Sending message to \"contact not available\" with body: ' + msgBody[0];
        }
    } else if (action.indexOf("greetings") != -1) {
        var resultDiv = document.getElementById('result');
        resultDiv.innerHTML = resultDiv.innerHTML + 'Hey!! How are you?';
    } else if (action.indexOf("google_search") != -1) {
        var queryString = values[2];
        str = "http://www.google.com/search?hl=en&source=hp&q=" + queryString + "&aq=f&oq=&aqi=";
        var replaced = str.replace(" ", "+");
        window.open(replaced, '_blank');
        var resultDiv = document.getElementById('result');
        resultDiv.innerHTML = resultDiv.innerHTML + 'The results are displayed in the new tab.';
    }
};
mic.onerror = function (err) {
    error("Error: " + err);
};
mic.onconnecting = function () {
    info("Shrota is getting ready");
};
mic.ondisconnected = function () {
    info("Shrota is not connected");
};

mic.connect("HGQQIL4DFHTMQL3GTOUOCSFKVB53M24P");
// mic.start();
// mic.stop();

function kv(k, v) {
    if (toString.call(v) !== "[object String]") {
        v = JSON.stringify(v);
    }
    return k + "=" + v + "\n";
}
