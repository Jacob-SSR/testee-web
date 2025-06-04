import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddPhysicalTest = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [form, setForm] = useState({
    colorBlind: false,
    farSight: false,
    nearSight: false,
    reaction: false,
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passed = form.colorBlind && form.farSight && form.nearSight && form.reaction;

    try {
      await axios.post('http://localhost:8000/api/physical-tests', {
        ...form,
        passed,
        testeeId: Number(id),
      });

      alert('บันทึกผลทดสอบสมรรถภาพเรียบร้อย');
      navigate(`/testees/${id}`);
    } catch (error) {
      console.error('Error submitting physical test:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6 text-center">เพิ่มผลทดสอบสมรรถภาพ</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="colorBlind"
              checked={form.colorBlind}
              onChange={handleChange}
            />
            ทดสอบตาบอดสี (ผ่าน)
          </label>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="farSight"
              checked={form.farSight}
              onChange={handleChange}
            />
            สายตาระยะไกล (ผ่าน)
          </label>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="nearSight"
              checked={form.nearSight}
              onChange={handleChange}
            />
            สายตาระยะใกล้ (ผ่าน)
          </label>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="reaction"
              checked={form.reaction}
              onChange={handleChange}
            />
            การตอบสนอง (ผ่าน)
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          บันทึกผล
        </button>
      </form>
    </div>
  );
};

export default AddPhysicalTest;
