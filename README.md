# **Discord Bot API Queue**

Optional integration for API Queue.

This queue is used to call API through [Discord Bot Player](https://github.com/RaFaTEOLI/discord-bot-player), to enable this you need to change the BOT_USE_API_QUEUE to true in the env file from the player.

When this integration is enabled on the Bot Player, it will receive all music and music queue actions from the player, this way the Player won't rely on the API itself, so if the API fails, the messaging queue from API Queue will have all the updates and will sync to API whenever it can.

We advise you to enable this if you don't want the player to stop playing whenever the API is down or fails to save your request.

This project is related to:

- Bot Player: https://github.com/RaFaTEOLI/discord-bot-player
- Bot App: https://github.com/RaFaTEOLI/discord-bot-app
- Bot API: https://github.com/RaFaTEOLI/discord-bot-api
