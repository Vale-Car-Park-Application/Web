const mqtt = require('mqtt');
const Carpark = require('../models/carpark_model')

const client = mqtt.connect('mqtt://127.0.0.1');

client.on("error", (err) => {
    console.log("MQTT bağlantısı kurulamadı: " + err);
})


client.on('connect', () => {
    console.log("MQTT bağlantısı: " + client.connected);
    if (!client.connected) {
        client.on('error', (err) => {
            console.log("Bağlantı yok: " + err);
        })
    }
    client.subscribe("adeneme") // subscribe olduğumuz topic
})
let veri;
client.on('message', async(topic, message) => {
    veri = JSON.parse(message)
        //console.log(veri);
    const result = await Carpark.updateOne({ 'areas._id': veri._id, 'areas.areaName': veri.carparkArea }, {
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

//otoparkın idsi, otopark alanı, alanın doluluk boşluk durumu