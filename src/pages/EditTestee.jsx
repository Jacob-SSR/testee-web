import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditTestee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ดึงข้อมูลผู้ทดสอบตอนโหลดหน้า
  useEffect(() => {
    const fetchTestee = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/testees/${id}`);
        setFirstName(res.data.firstName);
        setLastName(res.data.lastName);
      } catch (error) {
        setMessage("ไม่พบข้อมูลผู้ทดสอบ");
      }
    };
    fetchTestee();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName) {
      setMessage("กรุณากรอกชื่อและนามสกุล");
      return;
    }
    setLoading(true);
    try {
      await axios.put(`http://localhost:8000/api/testees/${id}`, {
        firstName,
        lastName,
      });
      setMessage("แก้ไขข้อมูลสำเร็จ");
      // กลับไปหน้ารายชื่อหลังแก้ไข
      navigate("/");
    } catch (error) {
      setMessage("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-5">
      <h2 className="text-xl font-bold mb-4">แก้ไขข้อมูลผู้ทดสอบ</h2>
      {message && <p className="mb-4 text-red-600">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">ชื่อ</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">นามสกุล</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "กำลังบันทึก..." : "บันทึก"}
        </button>
      </form>
    </div>
  );
};

export default EditTestee;
