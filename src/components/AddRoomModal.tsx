import React, { useState } from 'react';
import { Room } from '../types';
import { supabase } from '../supabaseClient';


interface AddRoomModalProps {
  onClose: () => void;
  onRoomAdded: (room: Room) => void;
}

const AddRoomModal: React.FC<AddRoomModalProps> = ({ onClose, onRoomAdded }) => {
  const [formData, setFormData] = useState<Omit<Room, 'id'>>({
    name: '',
    type: 'standard',
    price: 0,
    capacity: 1,
    available: true,
    description: '',
    amenities: [],
    images: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (name === 'amenities') {
      setFormData({ ...formData, amenities: value.split(',').map(a => a.trim()) });
    } else if (name === 'images') {
      setFormData({ ...formData, images: value.split(',').map(i => i.trim()) });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.from('rooms').insert(formData).select().single();

    if (error) {
      console.error('Insert failed:', error.message);
      return;
    }

    onRoomAdded(data as Room);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add New Room</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Room Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="standard">Standard</option>
            <option value="deluxe">Deluxe</option>
            <option value="suite">Suite</option>
            <option value="presidential">Presidential</option>
          </select>

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />

          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />

          <input
            type="text"
            name="amenities"
            placeholder="Amenities (comma separated)"
            value={formData.amenities.join(', ')}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />

          <input
            type="text"
            name="images"
            placeholder="Image URLs (comma separated)"
            value={formData.images.join(', ')}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
            />
            <span>Available</span>
          </label>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoomModal;
