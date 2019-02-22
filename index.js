//  firebase-url-shortener  -   https://github.com/ajzbc/firebase-url-shortener
//  created by @ajzbc       -   https://ajzbc.com

let projectID = "fire-url" //replace with your project id
let collection = "list" // replace with the firestore collection you want to use
var local = window.location.href //shortened url used when displaying shortened url
var hashLength = 5 //length of random hash

var api = "https://firestore.googleapis.com/v1beta1/projects/"+projectID+"/databases/(default)/documents/"+collection;

var urlHash = window.location.hash.substr(1);

if(window.location.hash != "") {
    var url = api + "/" + urlHash;
    fetch(url).then(response => {
        return response.json();
    }).then(data => {
        window.location.href = data.fields.url.stringValue;
    }).catch(err => {
        console.log(err);
    });
}

function longURL() {
    var url = document.getElementById("url").value;
    if(url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }
    else {
        return "http://" + url;
    }
}

function randomHash() {
    var final = "";
    var set = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < hashLength; i++) {
        final += set.charAt(Math.floor(Math.random() * set.length));
    }
    return final;
}

function generateHash() {
    var random = randomHash()
    checkRandom(random);
    return random;
}

function checkRandom(str) {
    var url = api + "/" + str;
    fetch(url).then(function(response) {
        console.log(str);
        if (response.status !== 404) {
            console.log("exist");
            generateHash();
        }
    });
}

function checkCustom(custom, fn) {
    var url = api + "/" + custom;
    fetch(url).then(function(response) {
        if (response.status !== 404) {
            fn(false);
        }
        else {
            fn(true);
        }
    }).catch((error) => {
        //console.log(error)
    });
}

function postShort(long, hash) {
    var url = api + "?documentId=" + hash;
    var data = {
        "fields": {
            "url": {
                "stringValue": long
            }
        }
    };
    fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers:{
        'Content-Type': 'application/json'
    }
    }).then(res => res.json())
    .then(response => {
        notice("successfully shortened link", "good");
        addLink(local + "#" + hash);
    })
    .catch(error => console.error('Error:', error));
}

function addLink(url) {
    var input = document.createElement("input");
    input.id = "shortInput";
    input.value = url;
    var form = document.getElementById("form");
    form.innerHTML = "";
    form.appendChild(input);
    document.getElementById("shortInput").select();
}

function notice(message, state) {
    document.getElementById("notice").innerHTML = message;
    if(state == "good") {
        document.getElementById("notice").style.color = "#33cc33";
    }
    else {
        document.getElementById("notice").style.color = "#FF0000"
    }
}

function short() {
    if(document.getElementById("url").value != "") {
        regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        if(!regexp.test(longURL())) {
            notice("Please enter a valid url");
            document.getElementById("url").value = "";
        } else {
            if(document.getElementById("custom").value == "") {
                postShort(longURL(), generateHash());
            }
            else {
                var custom = document.getElementById("custom").value;
                if(custom.match(/^[0-9a-zA-Z]+$/)) {

                    checkCustom(custom, function(status){
                        if(status == false) {
                            document.getElementById("custom").value = "";
                            notice("Custom alias taken");
                        }
                        else {
                            postShort(longURL(), custom);
                        }
                    });
                }
                else {
                    document.getElementById("custom").value = "";
                    notice("Custom alias can only contains letters and numbers");
                }
            }
        }
    }
    else {
        notice("Please enter a url to shorten");
    }
}