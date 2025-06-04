import React, { useState } from "react";
import axios from "axios";

const AddTestee = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName) {
      setMessage("กรุณากรอกชื่อและนามสกุล");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/testees", {
        firstName,
        lastName,
      });
      setMessage("เพิ่มผู้ทดสอบเรียบร้อยแล้ว");
      setFirstName("");
      setLastName("");
    } catch (error) {
      setMessage("เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        เพิ่มผู้ทดสอบใหม่
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">ชื่อ</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">นามสกุล</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md text-white font-semibold ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "กำลังบันทึก..." : "บันทึก"}
        </button>
      </form>
      {message && <p className="mt-4 text-center text-red-600">{message}</p>}
    </div>
  );
};

export default AddTestee;
