/* play function for music part */
var servers = [] ;
var nan = null ;

function play(connection, message) {
    var server = servers[message.guild.id];
    server.dispatcher = connection.play(ytdl(server.queue[0], { filter: 
    "audioonly" }));

    server.dispatcher.setVolume(0.5);

    server.queue.shift();

    server.dispatcher.on("end", function () {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    });

}
/* get the appropriate format of time  */ 

function getTime(minute){
    var ti , hour, min ; 
    if( minute >= 60){
        min = minute % 60 ;
        hour = parseInt(dt / 60) ;
        ti = hour + ' h ' + min + ' min';
    }else{ 
        ti = minute + ' min';
    }
    return ti ;
}


/* Sleep function (doc for await)  */

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
/* upload all the requirement */ 

const fs = require('fs'); // read audio files and urls 
const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 1 };
 

var auth = require('./auth.json');
const Discord = require('discord.js');
const bot = new Discord.Client();


// Initialize Discord Bot
bot.login(auth.token);



var counter = 0 ;



bot.on('ready', function (evt) {
    console.log('[ '+ bot.user.username+ ' ] is ready');
    
      
});

bot.on('message', async (message) => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    var msg = message.content;
    if (msg.substring(0, 1) == '!') {
        var args = msg.substring(1).split(' ');
        var cmd = args[0];
        var dt = args[1];
        var gm = args[2];
        
        if (!cmd) {
            if (counter != 3){
                counter+=1;
                message.channel.send('A gentalman is simply a Patient wolf please Type "!h" for more info');
            }else{
                message.channel.send('Becarfull '+message.author.username + ' will be banned');
            }
        } 
        else {
            counter = 0 ;
            var emo = ['🤦‍','🤷','👳‍','👎','🏃‍','👍','👌','🧟‍','😱','👨‍💻','🕺','💢'];
            const list = bot.guilds.cache.get(auth.guild_id); 
            var users = [] ;
            list.members.cache.forEach(member => users.push(member.user));
          

          
            
            switch(cmd) {
                case 'h':
                    message.channel.send(' `!ping           send "ping" messages\n!play          play some music (requires youtube url)\n!users         display all connected users\n!game          display who is playing wish game\n!time          set up a countdown ( in minutes ) for a certain game `');
                    await(1000); 
                break;  

                case 'ping':
                    message.reply('I m awake mister');
                    
                break;

                case 'users':
                    var smi_1 ;
                    var usr;
                    
                    for (u in users ){
                            usr = users[u];
                            smi_1 =  Math.floor(Math.random() *  emo.length);
                            if (!usr.bot){
                                message.channel.send( usr.username+' Welcome =====> [ '+emo[smi_1] + ' ]')
                                await sleep(1000);
                            }                        
                    }
                     
                    
                break;

                case 'time' :    
                    var msg;
                    var hours;
                    var min ;
                    
                    if (dt < 4 || dt > 1000) {
                        message.channel.send('Time format is not supported countdown will not start (min = 4 min || max = 1000 min)');                      
                        return;
                    }
                    // Convert the minutes into seconds and make sure to have a 3 min reminder 
                    tmin = parseInt(dt-3)*60;
                    tend = 180;
                    console.log(dt);
                    if( dt >= 60){
                        min = dt % 60 ;
                        hour = parseInt(dt / 60) ;
                        ti = hour + ' h ' + min + ' min';
                    }else{ 
                        ti = dt + ' min';
                    }
                                               
                    if (tmin){
                                            
                        msg = 'Gaming will start in ' + ti ;
                        
                        message.channel.send(msg); 
                        // sleep for dt amount of time
                        await sleep(tmin*1000);
                        msg ='@everyone 3 minutes to play : ' + gm + '🕺';
                        
                        message.channel.send(msg); 

                        await sleep(tend*1000);
                        msg = 'times up Please connect to ' +gm;
                        
                        message.channel.send(msg); 


                    } else {
                        msg = 'Time format is not supported please insert an acceptable format';
                        message.channel.send(msg); 

                    } 
                                                      
                   
                break;
                
                case 'play':
                    var link = args[1];
                    console.log(link);
                    
                    if (!args[1]) {
                        message.reply("Please provide a link");
                        return;
                    }
                    
                    if (!servers[message.guild.id]) servers[message.guild.id] = {
                        queue: []
                    }
                    var server = servers[message.guild.id];

                    server.queue.push(args[1]);
                    var chan ;

                    // First get the right channel with the name ( be sure to affect null in case no cannel exists)
                    // TODO : put in a seperate function later 
                    list.channels.cache.forEach(channel => {
                            if (channel.name == auth.chan_name){
                                chan = channel; 
                            }
                            
                    });
                    
                    // See if the channel exist
                    if (!chan) return console.error("The channel does not exist!");
                    chan.join().then(function (connection) {
                            console.log("Successfully connected.");
                            play(connection, message);
                    });
                break;
                // TODO see if the bot is plaing anything 
                case 'stop':                    
                    var server = servers[message.guild.id];
                    server.dispatcher.end();
                break ;

                default:
                    message.channel.send('Command unknown 😱');                 
                          
            }



        }

    }
      
});

