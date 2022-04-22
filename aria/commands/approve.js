const { MessageEmbed } = require("discord.js")

module.exports = {
  name: "approve",
  isTeamOnly: true,
  isBottumReviewerOnly: true,
  async execute(client, message, args) {
    const id = args[0];
    if (id === undefined) {
      await message.channel.send(
        'You must provide the ID of the Discord bot you want to approve.'
      );
      return;
    };

    const user = await client.users.fetch(id).catch(() => null);
    if (user === null) {
      await message.channel.send('No bot with the specified ID exists.');
      return;
    };
    if (!user.bot) {
      await message.channel.send("That's not a bot.");
      return;
    };

    if (!client.db.has(id)) {
      await message.channel.send('That bot is not in the queue.');
      return;
    };

    const bot = client.db.get(id);

    const modLogEmbed = new MessageEmbed()
      .setColor('GREEN')
      .addField('BOT NAME', bot.name)
      .addField('APPROVED BY', message.author.tag)
      .setDescription(`Approved at: ${time(new Date(), 'F')}`);

    // sends the bot owner a DM about their bots have been apporoved
    const owner = await client.users.fetch(bot.owner).catch(() => null);
    if (owner === null) {
      client.db.delete(id);
      await message.channel.send(
        'Looks like the owner of that bot has been deleted.'
      );
      return;
    };

    await owner
      .send({ content: 'WOOO! :tada: YOUR BOT HAS BEEN APPOROVED' })
      .catch(() => undefined);

    // send the log embed to mod logs channel;
    const log = client.channels.cache.get(client.botoptions.logs.modlogs);
    await log.send({ embeds: [modLogEmbed] });

    // make the approved option true on db;
    bot.approved = true;
  }
}