const mqtt = require("mqtt");
console.log("เริ่มต้น mqtt client");

const url = "ws://localhost:8083/mqtt";

const options = {
  connectTimeout: 4000,
  clientId: "TestMQTT1",
  username: "Smart-home-1",
  password: "1234",
  protocol: "ws",
  clean: true,
  reconnectPeriod: 5000,
};
const client = mqtt.connect(url, options);

client.on("connect", function () {
  console.log("เชื่อมต่อ mqtt สำเร็จ");
  console.log("เชื่อมต่อ mqtt สำเร็จ");
  console.log(`ส่งข้อมูลจากอุปกรณ์ ไปยัง SERVICES แล้ว ✔️ `);
  setInterval(() => {
    const tem_val = (Math.random() * 100).toFixed(2);
    const speed_val = (Math.random() * 100).toFixed(2);
    const brightness_val = (Math.random() * 10000).toFixed(2);
    client.publish(
      "65f82cdd1cc452b51386c307/home-1/publish",
      JSON.stringify({
        tem_val,
        speed_val,
        brightness_val,
      }),
      {
        qos: 0,
        retain: false,
      }
    );
  }, 1000);

  setInterval(() => {
    client.subscribe(
      "65f82cdd1cc452b51386c307/home-1/subscribe",
      {
        qos: 0,
        retain: true,
      },

      (err, granted) => {
        if (err) {
          console.log("Error: " + err);
        }
        // console.log(`${granted} was subscribed`);
      }
    );
  }, 1000);
});

// Receive messages
client.on("message", function (topic, message) {
  const payload = JSON.parse(message.toString());
  if (payload.led === 1) {
    console.log("ไฟกลางห้องถูกเปิด ✔️");
  }
  if (payload.led === 0) {
    console.log("ไฟกลางห้องถูกปิด ❌");
  }
  if (payload["brightness-bedroom"]) {
    console.log("ความสว่างในห้อง ", payload["brightness-bedroom"], " %");
  }
  console.log("--------------------------------");
});

client.on("disconnect", function (topic, message) {
  console.log("อุปกรณ์ Disconnect");
});

client.on("reconnect", function (topic, message) {
  console.log("อุปกรณ์ reconnect");
});
