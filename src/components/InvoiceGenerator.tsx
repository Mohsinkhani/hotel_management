import React, { useState, useEffect } from 'react';
import { X, Download, Printer as Print } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface Reservation {
  id: string;
  room_id: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  check_in_date: string | null;
  check_out_date: string | null;
  adults: number | null;
  children: number | null;
  special_requests: string | null;
}

interface Room {
  id: number;
  name: string;
  price: number;
  type: string;
}

interface InvoiceGeneratorProps {
  reservationData: Reservation;
  onClose: () => void;
}

interface AdditionalItem {
  name: string;
  nameAr: string;
  quantity: number;
  price: number;
}

const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({ reservationData, onClose }) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [additionalItems, setAdditionalItems] = useState<AdditionalItem[]>([]);
  const [newItem, setNewItem] = useState({ name: '', nameAr: '', quantity: 1, price: 0 });
  const [discountAmount, setDiscountAmount] = useState(0);
  const [taxRate, setTaxRate] = useState(15);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (reservationData.room_id) {
        const { data, error } = await supabase
          .from('rooms')
          .select('*')
          .eq('id', reservationData.room_id)
          .single();

        if (!error && data) {
          setRoom(data);
        }
      }
      setLoading(false);
    };

    fetchRoomData();
  }, [reservationData.room_id]);

  const calculateNights = () => {
    if (!reservationData.check_in_date || !reservationData.check_out_date) return 0;
    const checkIn = new Date(reservationData.check_in_date);
    const checkOut = new Date(reservationData.check_out_date);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const roomTotal = room ? room.price * calculateNights() : 0;
  const additionalTotal = additionalItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const subtotal = roomTotal + additionalTotal;
  const discountedAmount = subtotal - discountAmount;
  const taxAmount = (discountedAmount * taxRate) / 100;
  const totalAmount = discountedAmount + taxAmount;

  const addItem = () => {
    if (newItem.name && newItem.nameAr && newItem.price > 0) {
      setAdditionalItems([...additionalItems, newItem]);
      setNewItem({ name: '', nameAr: '', quantity: 1, price: 0 });
    }
  };

  const removeItem = (index: number) => {
    setAdditionalItems(additionalItems.filter((_, i) => i !== index));
  };

  const saveInvoice = async () => {
    try {
      const invoiceData = {
        reservation_id: reservationData.id,
        room_total: roomTotal,
        additional_items: additionalItems,
        discount_amount: discountAmount,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        notes: notes
      };

      const { error } = await supabase.from('invoices').insert([invoiceData]);
      
      if (error) {
        console.error('Error saving invoice:', error);
        alert('Error saving invoice');
      } else {
        alert('Invoice saved successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving invoice');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateArabic = (dateString: string | null) => {
    if (!dateString) return 'غير متوفر';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-center">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header Controls */}
        <div className="flex justify-between items-center p-4 border-b print:hidden">
          <h2 className="text-xl font-bold text-gray-800">Invoice Generator / مولد الفواتير</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Print size={16} />
              Print / طباعة
            </button>
            <button
              onClick={saveInvoice}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <Download size={16} />
              Save / حفظ
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              <X size={16} />
              Close / إغلاق
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="p-8 print:p-6">
          {/* Hotel Header */}
          <div className="text-center mb-8 border-b-2 border-blue-600 pb-6">
            <h1 className="text-4xl font-bold text-blue-900 mb-2">Lerelax Hotel</h1>
            <h2 className="text-3xl font-bold text-blue-800 mb-4" style={{ fontFamily: 'Arial' }}>فندق ليريلاكس</h2>
            <div className="text-gray-600 space-y-1">
              <p className="text-lg">7328 King Abdulaziz Rd, 4656, Almatar, Buqayq 33261</p>
              <p className="text-lg" style={{ fontFamily: 'Arial' }}>7328 طريق الملك عبدالعزيز، 4656، المطار، بقيق 33261</p>
              <p>Phone / الهاتف: +966 560000517 | Email / البريد: info@lerelax.online</p>
            </div>
          </div>

          {/* Invoice Title */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-4 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold">INVOICE / فاتورة</h3>
              <p className="text-blue-100">Invoice No: INV-{reservationData.id.slice(0, 8)}</p>
              <p className="text-blue-100" style={{ fontFamily: 'Arial' }}>رقم الفاتورة: INV-{reservationData.id.slice(0, 8)}</p>
            </div>
          </div>

          {/* Guest and Booking Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Guest Information */}
            <div className="bg-gray-50 p-6 rounded-lg border">
              <h4 className="text-lg font-bold text-blue-900 mb-4 border-b border-blue-200 pb-2">
                Guest Information / بيانات النزيل
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-gray-700">Name / الاسم:</span>
                  <p className="text-gray-900">{reservationData.first_name} {reservationData.last_name}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Email / البريد الإلكتروني:</span>
                  <p className="text-gray-900">{reservationData.email}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Phone / الهاتف:</span>
                  <p className="text-gray-900">{reservationData.phone}</p>
                </div>
              </div>
            </div>

            {/* Booking Information */}
            <div className="bg-gray-50 p-6 rounded-lg border">
              <h4 className="text-lg font-bold text-blue-900 mb-4 border-b border-blue-200 pb-2">
                Booking Details / تفاصيل الحجز
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-gray-700">Check-in / تاريخ الوصول:</span>
                  <p className="text-gray-900">{formatDate(reservationData.check_in_date)}</p>
                  <p className="text-gray-700 text-sm" style={{ fontFamily: 'Arial' }}>{formatDateArabic(reservationData.check_in_date)}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Check-out / تاريخ المغادرة:</span>
                  <p className="text-gray-900">{formatDate(reservationData.check_out_date)}</p>
                  <p className="text-gray-700 text-sm" style={{ fontFamily: 'Arial' }}>{formatDateArabic(reservationData.check_out_date)}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Guests / عدد النزلاء:</span>
                  <p className="text-gray-900">{reservationData.adults} Adults, {reservationData.children} Children</p>
                  <p className="text-gray-700 text-sm" style={{ fontFamily: 'Arial' }}>{reservationData.adults} بالغ، {reservationData.children} طفل</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Nights / عدد الليالي:</span>
                  <p className="text-gray-900">{calculateNights()} nights / ليلة</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Items Section - Only show in edit mode */}
          <div className="mb-6 print:hidden">
            <h4 className="text-lg font-bold text-blue-900 mb-4">Add Additional Items / إضافة عناصر إضافية</h4>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <input
                type="text"
                placeholder="Item name (English)"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="px-3 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="اسم العنصر (عربي)"
                value={newItem.nameAr}
                onChange={(e) => setNewItem({ ...newItem, nameAr: e.target.value })}
                className="px-3 py-2 border rounded"
                style={{ fontFamily: 'Arial' }}
              />
              <input
                type="number"
                placeholder="Quantity / الكمية"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                className="px-3 py-2 border rounded"
              />
              <input
                type="number"
                placeholder="Price / السعر"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                className="px-3 py-2 border rounded"
              />
              <button
                onClick={addItem}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add / إضافة
              </button>
            </div>
          </div>

          {/* Invoice Items Table */}
          <div className="mb-8">
            <h4 className="text-lg font-bold text-blue-900 mb-4">Invoice Items / عناصر الفاتورة</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="border border-gray-300 px-4 py-3 text-left">
                      Description / الوصف
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center">
                      Quantity / الكمية
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-right">
                      Unit Price / سعر الوحدة
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-right">
                      Total / المجموع
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center print:hidden">
                      Action / إجراء
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Room Charge */}
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3">
                      <div>
                        <p className="font-semibold">{room?.name || 'Room'} - {calculateNights()} nights</p>
                        <p className="text-sm text-gray-600" style={{ fontFamily: 'Arial' }}>
                          {room?.name || 'غرفة'} - {calculateNights()} ليلة
                        </p>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">{calculateNights()}</td>
                    <td className="border border-gray-300 px-4 py-3 text-right">
                      {room?.price?.toFixed(2)} SAR / ريال
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right font-semibold">
                      {roomTotal.toFixed(2)} SAR / ريال
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center print:hidden">-</td>
                  </tr>

                  {/* Additional Items */}
                  {additionalItems.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3">
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-600" style={{ fontFamily: 'Arial' }}>{item.nameAr}</p>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{item.quantity}</td>
                      <td className="border border-gray-300 px-4 py-3 text-right">
                        {item.price.toFixed(2)} SAR / ريال
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-right font-semibold">
                        {(item.price * item.quantity).toFixed(2)} SAR / ريال
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center print:hidden">
                        <button
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove / حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Discount and Tax Controls - Only show in edit mode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 print:hidden">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Amount / مبلغ الخصم (SAR / ريال)
              </label>
              <input
                type="number"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Rate / معدل الضريبة (%)
              </label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          {/* Totals Section */}
          <div className="bg-gray-50 p-6 rounded-lg border">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Subtotal / المجموع الفرعي:</span>
                <span className="font-semibold">{subtotal.toFixed(2)} SAR / ريال</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-red-600">
                  <span>Discount / الخصم:</span>
                  <span className="font-semibold">-{discountAmount.toFixed(2)} SAR / ريال</span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Tax ({taxRate}%) / الضريبة:</span>
                <span className="font-semibold">{taxAmount.toFixed(2)} SAR / ريال</span>
              </div>
              
              <div className="border-t-2 border-blue-600 pt-3">
                <div className="flex justify-between items-center text-xl font-bold text-blue-900">
                  <span>Total Amount / المبلغ الإجمالي:</span>
                  <span>{totalAmount.toFixed(2)} SAR / ريال</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="mt-6 print:hidden">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes / ملاحظات
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded"
              placeholder="Add any additional notes here... / أضف أي ملاحظات إضافية هنا..."
            />
          </div>

          {/* Display Notes if any */}
          {notes && (
            <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h5 className="font-semibold text-gray-800 mb-2">Notes / ملاحظات:</h5>
              <p className="text-gray-700 whitespace-pre-wrap">{notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t text-center text-gray-600">
            <p className="mb-2">Thank you for choosing Lerelax Hotel!</p>
            <p className="mb-4" style={{ fontFamily: 'Arial' }}>شكراً لاختياركم فندق ليريلاكس!</p>
            <p className="text-sm">
              For any inquiries, please contact us at +966 560000517 or info@lerelax.online
            </p>
            <p className="text-sm" style={{ fontFamily: 'Arial' }}>
              لأي استفسارات، يرجى الاتصال بنا على +966 560000517 أو info@lerelax.online
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;