import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";
import { PDFDownloadLink, Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import QRCode from "qrcode";

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  leftSection: {
    width: '65%',
    paddingRight: 15,
  },
  rightSection: {
    width: '35%',
    borderLeftWidth: 1,
    borderLeftColor: '#E5E7EB',
    paddingLeft: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#001230',
  },
  eventName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    width: '40%',
    fontSize: 10,
    fontWeight: 'bold',
  },
  value: {
    width: '60%',
    fontSize: 10,
  },
  qrCode: {
    width: 120,
    height: 120,
    marginBottom: 8,
  },
  ticketId: {
    fontSize: 9,
    color: '#6B7280',
  },
  footer: {
    marginTop: 15,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    fontSize: 8,
    color: '#6B7280',
    textAlign: 'center',
  },
});

const TicketPDF = ({ booking, qrCodeDataURL }) => {
  return (
    <Document>
      <Page size="A6" style={styles.page}>
        <View style={styles.container}>
          <View style={styles.leftSection}>
            <View style={styles.header}>
              <Image src="/src/assets/logo2.png" style={styles.logo} />
              <Text style={styles.title}>Event Vertex</Text>
            </View>
            
            <Text style={styles.eventName}>
              {booking.eventDetails?.title || "Event Ticket"}
            </Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.label}>Ticket Type:</Text>
              <Text style={styles.value}>{booking.ticketType}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.label}>Quantity:</Text>
              <Text style={styles.value}>{booking.quantity}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.label}>Price per Ticket:</Text>
              <Text style={styles.value}>Rs. {booking.ticketPrice}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.label}>Total Amount:</Text>
              <Text style={styles.value}>Rs. {booking.totalPrice}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.label}>Transaction ID:</Text>
              <Text style={styles.value}>
                {booking.paymentDetails?.transaction_code || "N/A"}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>
                {new Date(booking.createdAt).toLocaleDateString()}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.label}>Booking ID:</Text>
              <Text style={styles.value}>{booking._id}</Text>
            </View>
          </View>
          
          <View style={styles.rightSection}>
            {qrCodeDataURL && (
              <Image src={qrCodeDataURL} style={styles.qrCode} />
            )}
            <Text style={styles.ticketId}>Scan for verification</Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text>
            This ticket serves as proof of purchase. Please present this ticket at the venue entrance.
          </Text>
          <Text>© Event Vertex 2025</Text>
        </View>
      </Page>
    </Document>
  );
};

// Main Component
const PurchaseSuccess = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [qrCodeDataURL, setQrCodeDataURL] = useState(null);
  const hasRun = useRef(false);

  const esewaData = searchParams.get("data");
  const savedTicket = localStorage.getItem("ticketinfo");
  const parsedTicket = JSON.parse(savedTicket);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const createTicket = async () => {
      try {
        const res = await fetch("/api/bookings/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId: parsedTicket.eventId,
            ticketType: parsedTicket.ticketType.type,
            quantity: parsedTicket.quantity,
            esewaData,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          toast.success("Successfully registered!");
          setBookingData(data.booking);
          
          // Generate QR code data URL for the PDF
          const qrData = JSON.stringify({
            eventId: data.booking.eventId,
            ticketType: data.booking.ticketType,
            quantity: data.booking.quantity,
            price: data.booking.ticketPrice,
            transactionId: data.booking.paymentDetails?.transaction_code || "N/A",
            bookingId: data.booking._id
          });
          
          // Generate QR code as data URL
          try {
            const qrDataURL = await QRCode.toDataURL(qrData, {
              margin: 1,
              width: 120,
              color: {
                dark: '#000000',
                light: '#FFFFFF'
              }
            });
            setQrCodeDataURL(qrDataURL);
          } catch (err) {
            console.error("QR code generation error:", err);
          }
          
          setLoading(false);
          setError(false);
          setIsSuccess(true);
        } else {
          setError(true);
          setIsSuccess(false);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setError(true);
        setLoading(false);
        setIsSuccess(false);
      }
    };

    createTicket();
  }, []);

  // QR Code component for display in the UI
  const TicketQRCode = ({ booking }) => {
    const qrValue = JSON.stringify({
      eventId: booking.eventId,
      ticketType: booking.ticketType,
      quantity: booking.quantity,
      price: booking.ticketPrice,
      transactionId: booking.paymentDetails?.transaction_code || "N/A",
      bookingId: booking._id
    });
    
    return (
      <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center">
        <QRCodeSVG 
          value={qrValue}
          size={120} 
          level="M"
          className="mb-2"
        />
        <p className="text-xs text-gray-600">Scan for verification</p>
      </div>
    );
  };

  // Function to download as image if PDF doesn't work
  const downloadAsImage = () => {
    if (!bookingData) return;
    
    // Create a container for the ticket
    const ticketContainer = document.createElement('div');
    ticketContainer.style.width = '500px';
    ticketContainer.style.padding = '20px';
    ticketContainer.style.backgroundColor = 'white';
    ticketContainer.style.border = '1px solid black';
    ticketContainer.style.display = 'flex';
    
    // Event details section
    const detailsSection = document.createElement('div');
    detailsSection.style.width = '65%';
    detailsSection.style.padding = '10px';
    
    // Logo and title
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.marginBottom = '15px';
    
    const logo = document.createElement('img');
    logo.src = '/src/assets/logo2.png';
    logo.style.width = '60px';
    logo.style.marginRight = '10px';
    
    const title = document.createElement('h2');
    title.textContent = 'Event Vertex';
    title.style.margin = '0';
    title.style.fontSize = '18px';
    
    header.appendChild(logo);
    header.appendChild(title);
    detailsSection.appendChild(header);
    
    // Event details
    const details = [
      { label: 'Ticket Type:', value: bookingData.ticketType },
      { label: 'Quantity:', value: bookingData.quantity },
      { label: 'Price per Ticket:', value: `Rs. ${bookingData.ticketPrice}` },
      { label: 'Total Amount:', value: `Rs. ${bookingData.totalPrice}` },
      { label: 'Transaction ID:', value: bookingData.paymentDetails?.transaction_code || 'N/A' },
      { label: 'Date:', value: new Date(bookingData.createdAt).toLocaleDateString() },
      { label: 'Booking ID:', value: bookingData._id }
    ];
    
    details.forEach(detail => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.marginBottom = '8px';
      
      const label = document.createElement('span');
      label.textContent = detail.label;
      label.style.width = '40%';
      label.style.fontWeight = 'bold';
      
      const value = document.createElement('span');
      value.textContent = detail.value;
      value.style.width = '60%';
      
      row.appendChild(label);
      row.appendChild(value);
      detailsSection.appendChild(row);
    });
    
    // QR code section
    const qrSection = document.createElement('div');
    qrSection.style.width = '35%';
    qrSection.style.display = 'flex';
    qrSection.style.flexDirection = 'column';
    qrSection.style.alignItems = 'center';
    qrSection.style.justifyContent = 'center';
    qrSection.style.borderLeft = '1px solid black';
    qrSection.style.padding = '10px';
    
    const qrImg = document.createElement('img');
    qrImg.src = qrCodeDataURL;
    qrImg.style.width = '120px';
    qrImg.style.height = '120px';
    
    const qrText = document.createElement('p');
    qrText.textContent = 'Scan for verification';
    qrText.style.fontSize = '12px';
    qrText.style.margin = '8px 0 0 0';
    
    qrSection.appendChild(qrImg);
    qrSection.appendChild(qrText);
    
    // Add sections to container
    ticketContainer.appendChild(detailsSection);
    ticketContainer.appendChild(qrSection);
    
    // Add footer
    const footer = document.createElement('div');
    footer.style.width = '100%';
    footer.style.textAlign = 'center';
    footer.style.borderTop = '1px solid black';
    footer.style.marginTop = '15px';
    footer.style.paddingTop = '10px';
    footer.style.fontSize = '12px';
    footer.style.color = '#666';
    footer.textContent = 'This ticket serves as proof of purchase. Please present at venue entrance.';
    
    // Convert to image using html2canvas
    html2canvas(ticketContainer).then(canvas => {
      const imageURL = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = imageURL;
      downloadLink.download = `event-vertex-ticket-${bookingData._id}.png`;
      downloadLink.click();
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
        <div className="bg-white p-6 rounded-xl shadow-md text-center max-w-md border border-gray-200">
          <h2 className="text-2xl font-bold mb-3">Processing Payment...</h2>
          <p className="text-base mb-4">
            We are updating your payment status. Please wait a moment.
          </p>
          <div className="w-12 h-12 border-3 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
        <div className="bg-white p-6 rounded-xl shadow-md text-center max-w-md border border-gray-200">
          <h2 className="text-2xl font-bold mb-3">Payment Update Failed</h2>
          <p className="text-base mb-4">
            Unfortunately, your eSewa payment update was not successful. Please
            try again or contact support.
          </p>
          <a
            href="/"
            className="px-5 py-2 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 transition-all"
          >
            Go Back Home
          </a>
        </div>
      </div>
    );
  }

  if (isSuccess && bookingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black py-8">
        <div className="bg-white p-6 rounded-xl shadow-md max-w-xl border border-gray-200 w-full">
          <div className="flex items-center justify-center mb-4">
            <img src="/src/assets/logo2.png" alt="Event Vertex Logo" className="h-8 mr-2" />
            <h1 className="text-2xl font-bold">Event Vertex</h1>
          </div>
          
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-1 text-center">Payment Successful!</h2>
          <p className="text-base mb-5 text-center text-gray-600">
            Your ticket has been confirmed
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-3 pb-1 border-b border-gray-200">Ticket Details</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Event ID:</span>
                  <span className="text-gray-600">{bookingData.eventId}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Ticket Type:</span>
                  <span className="text-gray-600">{bookingData.ticketType}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Quantity:</span>
                  <span className="text-gray-600">{bookingData.quantity}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Ticket Price:</span>
                  <span className="text-gray-600">Rs. {bookingData.ticketPrice}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Total Price:</span>
                  <span className="text-gray-600">Rs. {bookingData.totalPrice}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Transaction ID:</span>
                  <span className="text-gray-600 truncate max-w-[180px]">
                    {bookingData.paymentDetails?.transaction_code || "N/A"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex-none flex flex-col items-center justify-center">
              <TicketQRCode booking={bookingData} />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <a
              href="/"
              className="px-4 py-2 bg-white text-black font-semibold rounded-lg shadow-sm hover:bg-gray-100 transition-all border border-black text-center text-sm"
            >
              Return Home
            </a>
            
            {qrCodeDataURL ? (
              <PDFDownloadLink
                document={<TicketPDF booking={bookingData} qrCodeDataURL={qrCodeDataURL} />}
                fileName={`event-vertex-ticket-${bookingData._id}.pdf`}
                className="px-4 py-2 bg-black text-white font-semibold rounded-lg shadow-sm hover:bg-gray-800 transition-all flex items-center justify-center text-sm"
              >
                {({ loading }) =>
                  loading ? "Generating..." : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Ticket
                    </>
                  )
                }
              </PDFDownloadLink>
            ) : (
              <button
                onClick={downloadAsImage}
                className="px-4 py-2 bg-black text-white font-semibold rounded-lg shadow-sm hover:bg-gray-800 transition-all flex items-center justify-center text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Ticket
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PurchaseSuccess;
