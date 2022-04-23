module.exports = {
  name: "add-bot",
  async execute(client, message, args) {
    const id = args[0];
    if (id === undefined) {
      await message.channel.send('The ID of the Discord bot is required.');
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
      await message.channel.send('You must specify the prefix of the bot.');
      return;
    };
    if (prefix.length > 10) {
      await message.channel.send(
        "The prefix length can't be longer than 10 characters."
      );
      return;
    }

    const shortDesc = args.slice(2).join(" ")
    if (shortDesc === undefined) {
      await message.channel.send(
        'You must provide a short description explaining how the bot really is and what purpose it serves (must be 150 characters or less).'
      );
      return;
    };
    if (shortDesc.length > 150) {
      await message.channel.send(
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

    await message.author.send('Your bot has been added to the queue!').catch(() => undefined); //send it to PMs
    await message.delete(); // this should delete the command message (!add-bot)
  }
}
