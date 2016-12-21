//
// Sample Facebook Chatbot
//
// Ed Shnekendorf, ed.shnekendorf@oracle.com, 12/20/2016
//
// Based on: http://www.ateam-oracle.com/getting-started-with-chatbots/
//
// For local testing use "ngrok http 8081" (ngrok.com) and replace the webhook URL in developer.facebook.com with the HTTPS link.  Start the local listener (node app.js) at configuration.
// For cloud deployment, use webhook URL:  https://FacebookChatbotService-gse00001973.apaas.em2.oraclecloud.com/webhook
// Verify token (see below) must be entered every time a webhook change is made and you will probably need to go to the Messenger-> settings and unsubscribe/resubscribe the page
//

"use strict";

var VERIFY_TOKEN = 'ed-chatbot-service';
var ACCESS_TOKEN = 'EAAXPpGLXAe8BALMikoOjz0ZBWFi5II7BIUp0assquNdIx3FWvuSxA3pqdFAqat9H0tJQweaFIZCZCZAZCwiAhOshIaTFKMJhjoenCKSaZAivhLJwLuKQTnZAkB8WGH6hHze1a4PPcGxIS5iLEupqQ74zYcxXfmqenrBZBJ4SIkQgxAZDZD';
var PORT = process.env.PORT || 8081;
var VERSION = "1.0.0";

// set the image docroot.  If we're running locally use the localhost, otherwise the ACCS address
var imageDocRoot = "http://localhost:" + PORT + "/";
if (PORT != 8081)
    imageDocRoot = "http://FacebookChatbotService-gse00001973.apaas.em2.oraclecloud.com/";

var express = require('express');
var bodyParser = require('body-parser');
var Botly = require('botly');

var botly = new Botly({
    accessToken: ACCESS_TOKEN,
    verifyToken: VERIFY_TOKEN,
    webHookPath: '/',
    notificationType: Botly.CONST.REGULAR
});

var users = {};

botly.on('message', function (sender, message, data) {
    console.log("----------MSG START-----------");
    console.log(message);
    console.log("---------- MSG END -----------");


    if (users[sender]) {
        if (data && data.text && data.text.indexOf("picture") !== -1) {
            botly.sendImage({
                id: sender,
                url: "https://s-media-cache-ak0.pinimg.com/originals/8b/9c/55/8b9c55bc07aeca329b8cdd3bbe5f6c57.jpg"
            }, function (err, whatever) {
                console.log(err);
            });
            botly.sendText({
                id: sender,
                text: `I look prety fine, don't I?`
            }, function (err, data) {
                console.log("send generic cb:", err, data);
            });
        } else if (data && data.text && data.text.indexOf("version") !== -1) {
            botly.sendText({
                id: sender,
                text: `${users[sender].first_name}, how corteous of you to inquire.  My version is ${VERSION}`
            }, function (err, data) {
                console.log("send generic cb:", err, data);
            });
        } else if (data && data.text && data.text.indexOf("AppDev") !== -1) {
            let buttons = [];
            buttons.push(botly.createWebURLButton("View", "https://cloud.oracle.com/en_US/paas#OPC_ANCHOR_APPDEV"));
            botly.sendButtons({
                id: sender,
                text: "Click here to see all AppDev services",
                buttons: buttons
            }, function (err, data) {
                console.log("send buttons cb:", err, data);
            });
        } else if (data && data.text && (data.text.toLowerCase().indexOf("oracle") !== -1 || data.text.toLowerCase().indexOf("paas") !== -1)) {
            botly.sendAction({
                id: sender,
                action: Botly.CONST.ACTION_TYPES.TYPING_ON
            }, function (err, data) {
                //log it
            });

            botly.sendText({
                id: sender,
                text: `Here are Oracle's top AppDev PaaS services:`
            }, function (err, data) {
                console.log("send generic cb:", err, data);
            });

            botly.sendAction({
                id: sender,
                action: Botly.CONST.ACTION_TYPES.TYPING_ON
            }, function (err, data) {
                //log it
            });

            let element = botly.createListElement({
                title: "Application Container Cloud Service",
                subtitle: "Cloud Native Polyglot Platform",
                image_url: `${imageDocRoot}java_ee.PNG`,
                buttons: [
                    {
                        title: "View",
                        url: "https://cloud.oracle.com/application-container-cloud"
                    }
                ]
            });

            let element2 = botly.createListElement({
                title: "Java Cloud Service",
                subtitle: "Cloud-based Java EE Runtime",
                image_url: `${imageDocRoot}accs.PNG`,
                buttons: [
                    {
                        title: "View",
                        url: "https://cloud.oracle.com/en_US/java"
                    }
                ]
            });

            let element3 = botly.createListElement({
                title: "Mobile Cloud Service",
                subtitle: "Mobile Backend-as-a-Service",
                image_url: `${imageDocRoot}mobile.PNG`,
                buttons: [
                    {
                        title: "View",
                        url: "https://cloud.oracle.com/en_US/mobile"
                    }
                ]
            });

            botly.sendList({
                id: sender,
                elements: [element, element2],
                buttons: botly.createPostbackButton("All AppDev Services", "All AppDev Services"),
                top_element_style: Botly.CONST.TOP_ELEMENT_STYLE.COMPACT
            }, function (err, data) {
                console.log("send list cb:", err, data);
            });
        } else if (data && data.text && data.text.indexOf("receipt") !== -1) {
            botly.sendAction({
                id: sender,
                action: Botly.CONST.ACTION_TYPES.TYPING_ON
            }, function (err, data) {
                //log it
            });

            let payload = {
                "recipient_name": `${users[sender].first_name} ${users[sender].last_name}`,
                "order_number": "12345678902",
                "currency": "USD",
                "payment_method": "Visa 2345",
                "order_url": "http://petersapparel.parseapp.com/order?order_id=123456",
                "timestamp": Math.floor(Date.now() / 1000),
                "elements": [
                    {
                        "title": "Classic White T-Shirt",
                        "subtitle": "100% Soft and Luxurious Cotton",
                        "quantity": 2,
                        "price": 50,
                        "currency": "USD",
                        "image_url": "http://petersapparel.parseapp.com/img/whiteshirt.png"
                    },
                    {
                        "title": "Classic Gray T-Shirt",
                        "subtitle": "100% Soft and Luxurious Cotton",
                        "quantity": 1,
                        "price": 25,
                        "currency": "USD",
                        "image_url": "http://petersapparel.parseapp.com/img/grayshirt.png"
                    }
                ],
                "address": {
                    "street_1": "1 Hacker Way",
                    "street_2": "",
                    "city": "Menlo Park",
                    "postal_code": "94025",
                    "state": "CA",
                    "country": "US"
                },
                "summary": {
                    "subtotal": 75.00,
                    "shipping_cost": 4.95,
                    "total_tax": 6.19,
                    "total_cost": 56.14
                },
                "adjustments": [
                    {
                        "name": "New Customer Discount",
                        "amount": 20
                    },
                    {
                        "name": "$10 Off Coupon",
                        "amount": 10
                    }
                ]
            };

            botly.sendReceipt({
                id: sender,
                payload: payload
            }, function (err, data) {
                console.log("send generic cb:", err, data);
            });
        } else {
            botly.sendAction({
                id: sender,
                action: Botly.CONST.ACTION_TYPES.TYPING_ON
            }, function (err, data) {
                //log it
            });

            botly.send({
                id: sender,
                message: {
                    text: `${users[sender].first_name}, are you interested in learning about Oracle PaaS, seeing a receipt for your recent purchase, or seeing an picture of me?`
                }
            }, function (err, data) {
                console.log("regular send cb:", err, data);
            });
        }
    } else {
        botly.sendAction({
            id: sender,
            action: Botly.CONST.ACTION_TYPES.TYPING_ON
        }, function (err, data) {
            //log it
        });

        botly.getUserProfile(sender, function (err, info) {
            users[sender] = info;

            console.log(JSON.stringify(info));
            botly.sendText({
                id: sender,
                text: `Hello ${users[sender].first_name}.  I hope you're having a fabulous day!`
            }, function (err, data) {
                console.log("send text cb:", err, data);
            });
        });
    }
});

botly.on("postback", function (sender, message, postback) {
    let buttons = [];
    buttons.push(botly.createWebURLButton("View", "https://cloud.oracle.com/en_US/paas#OPC_ANCHOR_APPDEV"));
    botly.sendButtons({
        id: sender,
        text: "Click here to see all AppDev services",
        buttons: buttons
    }, function (err, data) {
        console.log("send buttons cb:", err, data);
    });
});


var app = express();
app.use(bodyParser.json());
app.use(express.static('./doc_root'));
app.use("/webhook", botly.router());
app.listen(PORT);
console.log("Chatbot Service started and listening on port " + PORT);
