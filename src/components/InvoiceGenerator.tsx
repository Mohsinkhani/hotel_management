import React, { useState, useRef } from 'react';
import { X, Download, Printer as Print, Calendar, User, Mail, Phone, MapPin, Building } from 'lucide-react';
import { supabase } from '../supabaseClient';

type Reservation = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  check_in_date: string | null;
  check_out_date: string | null;
  room_id: string | null;
  adults: number | null;
  children: number | null;
  special_requests: string | null;
  status: string | null;
};

type Room = {
  id: number;
  name: string;
  type: string;
  price: number;
  description: string;
};

type InvoiceItem = {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
};

interface InvoiceGeneratorProps {
  reservation: Reservation;
  room?: Room;
  onClose: () => void;
}

const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({ reservation, room, onClose }) => {
  const [additionalItems, setAdditionalItems] = useState<InvoiceItem[]>([]);
  const [newItem, setNewItem] = useState({ description: '', quantity: 1, rate: 0 });
  const [taxRate, setTaxRate] = useState(15); // 15% VAT for Saudi Arabia
  const [discountAmount, setDiscountAmount] = useState(0);
  const [notes, setNotes] = useState('');
  const invoiceRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateNights = () => {
    if (!reservation.check_in_date || !reservation.check_out_date) return 1;
    const inDate = new Date(reservation.check_in_date);
    const outDate = new Date(reservation.check_out_date);
    const nights = Math.ceil((outDate.getTime() - inDate.getTime()) / (1000 * 3600 * 24));
    return Math.max(1, nights);
  };

  const nights = calculateNights();
  const roomTotal = room ? room.price * nights : 0;
  const additionalTotal = additionalItems.reduce((sum, item) => sum + item.amount, 0);
  const subtotal = roomTotal + additionalTotal - discountAmount;
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  const addItem = () => {
    if (newItem.description.trim()) {
      const amount = newItem.quantity * newItem.rate;
      setAdditionalItems([...additionalItems, { ...newItem, amount }]);
      setNewItem({ description: '', quantity: 1, rate: 0 });
    }
  };

  const removeItem = (index: number) => {
    setAdditionalItems(additionalItems.filter((_, i) => i !== index));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>فاتورة - ${reservation.id.slice(0, 8).toUpperCase()}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
            body { 
              font-family: 'Amiri', serif; 
              margin: 0; 
              padding: 20px; 
              direction: rtl;
              background: #f8f9fa;
            }
            .invoice-container { 
              max-width: 800px; 
              margin: 0 auto; 
              background: white;
              box-shadow: 0 0 20px rgba(0,0,0,0.1);
              border-radius: 10px;
              overflow: hidden;
            }
            .header { 
              background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
              color: white; 
              padding: 30px; 
              text-align: center;
              position: relative;
            }
            .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
              opacity: 0.3;
            }
            .hotel-name { 
              font-size: 2.5rem; 
              font-weight: 700; 
              margin-bottom: 10px;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
              position: relative;
              z-index: 1;
            }
            .hotel-info { 
              font-size: 1.1rem; 
              opacity: 0.95;
              position: relative;
              z-index: 1;
            }
            .invoice-title {
              background: #f59e0b;
              color: white;
              padding: 15px 30px;
              margin: 20px 0;
              border-radius: 25px;
              font-size: 1.8rem;
              font-weight: 700;
              display: inline-block;
              box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
            }
            .content { 
              padding: 30px; 
            }
            .info-section {
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              border-radius: 15px;
              padding: 25px;
              margin: 20px 0;
              border: 2px solid #e2e8f0;
            }
            .info-grid { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 30px; 
              margin: 20px 0; 
            }
            .info-card {
              background: white;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              border-right: 4px solid #3b82f6;
            }
            .info-title { 
              font-size: 1.3rem; 
              font-weight: 700; 
              color: #1e40af; 
              margin-bottom: 15px;
              display: flex;
              align-items: center;
            }
            .info-title::before {
              content: '◆';
              margin-left: 10px;
              color: #f59e0b;
            }
            .items-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 25px 0;
              background: white;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            .items-table th { 
              background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
              color: white;
              padding: 15px;
              font-weight: 700;
              font-size: 1.1rem;
            }
            .items-table td { 
              padding: 15px; 
              border-bottom: 1px solid #e5e7eb;
            }
            .items-table tr:nth-child(even) {
              background: #f8fafc;
            }
            .items-table tr:hover {
              background: #e0f2fe;
            }
            .totals { 
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              padding: 25px;
              border-radius: 15px;
              margin: 25px 0;
              border: 2px solid #e2e8f0;
            }
            .total-row { 
              display: flex; 
              justify-content: space-between; 
              margin: 10px 0;
              font-size: 1.1rem;
            }
            .total-final { 
              font-weight: 700; 
              font-size: 1.4rem;
              color: #1e40af;
              border-top: 2px solid #3b82f6;
              padding-top: 15px;
              margin-top: 15px;
            }
            .footer { 
              background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
              color: white;
              padding: 25px;
              text-align: center;
              font-size: 1.1rem;
            }
            .decorative-border {
              height: 4px;
              background: linear-gradient(90deg, #f59e0b 0%, #3b82f6 50%, #f59e0b 100%);
              margin: 20px 0;
            }
            @media print {
              body { background: white; }
              .invoice-container { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          ${invoiceRef.current?.innerHTML}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const saveInvoice = async () => {
    try {
      const invoiceData = {
        reservation_id: reservation.id,
        room_total: roomTotal,
        additional_items: additionalItems,
        discount_amount: discountAmount,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        total_amount: total,
        notes: notes,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('invoices').insert([invoiceData]);
      if (error) throw error;
      
      alert('تم حفظ الفاتورة بنجاح!');
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('فشل في حفظ الفاتورة. يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header Controls */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 print:hidden">
          <h2 className="text-2xl font-bold text-gray-800">مولد الفواتير</h2>
          <div className="flex gap-3">
            <button
              onClick={saveInvoice}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={18} />
              حفظ
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={18} />
              تحميل
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Print size={18} />
              طباعة
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div ref={invoiceRef} className="invoice-container" style={{ fontFamily: 'Amiri, serif', direction: 'rtl' }}>
          {/* Header */}
          <div className="header" style={{ 
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            color: 'white',
            padding: '30px',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h1 className="hotel-name" style={{ 
                fontSize: '2.5rem', 
                fontWeight: '700', 
                marginBottom: '10px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}>
                فندق ليريلاكس
              </h1>
              <div className="hotel-info" style={{ fontSize: '1.1rem', opacity: '0.95' }}>
                <p style={{ margin: '5px 0' }}>7328 طريق الملك عبدالعزيز، 4656، المطار، بقيق 33261</p>
                <p style={{ margin: '5px 0' }}>هاتف: +966 560000517 | البريد الإلكتروني: info@lerelax.online</p>
              </div>
            </div>
          </div>

          <div className="content" style={{ padding: '30px' }}>
            {/* Invoice Title */}
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <span className="invoice-title" style={{
                background: '#f59e0b',
                color: 'white',
                padding: '15px 30px',
                borderRadius: '25px',
                fontSize: '1.8rem',
                fontWeight: '700',
                display: 'inline-block',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
              }}>
                فـــاتــورة
              </span>
            </div>

            {/* Invoice Details */}
            <div style={{ textAlign: 'center', margin: '20px 0', fontSize: '1.1rem' }}>
              <p><strong>رقم الفاتورة:</strong> {reservation.id.slice(0, 8).toUpperCase()}</p>
              <p><strong>التاريخ:</strong> {formatDate(new Date().toISOString())}</p>
            </div>

            <div className="decorative-border" style={{
              height: '4px',
              background: 'linear-gradient(90deg, #f59e0b 0%, #3b82f6 50%, #f59e0b 100%)',
              margin: '20px 0'
            }}></div>

            {/* Guest and Booking Information */}
            <div className="info-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '30px', 
              margin: '20px 0' 
            }}>
              <div className="info-card" style={{
                background: 'white',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                borderRight: '4px solid #3b82f6'
              }}>
                <h3 className="info-title" style={{ 
                  fontSize: '1.3rem', 
                  fontWeight: '700', 
                  color: '#1e40af', 
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  ◆ بيانات النزيل
                </h3>
                <div style={{ lineHeight: '1.8' }}>
                  <p><strong>الاسم:</strong> {reservation.first_name} {reservation.last_name}</p>
                  <p><strong>البريد الإلكتروني:</strong> {reservation.email}</p>
                  <p><strong>رقم الهاتف:</strong> {reservation.phone}</p>
                  <p><strong>عدد النزلاء:</strong> {reservation.adults} بالغين{reservation.children ? `, ${reservation.children} أطفال` : ''}</p>
                </div>
              </div>
              
              <div className="info-card" style={{
                background: 'white',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                borderRight: '4px solid #3b82f6'
              }}>
                <h3 className="info-title" style={{ 
                  fontSize: '1.3rem', 
                  fontWeight: '700', 
                  color: '#1e40af', 
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  ◆ تفاصيل الحجز
                </h3>
                <div style={{ lineHeight: '1.8' }}>
                  <p><strong>الغرفة:</strong> {room?.name || reservation.room_id}</p>
                  <p><strong>النوع:</strong> {room?.type}</p>
                  <p><strong>تاريخ الوصول:</strong> {formatDate(reservation.check_in_date)}</p>
                  <p><strong>تاريخ المغادرة:</strong> {formatDate(reservation.check_out_date)}</p>
                  <p><strong>عدد الليالي:</strong> {nights}</p>
                </div>
              </div>
            </div>

            {/* Additional Items Form (Print Hidden) */}
            <div className="mb-8 print:hidden">
              <h3 className="text-lg font-semibold mb-4">إضافة عناصر إضافية</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="الوصف"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="الكمية"
                    min="1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="السعر (ريال)"
                    min="0"
                    step="0.01"
                    value={newItem.rate}
                    onChange={(e) => setNewItem({ ...newItem, rate: Number(e.target.value) })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={addItem}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    إضافة عنصر
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">معدل الضريبة (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الخصم (ريال)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Items Table */}
            <div style={{ margin: '25px 0' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1e40af', marginBottom: '15px' }}>
                ◆ عناصر الفاتورة
              </h3>
              <table className="items-table" style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                background: 'white',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', color: 'white' }}>
                    <th style={{ padding: '15px', fontWeight: '700', fontSize: '1.1rem' }}>الوصف</th>
                    <th style={{ padding: '15px', fontWeight: '700', fontSize: '1.1rem' }}>الكمية</th>
                    <th style={{ padding: '15px', fontWeight: '700', fontSize: '1.1rem' }}>السعر (ريال)</th>
                    <th style={{ padding: '15px', fontWeight: '700', fontSize: '1.1rem' }}>المبلغ (ريال)</th>
                    <th className="print:hidden" style={{ padding: '15px', fontWeight: '700', fontSize: '1.1rem' }}>إجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Room Charge */}
                  <tr style={{ background: '#f8fafc' }}>
                    <td style={{ padding: '15px', borderBottom: '1px solid #e5e7eb' }}>
                      {room?.name} ({room?.type})<br />
                      <small style={{ color: '#6b7280' }}>{formatDate(reservation.check_in_date)} إلى {formatDate(reservation.check_out_date)}</small>
                    </td>
                    <td style={{ padding: '15px', borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>{nights}</td>
                    <td style={{ padding: '15px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>{room?.price.toFixed(2)}</td>
                    <td style={{ padding: '15px', borderBottom: '1px solid #e5e7eb', textAlign: 'right', fontWeight: '600' }}>{roomTotal.toFixed(2)}</td>
                    <td className="print:hidden" style={{ padding: '15px', borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>-</td>
                  </tr>
                  
                  {/* Additional Items */}
                  {additionalItems.map((item, index) => (
                    <tr key={index} style={{ background: index % 2 === 0 ? 'white' : '#f8fafc' }}>
                      <td style={{ padding: '15px', borderBottom: '1px solid #e5e7eb' }}>{item.description}</td>
                      <td style={{ padding: '15px', borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ padding: '15px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>{item.rate.toFixed(2)}</td>
                      <td style={{ padding: '15px', borderBottom: '1px solid #e5e7eb', textAlign: 'right', fontWeight: '600' }}>{item.amount.toFixed(2)}</td>
                      <td className="print:hidden" style={{ padding: '15px', borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>
                        <button
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="totals" style={{ 
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              padding: '25px',
              borderRadius: '15px',
              border: '2px solid #e2e8f0'
            }}>
              <div className="total-row" style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0', fontSize: '1.1rem' }}>
                <span>المجموع الفرعي:</span>
                <span style={{ fontWeight: '600' }}>{(roomTotal + additionalTotal).toFixed(2)} ريال</span>
              </div>
              {discountAmount > 0 && (
                <div className="total-row" style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0', fontSize: '1.1rem', color: '#059669' }}>
                  <span>الخصم:</span>
                  <span style={{ fontWeight: '600' }}>-{discountAmount.toFixed(2)} ريال</span>
                </div>
              )}
              <div className="total-row" style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0', fontSize: '1.1rem' }}>
                <span>ضريبة القيمة المضافة ({taxRate}%):</span>
                <span style={{ fontWeight: '600' }}>{taxAmount.toFixed(2)} ريال</span>
              </div>
              <div className="total-final" style={{ 
                fontWeight: '700', 
                fontSize: '1.4rem',
                color: '#1e40af',
                borderTop: '2px solid #3b82f6',
                paddingTop: '15px',
                marginTop: '15px',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>المجموع الإجمالي:</span>
                <span>{total.toFixed(2)} ريال</span>
              </div>
            </div>

            {/* Notes Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">ملاحظات</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أضف أي ملاحظات أو شروط إضافية..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 print:hidden"
                rows={4}
              />
              {notes && (
                <div className="hidden print:block bg-gray-50 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="footer" style={{ 
            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
            color: 'white',
            padding: '25px',
            textAlign: 'center',
            fontSize: '1.1rem'
          }}>
            <p style={{ margin: '5px 0', fontWeight: '600' }}>شكراً لاختياركم فندق ليريلاكس!</p>
            <p style={{ margin: '5px 0' }}>الدفع مستحق عند المغادرة. يرجى تقديم هذه الفاتورة في الاستقبال.</p>
            <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem', opacity: '0.8' }}>هذه فاتورة مُنشأة إلكترونياً ولا تتطلب توقيعاً.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;