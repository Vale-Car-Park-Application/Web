var mqttHandler = require('../configs/mqtt_handler');

var mqttClient = new mqttHandler();

mqttClient.connect();

module.exports = mqttClient;