module.exports = {
  name: "manga",
  execute(interaction) {
    const Discord = require("discord.js");
    const sanitizeHtml = require("sanitize-html");
    const fetch = require("node-fetch");

    const SQLite = require("better-sqlite3");
    const sql = new SQLite("./src/databases/stats.sqlite");
    var stats = sql.prepare("SELECT * FROM stats WHERE stay = 1").get();
    stats.slashmanga++;
    stats.total++;
    sql
      .prepare(
        "INSERT OR REPLACE INTO stats (total, anime, manga, character, help, about, invite, quote, stay, slashanime, slashmanga) VALUES (@total, @anime, @manga, @character, @help, @about, @invite, @quote, @stay, @slashanime, @slashmanga);"
      )
      .run(stats);

    let name = interaction.options.data[0].value;
    let query = (name) => `
    {
        Media(search: "${name}", type: MANGA, isAdult: false) {
          coverImage {
            extraLarge
            large
            medium
            color
          }
          title {
            romaji
            english
            native
            userPreferred
          }
          description(asHtml: false)
          episodes
          averageScore
          genres
        }
      }
    `;

    let url = "https://graphql.anilist.co",
      options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: query(name),
          variables: { search: name },
        }),
      };

    fetch(url, options)
      .then(handleResponse)
      .then(handleData)
      .catch(handleError);

    function handleResponse(response) {
      return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
      });
    }

    function handleData(results) {
      let dirty = results.data.Media.description.substring(0, 250);
      const desc = sanitizeHtml(dirty, {
        allowedTags: [],
        allowedAttributes: {},
      });

      const embed = new Discord.MessageEmbed()
        .setAuthor(
          `${results.data.Media.title.romaji} (${results.data.Media.title.native})`,
          `https://anilist.co/img/icons/favicon-32x32.png`,
          `https://anilist.co`
        )
        .setColor("#55128E")
        .setDescription(`${desc}...`)
        .setFooter(
          results.data.Media.averageScore
            ? `Average Score: ${results.data.Media.averageScore}/100`
            : "",
          `https://chr1s.dev/assets/animelist.png`
        )
        .setThumbnail(`${results.data.Media.coverImage.extraLarge}`);
      if (
        results.data.Media.genres.includes("Ecchi") &&
        interaction.channel.nsfw == false
      ) {
        interaction.reply({
          content: `**Ecchi manga only allowed in NSFW channel**`,
          ephemeral: true,
        });
      } else {
        interaction.reply({ embeds: [embed], ephemeral: true });
      }
    }

    function handleError(error) {
      interaction.reply({
        content: "**Error:** Invalid manga name!",
        ephemeral: true,
      });
    }
  },
};
