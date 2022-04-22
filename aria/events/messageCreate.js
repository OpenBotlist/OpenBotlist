module.exports = {
  async execute(client, message){
    console.log(message)
    if (message.author.bot) return;
	  if (message.channel.type === "DM") return;
    if (!message.content.toLowerCase().startsWith(client.botoptions.prefix)) return;

    console.log("ok 1")

    const args = message.content.slice(client.botoptions.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);

    console.log("ok 2", command)

    if(!command) return;

    if(command.isTeamOnly && !client.botoptions.team.includes(message.author.id)){
      await message.channel.send('You have to be in the team');
      return;
    };

    if(command.isBottumReviewerOnly && !client.botoptions.bottumrev.includes(message.author.id)){
      await message.channel.send('You have to be a bottum reviewer bruh');
      return;
    };

    if(command.isAddBotChannelOnly && message.channel.id != client.botoptions.add_bot) {
      await message.channel.send(
        'oh god ur cringe use this command at <#966397896176058428> smh ppl these days'
      );
      return;
    };

    try {
      await command.execute(client, message, args);
    } catch(error) {
      await message.channel.send(`An error occured ...\n\`\`\`xl\n${error}\`\`\``);
    };
  }
}