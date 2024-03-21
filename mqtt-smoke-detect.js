const mqtt = require("mqtt");
console.log("เริ่มต้น mqtt client");

const url = "ws://localhost:8083/mqtt";

const options = {
  connectTimeout: 4000,
  clientId: "TestMQTT2",
  username: "npru",
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
    const random = (Math.random() * 10).toFixed(0) - 1;
    // console.log(random);
    client.publish(
      "65f82cdd1cc452b51386c307/com1/publish",
      JSON.stringify({
        "1-floor": random == 1 ? "ตรวจพบ 🟢" : "ไม่ตรวจพบ 🔴",
        "2-floor": random == 2 ? "ตรวจพบ 🟢" : "ไม่ตรวจพบ 🔴",
        "3-floor": random == 3 ? "ตรวจพบ 🟢" : "ไม่ตรวจพบ 🔴",
        "4-floor": random == 4 ? "ตรวจพบ 🟢" : "ไม่ตรวจพบ 🔴",
        "5-floor": random == 5 ? "ตรวจพบ 🟢" : "ไม่ตรวจพบ 🔴",
      }),
      {
        qos: 2,
        retain: true,
      }
    );
  }, 5000);
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
