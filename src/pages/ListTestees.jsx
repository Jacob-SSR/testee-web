import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ListTestees = () => {
  const [testees, setTestees] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    fetchTestees();
  }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(testees);
    } else {
      setFiltered(
        testees.filter(t =>
          (t.firstName + ' ' + t.lastName).toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, testees]);

  const fetchTestees = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/testees');
      setTestees(res.data);
      setFiltered(res.data);
    } catch (error) {
      console.error('Error fetching testees:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('ต้องการลบผู้ทดสอบนี้ใช่หรือไม่?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/testees/${id}`);
      fetchTestees();
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5 text-center">รายชื่อผู้ทดสอบ</h1>
      <input
        type="text"
        placeholder="ค้นหาชื่อหรือนามสกุล"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full p-2 mb-5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <table className="w-full border border-gray-300 border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left" colSpan={2}>ชื่อ - นามสกุล</th>
            <th className="border border-gray-300 px-4 py-2 text-left">วันที่สร้าง</th>
            <th className="border border-gray-300 px-4 py-2 text-left">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map(testee => (
              <tr key={testee.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2" colSpan={2}>
                  <Link to={`/detail/${testee.id}`} className="text-blue-600 hover:underline">
                    {testee.firstName} {testee.lastName}
                  </Link>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(testee.createdAt).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <Link
                    to={`/edit/${testee.id}`}
                    className="text-blue-600 hover:underline mr-4"
                  >
                    แก้ไข
                  </Link>
                  <button
                    onClick={() => handleDelete(testee.id)}
                    className="text-red-600 hover:underline"
                  >
                    ลบ
                  </button>
                  
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center p-4">
                ไม่พบข้อมูล
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListTestees;
