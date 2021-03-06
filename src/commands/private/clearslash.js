module.exports = {
  name: "clearslash",
  async execute(msg) {
    if (msg.author.id !== "279032930926592000") return;

    const chalk = require("chalk");
    const { REST } = require("@discordjs/rest");
    const { Routes } = require("discord-api-types/v9");
    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
    let applicationCommandData = [];
    await rest
      .put(Routes.applicationCommands(client.user.id), {
        body: applicationCommandData,
      })
      .then(() =>
        console.log(
          chalk.bold.blue("[BOT]") +
            " Successfully cleared application commands"
        )
      )
      .catch(console.error);
  },
};
