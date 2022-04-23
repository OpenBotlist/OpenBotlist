const { MessageEmbed } = require("discord.js")

module.exports = {
  name: "decline",
  isTeamOnly: true,
  isBottumReviewerOnly: true,
  async execute(client, message, args) {
    const id = args[0];
    const reason = args.slice(1).join(' ');

    if (id === undefined) {
      await message.channel.send(
        'You must provide the ID of the Discord bot you want to decline.'
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
      .setColor('RED')
      .addField('BOT NAME', bot.name)
      .addField('DECLINED BY', message.author.tag)
      .addField('REASON', reason)
      .setDescription(`Declined at: ${time(new Date(), 'F')}`);

    // sends the bot owner a DM about their bots have been declined
    const owner = await client.users.fetch(bot.owner).catch(() => null);

    if (owner === null) {
      client.db.delete(id);
      await message.channel.send(
        'Looks like the owner of that bot has been deleted.'
      );
      return;
    };

    await owner
      .send({
        content: `NOOO.... YOUR BOT HAVE BEEN DECLINED FOR THIS REASON: ${reason}`
      })
      .catch(() => undefined);
    // send the log embed to mod logs channel;
    const log = client.channels.cache.get(client.botoptions.logs.modlogs);
    await log.send({ embeds: [modLogEmbed] });

    client.db.delete(id);
  }
}
