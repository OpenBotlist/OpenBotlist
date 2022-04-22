/*
  This Source Code Form is subject to the terms of the GNU General Public License:

     Copyright (C) 2021-2022 OPENBOTLIST CONTRUBUTORS 
    
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see https://www.gnu.org/licenses/.
*/

const {
  Client,
  MessageEmbed,
  Formatters: { hyperlink, time }
} = require('discord.js');
const { writeFileSync, readFileSync } = require('node:fs');
const { EventEmitter } = require('node:events');
const dbpath = './database.json';

const client = new Client({ disableEveryone: true, intents: 98303 }); // is 98303 enougth? -no

// DATABASE - a pretty basic one lmao

let i = 0;
let ii = 0;
var log = (m) => {
  i++;
  ii++;
};

var DB = {};

class db {
  static load() {
    log('loading');
    DB = JSON.parse(readFileSync(dbpath).toString());
  }
  static save() {
    writeFileSync(dbpath, JSON.stringify(DB));
  }
  static get(id) {
    //  log("get", id)
    if (!DB[id]) return null;
    return JSON.parse(JSON.stringify(DB[id])); // string -> parse :: deep copy
  }
  static set(id, val) {
    //haha static go brr
    //  log("set", id, val)
    DB[id] = val;
    db.save();
  }
  static add(id, val) {
    if (!DB[id]) DB[id] = 0;
    DB[id] = Number(DB[id]) + val;
    db.save();
  }
  static async fetch(id) {
    return db.get(id);
  }
  static has(id) {
    return Boolean(DB[id]);
  }
  static delete(id) {
    return delete DB[id];
  }
  static lol() {
    return ii;
  }
}

db.load();

const options = {
  prefix: '!',
  token: process.env.token, // token reaveal
  logs: {
    modlogs: '966028505458556968'
  },
  k: {
    k: 'k' // k.
  },
  team: ['396571938081865741', '544676649510371328'],
  bottumrev:["928624781731983380"]
};

client.on('messageCreate', async (message) => {
  const args = message.content.trim().split(/\s+/);
  const command = args.shift().toLowerCase();

  if (command === '!add-bot') {
    const ADD_BOT_CHANNEL = '966397896176058428'; // id of the add-new bottum channel
    if (message.channel.id !== ADD_BOT_CHANNEL) {
      await message.channel.send(
        'oh god ur cringe use this command at <#966397896176058428> smh ppl these days'
      );

      return;
    }

    if (message.channel.id === ADD_BOT_CHANNEL) {
      // !add-bot <ID> <PREFIX> <SHORT DESC>

      const id = args[0];

      if (id === undefined) {
        await message.channel.send('The ID of the Discord bot is required.');

        return;
      }

      const user = await client.users.fetch(id).catch(() => null);

      if (user === null) {
        await message.channel.send('No bot with the specified ID exists.');

        return;
      }

      if (!user.bot) {
        await message.channel.send("That's not a bot.");

        return;
      }

      const prefix = args[1];

      if (prefix === undefined) {
        await message.channel.send('You must specify the prefix of the bot.');

        return;
      }

      if (prefix.length > 10) {
        await message.channel.send(
          "The prefix length can't be longer than 10 characters."
        );

        return;
      }

      const shortDesc = args[2];

      if (shortDesc === undefined) {
        await message.channel.send(
          'You must provide a short description explaining how the bot really is and what purpose it serves (must be 150 characters or less).'
        );

        return;
      }

      if (shortDesc.length > 150) {
        await message.channel.send(
          "The short description can't be longer than 150 characters."
        );

        return;
      }

      db.set(id, {
        name: user.username,
        id,
        prefix,
        shortDesc,
        approved: false,
        owner: message.author.id
      });

      await message.author.send('Your bot has been added to the queue!'); //send it to PMs
      await message.delete(); // this should delete the command message (!add-bot)
    }
  }
  if (command === '!queue') {
   
    // the queue system
    // BOT NAME (PREFIX) - INVITE (NO PERMS) - INVITE (8 PERMS)
    // if its apprvoed dont show it on the list
    if (!options.team.includes(message.author.id)) {
      await message.channel.send('You have to be in the team');
      
      return;
    }
    
    const embed = new MessageEmbed().setTitle('***Queue***').setDescription(
      Object.values(DB)
        .filter((bot) => !bot.approved)
        .map((bot) => {
          const invite = `https://discord.com/oauth2/authorize?client_id=${bot.id}&scope=bot%20applications.commands&perms=`;

          return `${bot.name} (${bot.prefix}) - ${hyperlink(
            'invite (no perms)',
            `${invite}0`
          )} - ${hyperlink('invite (administrator perms)', `${invite}8`)}`;
        })
        .join('\n\n')
    );

      if (options.team.includes(message.author.id)) {
        await message.channel.send({ embeds: [embed] });
        
        return;
      }
  }
  if (command === '!approve') {
      if (!options.team.includes(message.author.id) && !options.bottumrev.includes(message.author.id)) {
      await message.channel.send('You have to be in the team');
      return;
    }
     if (options.team.includes(message.author.id) && options.bottumrev.includes(message.author.id)) {
    
    const id = args[0];

    if (id === undefined) {
      await message.channel.send(
        'You must provide the ID of the Discord bot you want to approve.'
      );

      return;
    }

    const user = await client.users.fetch(id).catch(() => null);

    if (user === null) {
      await message.channel.send('No bot with the specified ID exists.');

      return;
    }

    if (!user.bot) {
      await message.channel.send("That's not a bot.");

      return;
    }

    if (!db.has(id)) {
      await message.channel.send('That bot is not in the queue.');

      return;
    }

    const bot = db.get(id);

    const modLogEmbed = new MessageEmbed()
      .setColor('GREEN')
      .addField('BOT NAME', bot.name)
      .addField('APPROVED BY', message.author.tag)
      .setDescription(`Approved at: ${time(new Date(), 'F')}`);

    // sends the bot owner a DM about their bots have been apporoved
    const owner = await client.users.fetch(bot.owner).catch(() => null);

    if (owner === null) {
      db.delete(id);

      await message.channel.send(
        'Looks like the owner of that bot has been deleted.'
      );

      return;
    }

    await owner
      .send({ content: 'WOOO! :tada: YOUR BOT HAS BEEN APPOROVED' })
      .catch(() => undefined);
    // send the log embed to mod logs channel;
    const log = client.channels.cache.get(options.logs.modlogs);
    await log.send({ embeds: [modLogEmbed] });

    // make the approved option true on db;
    bot.approved = true;
  }
  }
  if (command === '!decline') {
      if (!options.team.includes(message.author.id) && !options.bottumrev.includes(message.author.id)) {
      await message.channel.send('You have to be in the team');
      return;
    }
     if (options.team.includes(message.author.id) && options.bottumrev.includes(message.author.id)) {
    const id = args[0];
    const reason = args.slice(1).join(' ');

    if (id === undefined) {
      await message.channel.send(
        'You must provide the ID of the Discord bot you want to decline.'
      );

      return;
    }

    const user = await client.users.fetch(id).catch(() => null);

    if (user === null) {
      await message.channel.send('No bot with the specified ID exists.');

      return;
    }

    if (!user.bot) {
      await message.channel.send("That's not a bot.");

      return;
    }

    if (!db.has(id)) {
      await message.channel.send('That bot is not in the queue.');

      return;
    }

    const bot = db.get(id);

    const modLogEmbed = new MessageEmbed()
      .setColor('RED')
      .addField('BOT NAME', bot.name)
      .addField('DECLINED BY', message.author.tag)
      .addField('REASON', reason)
      .setDescription(`Declined at: ${time(new Date(), 'F')}`);

    // sends the bot owner a DM about their bots have been declined
    const owner = await client.users.fetch(bot.owner).catch(() => null);

    if (owner === null) {
      db.delete(id);

      await message.channel.send(
        'Looks like the owner of that bot has been deleted.'
      );

      return;
    }

    await owner
      .send({
        content: `NOOO.... YOUR BOT HAVE BEEN DECLINED FOR THIS REASON: ${reason}`
      })
      .catch(() => undefined);
    // send the log embed to mod logs channel;
    const log = client.channels.cache.get(options.logs.modlogs);
    await log.send({ embeds: [modLogEmbed] });

    db.delete(id);
  }
  } 
});

client.login(options.token);
