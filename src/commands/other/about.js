module.exports = {
  name: "about",
  description: "",
  execute(msg, args) {
    const Discord = require("discord.js");

    // Update SQLite database when someone uses the command
    const SQLite = require("better-sqlite3");
    const sql = new SQLite("./src/databases/stats.sqlite");
    var stats = sql.prepare("SELECT * FROM stats WHERE stay = 1").get();
    stats.about++;
    stats.total++;
    sql
      .prepare(
        "INSERT OR REPLACE INTO stats (total, anime, manga, character, help, about, invite, quote, stay, slashanime, slashmanga) VALUES (@total, @anime, @manga, @character, @help, @about, @invite, @quote, @stay, @slashanime, @slashmanga);"
      )
      .run(stats);

    const embed = new Discord.MessageEmbed()
      .setTitle(`About Anime Bible`)
      .setURL(`https://chr1s.dev/anime`)
      .setAuthor(
        "About!",
        "https://chr1s.dev/assets/animelist.png",
        "https://chr1s.dev/anime"
      )
      .setColor("#55128E")
      .setDescription(
        `Lets the user search for various anime, manga, characters and quotes from the extensive selection at AniList.co. Uses the AniList.co GraphQL API to fetch images, titles, ratings, episode count, etc... If you like this bot, consider supporting me over on patreon! https://www.patreon.com/chr1sdev`
      )
      .setFooter(
        `Developer: Chr1s (christopher#8888)`,
        `https://chr1s.dev/assets/verified_dev.png`
      );
    //.setThumbnail(`https://chr1s.dev/assets/animelist.png`)
    msg.channel.send({ embeds: [embed] });
  },
};
