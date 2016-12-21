# FacebookChatbotService
A simple Facebook chatbot configured to run in Oracle ACCS

Based on: http://www.ateam-oracle.com/getting-started-with-chatbots/

Also see https://developers.facebook.com/docs/messenger-platform/send-api-reference/templates for template details used in the code

For local testing use "ngrok http 8081" (ngrok.com) and replace the webhook URL in developer.facebook.com with the HTTPS link.  Start the local listener (node app.js) at configuration.
For cloud deployment, use webhook URL:  https://FacebookChatbotService-gse00001973.apaas.em2.oraclecloud.com/webhook

Verify token (constant in code) must be entered every time a webhook change is made and you will probably need to go to the Messenger->settings and unsubscribe/resubscribe the page
