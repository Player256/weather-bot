const schedule = require('node-schedule');
let job;
var telegram_bot = require('node-telegram-bot-api')
var request = require('request')


var token = '6086914137:AAHtQYX20-myxUaO-r39luITQ2xd2_PPGkM'

var bot = new telegram_bot(token, { polling: true });



bot.on("polling_error", (err) => console.log(err));

bot.onText(/\/city (.+)/, function (msg, match) {
	var city = match[1];
	var chatId = msg.chat.id
	var query ='http://api.openweathermap.org/data/2.5/weather?q='+ city + '&appid=6ce67c04b5565d320c6225d0ff681963';
		request(query, function (error, response, body) {
	if (!error && response.statusCode == 200) {
		job = schedule.scheduleJob("* * * * *",() => {bot.sendMessage(chatId,
			'_Looking for details of_ ' + city
				+ '...', { parse_mode: "Markdown" })
				.then((msg)=> {
				res = JSON.parse(body)
				var temp = Math.round((parseInt(
					res.main.temp_min) - 273.15), 2)
				var pressure = Math.round(parseInt(
						res.main.pressure) - 1013.15)

				var rise = new Date(parseInt(
						res.sys.sunrise) * 1000);

				var set = new Date(parseInt(
						res.sys.sunset) * 1000);
				

				bot.sendMessage(chatId, '**** '
					+ res.name + ' ****\nTemperature: '
					+ String(temp) + 'degrees\nHumidity: ' +
					res.main.humidity + ' %\nWeather: '
					+ res.weather[0].description +
					'\nPressure: ' + String(pressure)
					+ ' atm\nSunrise: ' +
					rise.toLocaleTimeString() +
					' \nSunset: ' +
					set.toLocaleTimeString() +
					'\nCountry: ' + res.sys.country)})
			})			
		}
	})
})
bot.onText(/\/stop/, message => {
	console.log('stopping');
    if (job) {
        job.cancel()
    }
});
