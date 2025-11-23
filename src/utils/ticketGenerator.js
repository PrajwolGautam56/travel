import { jsPDF } from 'jspdf';

const formatCurrency = (amount = 0) => {
  try {
    return `Rs.${Number(amount || 0).toLocaleString('en-IN')}`;
  } catch {
    return `Rs.${amount}`;
  }
};

const formatDateTime = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

export const downloadBookingTicket = (booking, meta = {}) => {
  if (!booking) return;

  const doc = new jsPDF();
  const reference = booking.bookingReference || meta.reference || booking._id || booking.id || 'N/A';
  const type = (booking.type || meta.type || 'Booking').toUpperCase();
  const amount = booking.pricing?.totalAmount || booking.totalAmount || meta.amount || 0;
  const customerName = meta.customerName || (booking.user ? `${booking.user.firstName || ''} ${booking.user.lastName || ''}`.trim() : 'N/A');
  const customerEmail = meta.customerEmail || booking.user?.email || 'N/A';
  const issuedAt = new Date();

  doc.setFontSize(18);
  doc.text('Rhythm Tours & Travels', 20, 20);
  doc.setFontSize(12);
  doc.text('E-Ticket / Booking Confirmation', 20, 30);

  let y = 45;
  const lineGap = 7;

  const addLine = (label, value) => {
    doc.text(`${label}: ${value || 'N/A'}`, 20, y);
    y += lineGap;
  };

  addLine('Booking Reference', reference);
  addLine('Booking Type', type);
  addLine('Status', (booking.status || meta.status || 'pending').toUpperCase());
  addLine('Issued On', formatDateTime(issuedAt));

  y += 5;
  doc.setFontSize(13);
  doc.text('Passenger Details', 20, y);
  doc.setFontSize(12);
  y += lineGap;
  addLine('Passenger', customerName);
  addLine('Email', customerEmail);
  addLine('Amount', formatCurrency(amount));

  if (type === 'FLIGHT' || booking.flight) {
    const flight = booking.flight || {};
    y += 5;
    doc.setFontSize(13);
    doc.text('Flight Information', 20, y);
    doc.setFontSize(12);
    y += lineGap;
    addLine('Airline', flight.airline || booking.airline || 'N/A');
    addLine('Flight Number', flight.flightNumber || booking.flightNumber || 'N/A');
    addLine('Route', `${flight.from || booking.from || '---'} → ${flight.to || booking.to || '---'}`);
    addLine('Departure', formatDateTime(flight.departureTime || booking.departureTime));
    addLine('Arrival', formatDateTime(flight.arrivalTime || booking.arrivalTime));
    addLine('Cabin Class', booking.class || 'Economy');
    addLine('Stops', (flight.stops ?? booking.stops ?? 0).toString());
  }

  const passengers = booking.passengers || meta.passengers || [];
  if (passengers.length > 0) {
    y += 5;
    doc.setFontSize(13);
    doc.text('Passenger List', 20, y);
    doc.setFontSize(12);
    y += lineGap;
    passengers.forEach((passenger, index) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(
        `${index + 1}. ${passenger.title || ''} ${passenger.firstName || ''} ${passenger.lastName || ''}`.trim(),
        25,
        y
      );
      y += lineGap;
    });
  }

  y += 10;
  if (y > 270) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(10);
  doc.text(
    'This is a computer generated ticket. Please carry a valid photo ID during travel.',
    20,
    y
  );

  doc.save(`ticket-${reference}.pdf`);
};

