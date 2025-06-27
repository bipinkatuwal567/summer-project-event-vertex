import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import { Calendar, MapPin, Tag, Download, Ticket, Clock, CreditCard, User } from "lucide-react";

const MyRegistrations = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
        <div className="mb-2 p-2 bg-white rounded-md">
          <QRCodeSVG
            value={qrValue}
            size={160}
            level="M"
            className="mb-2"
            bgColor="#FFFFFF"
            fgColor="#000000"
            includeMargin={true}
          />
        </div>
        <p className="text-xs text-gray-600 font-medium">Scan for verification</p>
        <p className="text-xs text-gray-500 mt-1">ID: {booking._id.substring(0, 8)}...</p>
      </div>
    );
  };

  const downloadAsImage = async (booking) => {
    if (!booking) return;

    try {
      toast.loading("Generating ticket...");

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
      downloadLink.download = `event-vertex-ticket-${booking._id}.png`;
      downloadLink.click();

      // Clean up - remove the temporary element
      document.body.removeChild(ticketContainer);
      toast.dismiss();
      toast.success("Ticket downloaded successfully");

    } catch (error) {
      console.error("Error generating ticket image:", error);
      toast.dismiss();
      toast.error("Failed to download ticket. Please try again.");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500">Loading your registrations...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Toaster position="bottom-right" />

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm px-6 pb-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-3 rounded-xl">
            <Ticket size={24} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 font-marcellus">My Event Registrations</h2>
            <p className="text-gray-500 mt-1">View and manage your event tickets</p>
          </div>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white mt-6 rounded-2xl shadow-sm p-10 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="bg-indigo-50 p-4 rounded-full mb-4">
              <Calendar size={32} className="text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Registrations Found</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              You haven't registered for any events yet. Browse events to find something you'd like to attend.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white mt-6 rounded-2xl shadow-sm overflow-hidden">
              {/* Event Header */}
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-800">{booking.eventId.title}</h3>
                <div className="flex flex-wrap gap-3 mt-2">
                  <div className="flex items-center text-gray-600 text-sm">
                    <Calendar size={14} className="mr-1 text-indigo-600" />
                    {new Date(booking.eventId.date).toString()}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin size={14} className="mr-1 text-indigo-600" />
                    {booking.eventId.location}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Tag size={14} className="mr-1 text-indigo-600" />
                    {booking.eventId.category}
                  </div>
                </div>
              </div>

              {/* Ticket Content */}
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Ticket Details */}
                  <div className="flex-1 space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-100 flex items-center">
                      <Ticket size={18} className="mr-2 text-indigo-600" />
                      Ticket Details
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Ticket Type</p>
                        <p className="font-medium">{booking.ticketType}</p>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Quantity</p>
                        <p className="font-medium">{booking.quantity}</p>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Price per Ticket</p>
                        <p className="font-medium">Rs. {booking.ticketPrice}</p>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Total Price</p>
                        <p className="font-medium">Rs. {booking.totalPrice}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mt-2">
                      <div className="flex items-start">
                        <CreditCard size={16} className="mr-2 text-indigo-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Transaction ID</p>
                          <p className="font-medium text-sm truncate max-w-[250px]">
                            {booking.paymentDetails?.transaction_code || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Clock size={16} className="mr-2 text-indigo-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Booking Date</p>
                          <p className="font-medium text-sm">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <User size={16} className="mr-2 text-indigo-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Event Status</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${booking.eventId.status === "canceled"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                            }`}>
                            {booking.eventId.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="flex flex-col items-center">
                    <TicketQRCode booking={booking} />
                    <button
                      onClick={() => downloadAsImage(booking)}
                      className="px-4 py-2 mt-4 bg-primary-blue text-white font-semibold rounded-lg shadow-sm hover:bg-hover-blue transition-all flex items-center justify-center text-sm"
                    >
                      <Download size={16} className="mr-2" />
                      Download Ticket
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;
