const mqtt = require('mqtt');
const Carpark = require('../models/carpark_model')

class MqttHandler {
    constructor() {
        this.mqttClient = null;
        this.host = 'mqtt://40.89.138.206';
        // this.username = 'YOUR_USER'; 
        // this.password = 'YOUR_PASSWORD';
    }

    connect() {
        this.mqttClient = mqtt.connect(this.host, { port: 1883 });
        this.mqttClient.on("error", (err) => {
            console.log("MQTT bağlantısı kurulamadı: " + err);
        })


        this.mqttClient.on('connect', () => {
            console.log("MQTT bağlantısı: " + this.mqttClient.connected);
            if (!this.mqttClient.connected) {
                this.mqttClient.on('error', (err) => {
                    console.log("Bağlantı yok: " + err);
                })
            }
            this.mqttClient.subscribe("vale_dolu_mu") // subscribe olduğumuz topic
        })
        let veri;
        this.mqttClient.on('message', async(topic, message) => {
            try {
                veri = JSON.parse(message)
            } catch (err) {
                console.log(err);
            }
            //console.log(veri);
            const result = await Carpark.updateOne({ '_id': veri._id, 'areas.areaName': veri.carparkArea }, {
                $set: {
                    'areas.$.isFull': veri.isFull
                }
            })
            if (result.nModified == 0) {
                console.log('Park alanında güncelleme yapılmadı.');
            } else {
                console.log('Park alanında güncelleme yapıldı.');
            }
            //console.log(result);

        })
    }

    //   // Sends a mqtt message to topic: mytopic
    sendMessage(topic, message) {

        this.mqttClient.publish(topic, JSON.stringify(message));

    }
}

module.exports = MqttHandler;