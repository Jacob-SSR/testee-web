import React, { useState, useEffect } from "react";
import axios from "axios";

const AddPracticalTest = () => {
  const [testees, setTestees] = useState([]);
  const [formData, setFormData] = useState({
    testeeId: "",
    passed: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTestees();
  }, []);

  const fetchTestees = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/testees");
      const availableTestees = response.data.filter(
        (testee) => !testee.practicalTestId
      );
      setTestees(availableTestees);
    } catch (error) {
      console.error("Error fetching testees:", error);
      alert("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ทดสอบ");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.testeeId || formData.passed === "") {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    setLoading(true);

    try {
      const practicalData = {
        passed: formData.passed === "true",
      };
      const practicalResponse = await axios.post(
        "http://localhost:8000/api/practical-tests",
        practicalData
      );

      await axios.put(
        `http://localhost:8000/api/testees/${formData.testeeId}`,
        {
          practicalTestId: practicalResponse.data.id,
        }
      );

      alert("บันทึกผลการทดสอบปฏิบัติสำเร็จ!");

      // Reset form
      setFormData({
        testeeId: "",
        passed: "",
      });

      // Refresh testees list
      fetchTestees();
    } catch (error) {
      console.error("Error:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">ทดสอบปฏิบัติ</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 rounded-lg shadow-md"
        >
          <div>
            <label
              htmlFor="testeeId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              เลือกผู้ทดสอบ
            </label>
            <select
              id="testeeId"
              name="testeeId"
              value={formData.testeeId}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- เลือกผู้ทดสอบ --</option>
              {testees.map((testee) => (
                <option key={testee.id} value={testee.id}>
                  {testee.firstName} {testee.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              ผลการทดสอบปฏิบัติ
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="passed"
                  value="true"
                  checked={formData.passed === "true"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-green-600 font-medium">ผ่าน</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="passed"
                  value="false"
                  checked={formData.passed === "false"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-red-600 font-medium">ไม่ผ่าน</span>
              </label>
            </div>
          </div>

          {formData.passed && (
            <div
              className={`p-4 rounded-md ${
                formData.passed === "true"
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <p
                className={`text-center font-semibold ${
                  formData.passed === "true" ? "text-green-700" : "text-red-700"
                }`}
              >
                {formData.passed === "true"
                  ? "✓ ผ่านการทดสอบปฏิบัติ"
                  : "✗ ไม่ผ่านการทดสอบปฏิบัติ"}
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || !formData.testeeId || formData.passed === ""}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "กำลังบันทึก..." : "บันทึกผลการทดสอบ"}
            </button>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPracticalTest;
