# Telegram-Bot
This is the setup of a telegram-bot which when added to channels can log the chats into a Notion page, with access to files, messages being edited, etc. The various steps in the setup and usage of this are:

* Create a new Telegram bot using the steps listed [here](@https://core.telegram.org/bots#6-botfather)
* Setup the Notion API keys
* Add the webhook to the Telegram bot
* Run the server to handle updates to the Telegram bot
* Add the telegram bot to your channel as an admin.

After following the above steps, the bot should log the messages in the channel to the corresponding notion doc.

The steps for setup of the repository are as follows:

1. Clone this repository, and open it in VSCode (or any other code editor)
2. Install the node modules by running ```npm install```
3. Create a ```.env``` file in the root directory of the project, and the ```BOT_TOKEN``` obtained from creating the new bot.
4. Follow the steps listed [here](https://developers.notion.com/docs/getting-started) to setup the ```NOTION_KEY``` & ```NOTION_DATABASE``` in the ```.env``` file
5. Once the ```.env``` is setup, run the server using ```npm server.js```
6. In order to receive updates from the Telegram webhooks locally, we need to use tunnel the requests using ngrok. Run the command ```./ngrok http 80```. This should output a url through which localhost can be accessed through a different machine. Copy the https url and add it to the env file as ```WEBHOOK_URL``` after appending "/update" to the url. The value of ```WEBHOOK_URL``` should look something like https://bbd43a2d2d9f.ngrok.io/update
7. With the server running, and ngrok taking care of the tunneling, we are ready to attach the webhook to our Telegram bot. Run ```node main.js``` to attach the webhook to the telegram-bot. 

Now, we are ready to view the results. Add the telegram to any channel as an admin. From the next message onwards, you will see messages being logged into the Notion doc.
