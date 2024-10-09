const mqtt = require("mqtt");
console.log("เริ่มต้น mqtt client");

const url = "mqtt://localhost:1883";

const options = {
  connectTimeout: 4000,
  clientId: "dbd8e181-b53b-4ef9-a924-bfcccbb4f7ef",
  username: "device-1",
  password: "device-1",
  clean: true,
  reconnectPeriod: 5000,
  protocol:'mqtt'
};
const client = mqtt.connect(url, options);

client.on("connect", function () {
  console.log("เชื่อมต่อ mqtt สำเร็จ");
  
  setInterval(() => {
    let tem_val = (Math.random() * 100).toFixed(2);
    tem_val = map(tem_val, 0, 100, 23, 26).toFixed(2);
    let speed_val = (Math.random() * 100).toFixed(2);
    speed_val = map(speed_val, 0, 10000, 2000, 2500).toFixed(0);
    let brightness_val = (Math.random() * 10000).toFixed(0);
    brightness_val = map(brightness_val, 0, 10000, 500, 1200).toFixed(0);

    client.publish(
      "66e3bda018e1a3bf3f64ad6c/device-1/publish",
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
    // console.log(`ส่งข้อมูลจากอุปกรณ์ ไปยัง Broker แล้ว ✔️`);
  },2000);

  setInterval(() => {
    client.subscribe(
      "66e3bda018e1a3bf3f64ad6c/device-1/subscribe",
      {
        qos: 0,
        retain: false,
      },

      (err) => {
        if (err) {
          console.log("Error: " + err);
        }
        // console.log(`${granted} was subscribed`);
      }
    );
  }, 500);
});

// Receive messages
client.on("message", function (topic, message) {
  const payload = JSON.parse(message.toString());
  console.log(payload);
  
  if (payload.led === 1) {
    console.log("ไฟกลางห้องถูกเปิด ✔️");
  }
  if (payload.led === 0) {
    console.log("ไฟกลางห้องถูกปิด ❌");
  }
  if (payload["brightness-bedroom"] > 0) {
    console.log("ความสว่างไฟหัวเตียง ", payload["brightness-bedroom"], "%");
  }
  if (payload["brightness-bedroom"] < 1) {
    console.log("ความสว่างในห้อง 0 %");
  }
  console.log("--------------------------------");
});

client.on("disconnect", function (topic, message) {
  console.log("อุปกรณ์ Disconnect");
});

client.on("reconnect", function (topic, message) {
  console.log(message);
  console.log("อุปกรณ์ reconnect");
});

const map = (x, in_min, in_max, out_min, out_max) => {
  return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};
