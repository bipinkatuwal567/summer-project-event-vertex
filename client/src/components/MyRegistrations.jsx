import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";
import QRCode from "qrcode"; // Add this import for QRCode.toDataURL
import html2canvas from "html2canvas"; // Add this import for html2canvas

const MyRegistrations = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(bookings);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings/my");

      const data = await res.json();
      if (res.ok) {
        setBookings(data);
      } else {
        toast.error(data.message || "Failed to fetch your registrations.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // QR Code component for display in the UI
  const TicketQRCode = ({ booking }) => {
    const qrValue = JSON.stringify({
      eventId: booking.eventId._id,
      ticketType: booking.ticketType,
      quantity: booking.quantity,
      price: booking.ticketPrice,
      transactionId: booking.paymentDetails?.transaction_code || "N/A",
      bookingId: booking._id,
    });

    return (
      <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center">
        <QRCodeSVG value={qrValue} size={160} level="M" className="mb-2" />
        <p className="text-xs text-gray-600">Scan for verification</p>
      </div>
    );
  };

  const downloadAsImage = async (booking) => {
    console.log(booking);
    if (!booking) return;

    try {
      // Create a container for the ticket
      const ticketContainer = document.createElement("div");
      document.body.appendChild(ticketContainer); // Add to DOM temporarily for html2canvas
      ticketContainer.style.width = "500px";
      ticketContainer.style.padding = "20px";
      ticketContainer.style.backgroundColor = "white";
      ticketContainer.style.border = "1px solid black";
      ticketContainer.style.display = "flex";
      ticketContainer.style.flexDirection = "column"; // Changed to column to add footer properly

      // Create wrapper for content
      const contentWrapper = document.createElement("div");
      contentWrapper.style.display = "flex";
      contentWrapper.style.width = "100%";
      
      // Event details section
      const detailsSection = document.createElement("div");
      detailsSection.style.width = "65%";
      detailsSection.style.padding = "10px";

      // Logo and title
      const header = document.createElement("div");
      header.style.display = "flex";
      header.style.alignItems = "center";
      header.style.marginBottom = "15px";

      const logo = document.createElement("img");
      logo.src = "/src/assets/logo2.png";
      logo.style.width = "60px";
      logo.style.marginRight = "10px";

      const title = document.createElement("h2");
      title.textContent = "Event Vertex";
      title.style.margin = "0";
      title.style.fontSize = "18px";

      header.appendChild(logo);
      header.appendChild(title);
      detailsSection.appendChild(header);

      // Event details
      const details = [
        { label: "Ticket Type:", value: booking.ticketType },
        { label: "Quantity:", value: booking.quantity },
        { label: "Price per Ticket:", value: `Rs. ${booking.ticketPrice}` },
        { label: "Total Amount:", value: `Rs. ${booking.totalPrice}` },
        {
          label: "Transaction ID:",
          value: booking.paymentDetails?.transaction_code || "N/A",
        },
        {
          label: "Date:",
          value: new Date(booking.createdAt).toLocaleDateString(),
        },
        { label: "Booking ID:", value: booking._id },
      ];

      details.forEach((detail) => {
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.marginBottom = "8px";

        const label = document.createElement("span");
        label.textContent = detail.label;
        label.style.width = "40%";
        label.style.fontWeight = "bold";

        const value = document.createElement("span");
        value.textContent = detail.value;
        value.style.width = "60%";

        row.appendChild(label);
        row.appendChild(value);
        detailsSection.appendChild(row);
      });

      // Generate QR code data
      const qrData = JSON.stringify({
        eventId: booking.eventId._id,
        ticketType: booking.ticketType,
        quantity: booking.quantity,
        price: booking.ticketPrice,
        transactionId: booking.paymentDetails?.transaction_code || "N/A",
        bookingId: booking._id,
      });

      // Generate QR code data URL
      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        margin: 1,
        width: 120,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      
      // QR code section
      const qrSection = document.createElement("div");
      qrSection.style.width = "35%";
      qrSection.style.display = "flex";
      qrSection.style.flexDirection = "column";
      qrSection.style.alignItems = "center";
      qrSection.style.justifyContent = "center";
      qrSection.style.borderLeft = "1px solid black";
      qrSection.style.padding = "10px";

      const qrImg = document.createElement("img");
      qrImg.src = qrCodeDataURL;
      qrImg.style.width = "120px";
      qrImg.style.height = "120px";

      const qrText = document.createElement("p");
      qrText.textContent = "Scan for verification";
      qrText.style.fontSize = "12px";
      qrText.style.margin = "8px 0 0 0";

      qrSection.appendChild(qrImg);
      qrSection.appendChild(qrText);

      // Add sections to container
      contentWrapper.appendChild(detailsSection);
      contentWrapper.appendChild(qrSection);
      ticketContainer.appendChild(contentWrapper);

      // Add footer
      const footer = document.createElement("div");
      footer.style.width = "100%";
      footer.style.textAlign = "center";
      footer.style.borderTop = "1px solid #ddd";
      footer.style.marginTop = "15px";
      footer.style.paddingTop = "10px";
      footer.style.fontSize = "12px";
      footer.style.color = "#666";
      
      const footerText = document.createElement("p");
      footerText.textContent = "This ticket serves as proof of purchase. Please present at venue entrance.";
      footerText.style.margin = "4px 0";
      
      const copyrightText = document.createElement("p");
      copyrightText.textContent = "© Event Vertex 2025";
      copyrightText.style.margin = "4px 0";
      
      footer.appendChild(footerText);
      footer.appendChild(copyrightText);
      ticketContainer.appendChild(footer);

      // Convert to image using html2canvas
      const canvas = await html2canvas(ticketContainer);
      const imageURL = canvas.toDataURL("image/png");
      
      // Create download link
      const downloadLink = document.createElement("a");
      downloadLink.href = imageURL;
      downloadLink.download = `event-vertex-ticket-${booking._id}.png`; // Fixed: using booking._id instead of bookingData._id
      downloadLink.click();
      
      // Clean up - remove the temporary element
      document.body.removeChild(ticketContainer);
      
    } catch (error) {
      console.error("Error generating ticket image:", error);
      toast.error("Failed to download ticket. Please try again.");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <div className="text-center py-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">My Event Registrations</h2>

      {bookings.length === 0 ? (
        <p className="text-gray-500">
          You haven't registered for any events yet.
        </p>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-3 pb-1 border-b border-gray-200">
                  Ticket Details
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-start">
                    <span className="font-medium w-32">Event ID:</span>
                    <span className="text-gray-600">{booking.eventId._id}</span>
                  </div>
                  <div className="flex justify-start">
                    <span className="font-medium w-32">Event Title:</span>
                    <span className="text-gray-600">
                      {booking.eventId.title}
                    </span>
                  </div>
                  <div className="flex justify-start">
                    <span className="font-medium w-32">Event Location:</span>
                    <span className="text-gray-600">
                      {booking.eventId.location}
                    </span>
                  </div>
                  <div className="flex justify-start">
                    <span className="font-medium w-32">Event Date:</span>
                    <span className="text-gray-600">
                      {booking.eventId.date}
                    </span>
                  </div>
                  <div className="flex justify-start">
                    <span className="font-medium w-32">Event Status:</span>
                    <span className="text-gray-600">
                      {booking.eventId.status}
                    </span>
                  </div>

                  <div className="flex justify-start">
                    <span className="font-medium w-32">Ticket Type:</span>
                    <span className="text-gray-600">{booking.ticketType}</span>
                  </div>

                  <div className="flex justify-start">
                    <span className="font-medium w-32">Quantity:</span>
                    <span className="text-gray-600">{booking.quantity}</span>
                  </div>

                  <div className="flex justify-start">
                    <span className="font-medium w-32">Ticket Price:</span>
                    <span className="text-gray-600">
                      Rs. {booking.ticketPrice}
                    </span>
                  </div>

                  <div className="flex justify-start">
                    <span className="font-medium w-32">Total Price:</span>
                    <span className="text-gray-600">
                      Rs. {booking.totalPrice}
                    </span>
                  </div>

                  <div className="flex justify-start">
                    <span className="font-medium w-32">Transaction ID:</span>
                    <span className="text-gray-600 truncate max-w-[180px]">
                      {booking.paymentDetails?.transaction_code || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-none flex flex-col items-center justify-center">
                <TicketQRCode booking={booking} />
                <button
                  onClick={() => downloadAsImage(booking)}
                  className="px-4 py-2 mt-4 bg-black text-white font-semibold rounded-lg shadow-sm hover:bg-gray-800 transition-all flex items-center justify-center text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;