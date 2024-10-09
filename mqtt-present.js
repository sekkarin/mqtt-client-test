const mqtt = require("mqtt");
console.log("เริ่มต้น mqtt client");

const url = "mqtt://localhost:1883";

const options = {
  clientId: "dvice1",
  // TODO change  username and password
  username: "device-1",
  password: "device-1",
  clean: true,
  reconnectPeriod: 5000,
};
const client = mqtt.connect(url, options);

client.on("connect", function () {
  console.log("เชื่อมต่อ mqtt สำเร็จ");
  console.log(`ส่งข้อมูลจากอุปกรณ์ ไปยัง Broker แล้ว ✔️ `);
  let i = 0;
  setInterval(() => {
    client.publish(
      // TODO change topic
      "66e3bda018e1a3bf3f64ad6c/device-1/publish",
      JSON.stringify({
        number: Math.random() * 100,
      }),
      // TODO uncomment
      {
        qos: 0,
        retain: false,
      }
    );
    i += 1;
  }, 1000);

  // Subscribe
  setInterval(() => {
    client.subscribe(
      // TODO change topic
      "66e3bda018e1a3bf3f64ad6c/device-1/subscribe",
      // TODO uncomment
      {
        // qos: 0,
        // retain: true,
      },

      (err, granted) => {
        if (err) {
          console.log("Error: " + err);
        }
      }
    );
  }, 1000);
});

// Receive messages
client.on("message", function (topic, message) {
  const payload = JSON.parse(message.toString());
  console.log(payload);
  console.log("--------------------------------");
});

client.on("disconnect", function (topic, message) {
  console.log("อุปกรณ์ Disconnect");
});

client.on("reconnect", function (topic, message) {
  console.log("อุปกรณ์ reconnect", topic, message);
});
