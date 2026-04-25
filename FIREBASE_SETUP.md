# 🔥 Setup Firebase — ฟรีทั้งหมด (5 นาที)

## 1. สร้าง Firebase Project

1. ไปที่ 👉 **https://console.firebase.google.com**
2. ล็อกอินด้วย Google account
3. คลิก **"Add project"** → ตั้งชื่อ (เช่น `our-garden`) → Continue
4. ปิด Google Analytics (ไม่ต้องใช้) → Create project
5. รอสักครู่ → Continue

## 2. เปิด Firestore Database

1. ในเมนูซ้าย คลิก **Build → Firestore Database**
2. คลิก **Create database**
3. เลือก **Start in production mode** → Next
4. Location: เลือก `asia-southeast1` (Singapore - ใกล้ไทยสุด) → Enable

## 3. ตั้งค่า Security Rules (สำคัญ!)

1. ใน Firestore → แท็บ **Rules**
2. แทนที่ rules ทั้งหมดด้วย:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. กด **Publish**

> ⚠️ rules นี้เปิดให้ใครก็อ่าน/เขียนได้ ถ้ารู้ project ID — ปลอดภัยพอสำหรับเว็บส่วนตัวที่ URL ไม่เปิดเผย ถ้าอยากปลอดภัยกว่านี้ให้เปิด Firebase Authentication (ถามผมเพิ่มได้)

## 4. เอา Config มาใส่

1. ในหน้า Firebase → คลิกรูปเฟือง (Project settings)
2. เลื่อนลงมาส่วน **Your apps** → คลิกไอคอน `</>` (Web)
3. ตั้งชื่อ app (เช่น `garden`) → Register app
4. จะเห็น code แบบนี้:

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123...",
  appId: "1:123:web:abc...",
};
```

5. คัดลอกค่าทั้งหมด → ใส่ในเว็บคุณ:
   - เปิดเว็บ → กดไอคอนเฟือง (⚙) ที่มุมขวาบน
   - เลื่อนลงไปหา **"Cloud Sync (Firebase)"**
   - กด **"Connect to Firebase"**
   - ใส่ config → Save

เสร็จ! ตอนนี้ข้อมูลจะซิงค์ทุกเครื่องอัตโนมัติ 🎉

## 5. Import ข้อมูลเก่า (ถ้ามี)

ถ้ามีข้อมูลใน localStorage อยู่แล้ว:

1. เชื่อม Firebase เรียบร้อย
2. กดปุ่ม **"Upload local data to cloud"** ในเมนูเฟือง

---

## ❓ FAQ

**Q: ฟรีจริงไหม?**
A: ฟรีสำหรับการใช้งานปกติ — 50,000 reads + 20,000 writes/day + 1GB storage ซึ่งเยอะมากสำหรับเว็บส่วนตัว 2 คน

**Q: ถ้าเกิน quota?**
A: เกินยาก (ต้องมีคน 100+ คนเล่นทั้งวัน) — ถ้าเกินจริงแค่ใช้ไม่ได้ชั่วคราว ไม่เสียเงิน (เพราะไม่ได้ใส่บัตรเครดิต)

**Q: รูปภาพใหญ่ๆ เก็บที่ไหน?**
A: ระบบนี้เก็บเป็น URL หรือ base64 ใน Firestore โดยตรง ถ้าอยากอัปโหลดรูปใหญ่ให้ใช้ **imgbb.com** (ฟรี) หรือ **Cloudinary** ฟรี tier แล้วเอา URL มาใส่
