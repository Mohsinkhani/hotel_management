import React, { useState, useRef } from 'react';
import { X, Download, Printer as Print } from 'lucide-react';
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
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
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
          <title>Invoice - ${reservation.id.slice(0, 8).toUpperCase()}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
            body { 
              font-family: 'Amiri', serif; 
              margin: 0; 
              padding: 0; 
              direction: rtl;
            }
            .invoice-container { 
              width: 100%; 
              margin: 0 auto; 
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              padding: 2px;
              text-align: right;
            }
            .text-center {
              text-align: center;
            }
            .text-left {
              text-align: left;
            }
            .text-right {
              text-align: right;
            }
            .border-bottom {
              border-bottom: 1px solid #000;
            }
            .border-top {
              border-top: 1px solid #000;
            }
            .no-print {
              display: none;
            }
            @media print {
              .no-print {
                display: none;
              }
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
      
      alert('Invoice saved successfully!');
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Failed to save invoice. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header Controls */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 no-print">
          <h2 className="text-2xl font-bold text-gray-800">Invoice Generator</h2>
          <div className="flex gap-3">
            <button
              onClick={saveInvoice}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={18} />
              Save
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={18} />
              Download
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Print size={18} />
              Print
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
          <table>
            <colgroup>
              <col style={{ width: '0%' }} />
              <col style={{ width: '7%' }} />
              <col style={{ width: '0%' }} />
              <col style={{ width: '4%' }} />
              <col style={{ width: '11%' }} />
              <col style={{ width: '0%' }} />
              <col style={{ width: '0%' }} />
              <col style={{ width: '4%' }} />
              <col style={{ width: '3%' }} />
              <col style={{ width: '2%' }} />
              <col style={{ width: '1%' }} />
              <col style={{ width: '0%' }} />
              <col style={{ width: '1%' }} />
              <col style={{ width: '1%' }} />
              <col style={{ width: '3%' }} />
              <col style={{ width: '3%' }} />
              <col style={{ width: '1%' }} />
              <col style={{ width: '0%' }} />
              <col style={{ width: '0%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '0%' }} />
              <col style={{ width: '0%' }} />
              <col style={{ width: '0%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '2%' }} />
              <col style={{ width: '1%' }} />
              <col style={{ width: '2%' }} />
              <col style={{ width: '1%' }} />
              <col style={{ width: '1%' }} />
              <col style={{ width: '7%' }} />
              <col style={{ width: '0%' }} />
              <col style={{ width: '0%' }} />
              <col style={{ width: '0%' }} />
              <col style={{ width: '1%' }} />
              <col style={{ width: '0%' }} />
              <col style={{ width: '0%' }} />
              <col style={{ width: '1%' }} />
              <col style={{ width: '1%' }} />
              <col style={{ width: '3%' }} />
              <col style={{ width: '2%' }} />
              <col style={{ width: '0%' }} />
              <col style={{ width: '0%' }} />
            </colgroup>
            <thead>
              <tr>
                <th colSpan={42}>
                  <table style={{ width: '100%' }}>
                    <colgroup>
                      <col style={{ width: '34%' }} />
                      <col style={{ width: '6%' }} />
                      <col style={{ width: '17%' }} />
                      <col style={{ width: '6%' }} />
                      <col style={{ width: '34%' }} />
                      <col style={{ width: '0%' }} />
                    </colgroup>
                    <thead>
                      <tr>
                        <th colSpan={2} rowSpan={2}><strong>فندق ياسر الضلعي لي ريلاكس</strong></th>
                        <th style={{ textAlign: 'center' }}></th>
                        <th colSpan={2} rowSpan={2} style={{ textAlign: 'right' }}><strong>فندق ياسر الضلعي لي ريلاكس</strong></th>
                        <th></th>
                      </tr>
                      <tr>
                        <th rowSpan={3} style={{ textAlign: 'center' }}>{/* Image would go here */}</th>
                        <th></th>
                      </tr>
                      <tr>
                        <th colSpan={2}>
                          <p>Buqayq - Al Mattar</p>
                          <p>المملكة العربية السعودية - محافظة بقيق</p>
                        </th>
                        <th colSpan={2} style={{ textAlign: 'right' }}>
                          <p>بقيق - المطار</p>
                          <p>المملكة العربية السعودية - محافظة بقيق</p>
                        </th>
                        <th></th>
                      </tr>
                      <tr>
                        <th></th>
                        <th style={{ textAlign: 'center' }}></th>
                        <th style={{ textAlign: 'center' }}></th>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td></td>
                        <td colSpan={3} style={{ textAlign: 'center' }}><strong>+966 560000517</strong></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colSpan={5}>
                          <table>
                            <colgroup>
                              <col style={{ width: '15%' }} />
                              <col style={{ width: '17%' }} />
                              <col style={{ width: '15%' }} />
                              <col style={{ width: '17%' }} />
                              <col style={{ width: '16%' }} />
                              <col style={{ width: '17%' }} />
                            </colgroup>
                            <thead>
                              <tr>
                                <th>C.R:</th>
                                <th style={{ textAlign: 'center' }}>2059002936</th>
                                <th style={{ textAlign: 'right' }}>:السجل التجاري</th>
                                <th>VAT No:</th>
                                <th style={{ textAlign: 'center' }}>300929806300003</th>
                                <th style={{ textAlign: 'right' }}>:الرقم الضريبي</th>
                              </tr>
                            </thead>
                            <tbody></tbody>
                          </table>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td></td>
                        <td style={{ textAlign: 'center' }}></td>
                        <td style={{ textAlign: 'center' }}></td>
                        <td style={{ textAlign: 'center' }}></td>
                        <td></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={13} rowSpan={2}>Simplified TAX Invoice</td>
                <td></td>
                <td colSpan={17} rowSpan={3} style={{ textAlign: 'right' }}>فاتورة ضريبية مبسطة</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td colSpan={4} rowSpan={19}>{/* Image would go here */}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={6} rowSpan={2}>Invoice No.:</td>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={8} style={{ textAlign: 'center' }}>{reservation.id.slice(0, 8).toUpperCase()}</td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td colSpan={7} rowSpan={2} style={{ textAlign: 'right' }}>:رقم الفاتورة</td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td colSpan={10} rowSpan={2}>Res No./(Res Source No.):</td>
                <td colSpan={8} style={{ textAlign: 'center' }}>{reservation.id.slice(0, 8).toUpperCase()}</td>
                <td colSpan={14} rowSpan={2} style={{ textAlign: 'right' }}>:رقم الحجز/ (رقم مصدر الحجز)</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={14} rowSpan={3} style={{ textAlign: 'center' }}>
                  {reservation.check_in_date ? formatDate(reservation.check_in_date) : '-'} - {reservation.check_out_date ? formatDate(reservation.check_out_date) : '-'}
                </td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={6}>Rental Period:</td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td colSpan={7} style={{ textAlign: 'right' }}>:فترة الحجز</td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={32}></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={8} rowSpan={3} style={{ textAlign: 'left' }}>Created on:</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td colSpan={13} rowSpan={3} style={{ textAlign: 'right' }}>:أنشىء في</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={8} style={{ textAlign: 'center' }}>{formatDate(new Date().toISOString())}</td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={4} rowSpan={2} style={{ textAlign: 'left' }}>Invoice date:</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={8} style={{ textAlign: 'center' }}>{formatDate(new Date().toISOString())}</td>
                <td style={{ textAlign: 'right' }}></td>
                <td colSpan={13} rowSpan={2} style={{ textAlign: 'right' }}>:تاريخ الفاتورة</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={4} rowSpan={4} style={{ textAlign: 'left' }}>Unit No:</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td colSpan={7} rowSpan={4} style={{ textAlign: 'right' }}>:رقم الوحدة</td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={8} style={{ textAlign: 'center' }}>{room?.id || '-'}</td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={4} rowSpan={3} style={{ textAlign: 'left' }}>Unit Type:</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td colSpan={7} rowSpan={3} style={{ textAlign: 'right' }}>:نوع الوحدة</td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={8} style={{ textAlign: 'center' }}>{room?.type || '-'}</td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={4} rowSpan={2} style={{ textAlign: 'left' }}>Block:</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={8} style={{ textAlign: 'center' }}>1</td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td colSpan={7} rowSpan={2} style={{ textAlign: 'right' }}>:المبنى</td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td colSpan={6}><u>Buyer:</u></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td colSpan={15} style={{ textAlign: 'right' }}><u>المشتري</u></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td colSpan={4} rowSpan={2}>Street</td>
                <td colSpan={5} rowSpan={2} style={{ textAlign: 'center' }}>---</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={4} rowSpan={2} style={{ textAlign: 'right' }}>الشارع</td>
                <td></td>
                <td colSpan={4} rowSpan={2}>Guest Name</td>
                <td style={{ textAlign: 'right' }}></td>
                <td colSpan={10} rowSpan={2} style={{ textAlign: 'center' }}>{reservation.first_name} {reservation.last_name}</td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td colSpan={8} rowSpan={2} style={{ textAlign: 'right' }}>:اسم العميل</td>
                <td></td>
              </tr>
              <tr>
                <td colSpan={4} rowSpan={2}>District:</td>
                <td colSpan={5} rowSpan={2} style={{ textAlign: 'center' }}>---</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={4} rowSpan={2} style={{ textAlign: 'right' }}>الحي</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={4} rowSpan={2}>Mobile No:</td>
                <td style={{ textAlign: 'right' }}></td>
                <td colSpan={10} rowSpan={2} style={{ textAlign: 'center' }}>{reservation.phone}</td>
                <td colSpan={8} rowSpan={2} style={{ textAlign: 'right' }}>:رقم الجوال</td>
                <td></td>
              </tr>
              <tr>
                <td colSpan={4} rowSpan={2}>Postal Code:</td>
                <td colSpan={5} rowSpan={2} style={{ textAlign: 'center' }}>---</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={4} rowSpan={2} style={{ textAlign: 'right' }}>:الرمز البريدي</td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={4} rowSpan={2}>Corporate</td>
                <td style={{ textAlign: 'right' }}></td>
                <td colSpan={10} rowSpan={2} style={{ textAlign: 'center' }}>---</td>
                <td colSpan={8} rowSpan={2} style={{ textAlign: 'right' }}>:الشركة</td>
                <td></td>
              </tr>
              <tr>
                <td colSpan={4} rowSpan={2}>Build / (add) No.</td>
                <td colSpan={5} rowSpan={2} style={{ textAlign: 'center' }}>---</td>
                <td colSpan={8} rowSpan={2} style={{ textAlign: 'right' }}>رقم المبنى/ (الإضافي)</td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td colSpan={4} rowSpan={2}>Country</td>
                <td style={{ textAlign: 'right' }}></td>
                <td colSpan={10} rowSpan={2} style={{ textAlign: 'center' }}>---</td>
                <td colSpan={8} rowSpan={2} style={{ textAlign: 'right' }}>:الدولة</td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
              </tr>
              <tr>
                <td colSpan={4} rowSpan={2}>VAT No:</td>
                <td colSpan={5} rowSpan={2} style={{ textAlign: 'center' }}>---</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={4} rowSpan={2} style={{ textAlign: 'right' }}>:الرقم الضريبي</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={4} rowSpan={2}>City</td>
                <td style={{ textAlign: 'right' }}></td>
                <td colSpan={10} rowSpan={2} style={{ textAlign: 'center' }}>---</td>
                <td colSpan={8} rowSpan={2} style={{ textAlign: 'right' }}>:المدينة</td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
              </tr>
              <tr>
                <td colSpan={41}></td>
                <td></td>
              </tr>
              <tr>
                <td colSpan={8}><u>Additional Seller's Information</u></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td colSpan={14} style={{ textAlign: 'right' }}><u>معلومات البائع الإضافية</u></td>
                <td></td>
              </tr>
              <tr>
                <td colSpan={4}>Street</td>
                <td colSpan={8} style={{ textAlign: 'center' }}>الملك عبدالعزيز</td>
                <td></td>
                <td colSpan={4} style={{ textAlign: 'right' }}>الشارع</td>
                <td></td>
                <td colSpan={4}>Country</td>
                <td colSpan={8} style={{ textAlign: 'center' }}>السعودية</td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td colSpan={9} style={{ textAlign: 'right' }}>:الدولة</td>
                <td></td>
              </tr>
              <tr>
                <td colSpan={4}>Building No.:</td>
                <td colSpan={8} style={{ textAlign: 'center' }}>7328</td>
                <td></td>
                <td colSpan={4} style={{ textAlign: 'right' }}>:رقم المبنى</td>
                <td></td>
                <td colSpan={4}>City</td>
                <td colSpan={9} style={{ textAlign: 'center' }}>بقيق</td>
                <td style={{ textAlign: 'right' }}></td>
                <td colSpan={9} style={{ textAlign: 'right' }}>:المدينة</td>
                <td></td>
              </tr>
              <tr>
                <td colSpan={4}>Additional No:</td>
                <td colSpan={8} style={{ textAlign: 'center' }}>4656</td>
                <td colSpan={5} style={{ textAlign: 'right' }}>:الرقم الإضافي</td>
                <td></td>
                <td></td>
                <td colSpan={3}>District:</td>
                <td colSpan={8} style={{ textAlign: 'center' }}>المطار</td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td colSpan={9} style={{ textAlign: 'right' }}>:الحي</td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td colSpan={39}>
                  <table style={{ width: '100%' }}>
                    <colgroup>
                      <col style={{ width: '10%' }} />
                      <col style={{ width: '11%' }} />
                      <col style={{ width: '10%' }} />
                      <col style={{ width: '9%' }} />
                      <col style={{ width: '8%' }} />
                      <col style={{ width: '10%' }} />
                      <col style={{ width: '10%' }} />
                      <col style={{ width: '5%' }} />
                      <col style={{ width: '24%' }} />
                    </colgroup>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'center' }}><p>Grand Total</p><p>الإجمالي الكلي</p></th>
                        <th style={{ textAlign: 'center' }}><p>Tax Amount</p><p>مبلغ الضريبة</p></th>
                        <th style={{ textAlign: 'center' }}><p>Tax Rate %</p><p>% نسبة الضريبة</p></th>
                        <th style={{ textAlign: 'center' }}><p>Total</p><p>الإجمالي</p></th>
                        <th style={{ textAlign: 'center' }}><p>Discount</p><p>الخصم</p></th>
                        <th style={{ textAlign: 'center' }}><p>Sub Total</p><p>الإجمالي الفرعي</p></th>
                        <th style={{ textAlign: 'center' }}><p>Price</p><p>السعر</p></th>
                        <th style={{ textAlign: 'center' }}><p>QTY</p><p>الكمية</p></th>
                        <th style={{ textAlign: 'center' }}><p>Description</p><p>الوصف</p></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ textAlign: 'center' }}>{total.toFixed(2)}</td>
                        <td style={{ textAlign: 'center' }}>{taxAmount.toFixed(2)}</td>
                        <td style={{ textAlign: 'center' }}>{taxRate}%</td>
                        <td style={{ textAlign: 'center' }}>{subtotal.toFixed(2)}</td>
                        <td style={{ textAlign: 'center' }}>{discountAmount.toFixed(2)}</td>
                        <td style={{ textAlign: 'center' }}>{(roomTotal + additionalTotal).toFixed(2)}</td>
                        <td style={{ textAlign: 'center' }}>{room?.price.toFixed(2)}</td>
                        <td style={{ textAlign: 'center' }}>{nights}</td>
                        <td style={{ textAlign: 'center' }}>
                          <p>إيجار الوحدة</p>
                          <p>{reservation.check_in_date ? formatDate(reservation.check_in_date) : '-'} - {reservation.check_out_date ? formatDate(reservation.check_out_date) : '-'}</p>
                        </td>
                      </tr>
                      {additionalItems.map((item, index) => (
                        <tr key={index}>
                          <td style={{ textAlign: 'center' }}>{item.amount.toFixed(2)}</td>
                          <td style={{ textAlign: 'center' }}>{(item.amount * taxRate / 100).toFixed(2)}</td>
                          <td style={{ textAlign: 'center' }}>{taxRate}%</td>
                          <td style={{ textAlign: 'center' }}>{item.amount.toFixed(2)}</td>
                          <td style={{ textAlign: 'center' }}>0</td>
                          <td style={{ textAlign: 'center' }}>{item.amount.toFixed(2)}</td>
                          <td style={{ textAlign: 'center' }}>{item.rate.toFixed(2)}</td>
                          <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                          <td style={{ textAlign: 'center' }}>{item.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={4}>Totals</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td colSpan={13} style={{ textAlign: 'right' }}>المبالغ الإجمالية</td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={7}>Total not subject to VAT</td>
                <td colSpan={14} style={{ textAlign: 'center' }}>0</td>
                <td colSpan={13} style={{ textAlign: 'right' }}>المبالغ الغير خاضعة للضريبة</td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={7}>Total subject to VAT</td>
                <td colSpan={14} style={{ textAlign: 'center' }}>{subtotal.toFixed(2)}</td>
                <td colSpan={13} style={{ textAlign: 'right' }}>المبالغ الخاضعة للضريبة</td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={7}>VAT (15%)</td>
                <td colSpan={14} style={{ textAlign: 'center' }}>{taxAmount.toFixed(2)}</td>
                <td colSpan={13} style={{ textAlign: 'right' }}>(15%) ضريبة القيمة المضافة</td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={7}>
                  <p><strong><u>Grand Total</u></strong></p>
                  <p><strong><u>Included VAT (15%)</u></strong></p>
                </td>
                <td colSpan={14} style={{ textAlign: 'center' }}>SAR {total.toFixed(2)}</td>
                <td colSpan={13} style={{ textAlign: 'right' }}>
                  <p><strong><u>الإجمالي الكلي</u></strong></p>
                  <p><strong><u>(15%) شامل ضريبة القيمة المضافة</u></strong></p>
                </td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td colSpan={2}>Notes</td>
                <td></td>
                <td colSpan={31} style={{ textAlign: 'center' }}>{notes}</td>
                <td style={{ textAlign: 'right' }}></td>
                <td colSpan={6} style={{ textAlign: 'right' }}>ملاحظات</td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={31}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td colSpan={42}>
                  <table style={{ width: '100%' }}>
                    <colgroup>
                      <col style={{ width: '1%' }} />
                      <col style={{ width: '10%' }} />
                      <col style={{ width: '35%' }} />
                      <col style={{ width: '24%' }} />
                      <col style={{ width: '8%' }} />
                      <col style={{ width: '19%' }} />
                      <col style={{ width: '0%' }} />
                    </colgroup>
                    <thead>
                      <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th>Printed By:</th>
                        <th>ياسر علي الضلعي</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody></tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td colSpan={42}>
                  <table style={{ width: '100%' }}>
                    <colgroup>
                      <col style={{ width: '0%' }} />
                      <col style={{ width: '6%' }} />
                      <col style={{ width: '34%' }} />
                      <col style={{ width: '29%' }} />
                      <col style={{ width: '10%' }} />
                      <col style={{ width: '10%' }} />
                      <col style={{ width: '7%' }} />
                    </colgroup>
                    <tbody>
                      <tr>
                        <td></td>
                        <td style={{ textAlign: 'center' }}><strong>Email:</strong></td>
                        <td><strong>saudips@saudips.com</strong></td>
                        <td></td>
                        <td style={{ textAlign: 'center' }}><strong>Postal Code:</strong></td>
                        <td><strong>31992</strong></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td></td>
                        <td style={{ textAlign: 'center' }}></td>
                        <td></td>
                        <td></td>
                        <td style={{ textAlign: 'center' }}></td>
                        <td></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td style={{ textAlign: 'right' }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>

          {/* Additional Items Form (Print Hidden) */}
          <div className="no-print p-6">
            <h3 className="text-lg font-semibold mb-4">Add Additional Items</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  min="1"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="number"
                  placeholder="Rate (SAR)"
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
                  Add Item
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount (SAR)</label>
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

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes or terms..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;