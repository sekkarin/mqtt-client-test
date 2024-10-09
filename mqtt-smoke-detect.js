const mqtt = require("mqtt");
console.log("เริ่มต้น mqtt client");

const url = "mqtt://localhost:1883";

const options = {
  connectTimeout: 4000,
  clientId: "342423423432df23",
  username: "device-smoke",
  password: "device-smoke",
  // clean: true,
  reconnectPeriod: 5000,
};
const client = mqtt.connect(url, options);

client.on("connect", function () {
  console.log("เชื่อมต่อ mqtt สำเร็จ");
  console.log("เชื่อมต่อ mqtt สำเร็จ");
  let number = 0;
  setInterval(() => {
    console.log(`ส่งข้อมูลจากอุปกรณ์ ไปยัง Broker แล้ว ✔️ `);
    const random = (Math.random() * 10).toFixed(0) - 1;
    // console.log(random);
    client.publish(
      "66e3bda018e1a3bf3f64ad6c/device-smoke/publish",
      JSON.stringify({
        "floor-1": random == 1 ? "ตรวจพบ 🟢" : "ไม่ตรวจพบ 🔴",
        "floor-2": random == 2 ? "ตรวจพบ 🟢" : "ไม่ตรวจพบ 🔴",
        "floor-3": random == 3 ? "ตรวจพบ 🟢" : "ไม่ตรวจพบ 🔴",
        "floor-4": random == 4 ? "ตรวจพบ 🟢" : "ไม่ตรวจพบ 🔴",
        "floor-5": random == 5 ? "ตรวจพบ 🟢" : "ไม่ตรวจพบ 🔴",
        "total-detection": number,
        "current-date": new Date(Date.now()).toUTCString(),
      }),
      {
        qos: 0,
        // retain: true,
      }
    );
    number += 1;
  }, 2000);
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
