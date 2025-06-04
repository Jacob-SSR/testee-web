import { useState, useEffect } from "react";
import axios from "axios";

const AddTheoryTest = () => {
  const [testees, setTestees] = useState([]);
  const [formData, setFormData] = useState({
    testeeId: "",
    trafficSigns: "",
    trafficLines: "",
    rightOfWay: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTestees();
  }, []);

  const fetchTestees = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/testees");
      const availableTestees = response.data.filter(
        (testee) => !testee.theoryTestId
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
    setLoading(true);

    try {
      const trafficSigns = parseInt(formData.trafficSigns, 10);
      const trafficLines = parseInt(formData.trafficLines, 10);
      const rightOfWay = parseInt(formData.rightOfWay, 10);
      const totalScore = trafficSigns + trafficLines + rightOfWay;
      const passed = totalScore >= 120;

      const theoryData = {
        trafficSigns,
        trafficLines,
        rightOfWay,
        totalScore,
        passed,
      };

      const theoryResponse = await axios.post(
        "http://localhost:8000/api/theory-tests",
        theoryData
      );

      const updateResponse = await axios.put(
        `http://localhost:8000/api/testees/${formData.testeeId}`,
        { theoryTestId: theoryResponse.data.id }
      );
      console.log("Update testee response:", updateResponse.data);
      setTestees((prev) => prev.filter((t) => t.id !== formData.testeeId));

      alert("บันทึกผลการทดสอบทฤษฎีสำเร็จ!");

      setFormData({
        testeeId: "",
        trafficSigns: "",
        trafficLines: "",
        rightOfWay: "",
      });
      setTimeout(fetchTestees, 500);
    } catch (error) {
      console.error("Error saving theory test:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const signs = parseInt(formData.trafficSigns, 10) || 0;
    const lines = parseInt(formData.trafficLines, 10) || 0;
    const way = parseInt(formData.rightOfWay, 10) || 0;
    return signs + lines + way;
  };

  const getPassStatus = () => {
    const total = calculateTotal();
    return total > 120 ? "ผ่าน" : "ไม่ผ่าน";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">ทดสอบทฤษฎี</h1>

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "ป้ายจราจร (0-50)", name: "trafficSigns" },
              { label: "เส้นจราจร (0-50)", name: "trafficLines" },
              { label: "การให้ทาง (0-50)", name: "rightOfWay" },
            ].map(({ label, name }) => (
              <div key={name}>
                <label
                  htmlFor={name}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {label}
                </label>
                <input
                  id={name}
                  type="number"
                  name={name}
                  value={formData[name]}
                  onChange={handleInputChange}
                  min="0"
                  max="50"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          {formData.trafficSigns &&
            formData.trafficLines &&
            formData.rightOfWay && (
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-center">
                  <p className="text-lg font-semibold">
                    คะแนนรวม: {calculateTotal()}/150
                  </p>
                  <p className="text-sm text-gray-600">
                    เปอร์เซ็นต์: {((calculateTotal() / 150) * 100).toFixed(1)}%
                  </p>
                  <p
                    className={`text-lg font-bold ${
                      getPassStatus() === "ผ่าน"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {getPassStatus()}
                  </p>
                </div>
              </div>
            )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
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

export default AddTheoryTest;
