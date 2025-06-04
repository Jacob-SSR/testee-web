import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const DetailTestee = () => {
  const { id } = useParams();
  const [testee, setTestee] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/testees/${id}`);
        setTestee(res.data);
      } catch (error) {
        console.error("Error fetching testee detail:", error);
      }
    };

    fetchDetail();
  }, [id]);

  if (!testee) return <p className="text-center mt-10">กำลังโหลดข้อมูล...</p>;

  // ✅ แสดงสถานะใบขับขี่
  const licenseStatus = () => {
    const { physicalTest, theoryTest, practicalTest } = testee;
    if (!physicalTest || !theoryTest || !practicalTest) return "รอพิจารณา";
    if (physicalTest.passed && theoryTest.passed && practicalTest.passed)
      return "ผ่านการทดสอบ";
    return "ไม่ผ่านการทดสอบ";
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        รายละเอียดของ {testee.firstName} {testee.lastName}
      </h1>

      <div className="bg-white shadow p-4 rounded space-y-4">
        <p>
          <strong>ชื่อ:</strong> {testee.firstName}
        </p>
        <p>
          <strong>นามสกุล:</strong> {testee.lastName}
        </p>
        <p>
          <strong>วันที่สร้าง:</strong>{" "}
          {new Date(testee.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>สถานะใบขับขี่:</strong>{" "}
          <span className="font-semibold">{licenseStatus()}</span>
        </p>

        {testee.physicalTest ? (
          <div>
            <h2 className="text-lg font-semibold">ผลทดสอบร่างกาย:</h2>
            <ul className="list-disc ml-6">
              <li>
                ตาบอดสี: {testee.physicalTest.colorBlind ? "ผ่าน" : "ไม่ผ่าน"}
              </li>
              <li>
                สายตายาว: {testee.physicalTest.farSight ? "ผ่าน" : "ไม่ผ่าน"}
              </li>
              <li>
                สายตาเอียง: {testee.physicalTest.nearSight ? "ผ่าน" : "ไม่ผ่าน"}
              </li>
              <li>
                การตอบสนองร่างกาย:{" "}
                {testee.physicalTest.reaction ? "ผ่าน" : "ไม่ผ่าน"}
              </li>
              <li className="font-semibold">
                รวมผล: {testee.physicalTest.passed ? "ผ่าน" : "ไม่ผ่าน"}
              </li>
            </ul>
          </div>
        ) : (
          <p className="text-gray-500">ยังไม่มีข้อมูลผลทดสอบร่างกาย</p>
        )}

        {testee.theoryTest ? (
          <div>
            <h2 className="text-lg font-semibold">ผลทดสอบภาคทฤษฎี:</h2>
            <ul className="list-disc ml-6">
              <li>ป้ายจราจร: {testee.theoryTest.trafficSigns} คะแนน</li>
              <li>เส้นจราจร: {testee.theoryTest.trafficLines} คะแนน</li>
              <li>การให้ทาง: {testee.theoryTest.rightOfWay} คะแนน</li>
              <li>รวมคะแนน: {testee.theoryTest.totalScore} / 150</li>
              <li className="font-semibold">
                รวมผล: {testee.theoryTest.passed ? "ผ่าน" : "ไม่ผ่าน"}
              </li>
            </ul>
          </div>
        ) : (
          <p className="text-gray-500">ยังไม่มีข้อมูลผลทดสอบภาคทฤษฎี</p>
        )}

        {testee.practicalTest ? (
          <div>
            <h2 className="text-lg font-semibold">ผลทดสอบภาคปฏิบัติ:</h2>
            <p>ผลสอบ: {testee.practicalTest.passed ? "ผ่าน" : "ไม่ผ่าน"}</p>
          </div>
        ) : (
          <p className="text-gray-500">ยังไม่มีข้อมูลผลทดสอบภาคปฏิบัติ</p>
        )}
        <Link
          to={`/physical/${testee.id}`}
          className="text-blue-600 hover:underline"
        >
          แก้ไขผลทดสอบร่างกาย
        </Link>
      </div>
    </div>
  );
};

export default DetailTestee;
