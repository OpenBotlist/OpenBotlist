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
  Collection
} = require('discord.js');
const { writeFileSync, readFileSync } = require('node:fs');
const dbpath = './database.json';
const { loadCommands, loadEvents } = require("./util/loaders")

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
  };
  static save() {
    writeFileSync(dbpath, JSON.stringify(DB));
  };
  static get(id) {
    //  log("get", id)
    if (!DB[id]) return null;
    return JSON.parse(JSON.stringify(DB[id])); // string -> parse :: deep copy
  };
  static set(id, val) {
    //haha static go brr
    //  log("set", id, val)
    DB[id] = val;
    db.save();
  };
  static add(id, val) {
    if (!DB[id]) DB[id] = 0;
    DB[id] = Number(DB[id]) + val;
    db.save();
  };
  static async fetch(id) {
    return db.get(id);
  };
  static has(id) {
    return Boolean(DB[id]);
  };
  static delete(id) {
    return delete DB[id];
  };
  static lol() {
    return ii;
  };
};

db.load();

client.botoptions = {
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

client.db = db;
client.DB = DB;

client.commands = new Collection();
loadCommands(client)
loadEvents(client)

client.login(client.botoptions.token);