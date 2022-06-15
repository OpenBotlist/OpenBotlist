module.exports = {
  name: "add-bot",
  isAddBotChannelOnly: true,
  usage: "<bot-id> <prefix> <description...>", // todo, use custom usage modules (dennis)
  async execute(client, message, args) {
    const sendUsage = async (missing) => {
      await message.channel.send(`**Usage:** \`${client.botoptions.prefix}${this.name} ${this.usage}\`\n:x: ${missing}`);
    };
    
    const id = args[0];
    if (id === undefined) {
      await sendUsage('The ID of the Discord bot is required.');
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

    const prefix = args[1];
    if (prefix === undefined) {
      await sendUsage('You must specify the prefix of the bot.');
      return;
    };
    if (prefix.length > 10) {
      await sendUsage(
        "The prefix length can't be longer than 10 characters."
      );
      return;
    }

    const shortDesc = args.slice(2).join(" ")
    if (shortDesc === undefined) {
      await sendUsage(
        'You must provide a short description explaining how the bot really is and what purpose it serves (must be 150 characters or less).'
      );
      return;
    };
    if (shortDesc.length > 150) {
      await sendUsage(
        "The short description can't be longer than 150 characters."
      );
      return;
    };

    client.db.set(id, {
      name: user.username,
      id,
      prefix,
      shortDesc,
      approved: false,
      owner: message.author.id
    });

    await message.author.send('Your bot has been added to the queue!').catch(() => null);
    await message.delete(); // this should delete the command message (!add-bot)
  }
}
