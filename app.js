// Based on: http://www.ateam-oracle.com/getting-started-with-chatbots/
// For local testing use "ngrok http 8081" (ngrok.com) and replace the webhook URL in developer.facebook.com

var VERIFY_TOKEN = 'ed-chatbot-service';
var ACCESS_TOKEN = 'EAAXPpGLXAe8BALMikoOjz0ZBWFi5II7BIUp0assquNdIx3FWvuSxA3pqdFAqat9H0tJQweaFIZCZCZAZCwiAhOshIaTFKMJhjoenCKSaZAivhLJwLuKQTnZAkB8WGH6hHze1a4PPcGxIS5iLEupqQ74zYcxXfmqenrBZBJ4SIkQgxAZDZD';
var PORT = process.env.PORT || 8081;

var express = require('express');
var bodyParser = require('body-parser');
var Botly = require('botly');

var botly = new Botly({
    accessToken: ACCESS_TOKEN,
    verifyToken: VERIFY_TOKEN,
    webHookPath: '/',
    notificationType: Botly.CONST.REGULAR
});

botly.on('message', function (userId, message, data) {
    console.log("----------MSG START-----------");
    console.log(message);
    console.log("---------- MSG END -----------");
    botly.sendText({
        id: userId,
        text: 'Hello back from my automated BOT!!!'
    }, function (error, data) {
        if (error) {
            console.log(error);
        } else {
            console.log('message sent...');
        }
    });
});

botly.on("postback", function (userId, message, postback) {
    console.log(postback);
});


var app = express();
app.use(bodyParser.json());
app.use("/webhook", botly.router());
app.listen(PORT);
console.log("Chatbot Service started and listening on port " + PORT);
