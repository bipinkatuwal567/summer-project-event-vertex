import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
const PurchaseSuccess = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [isError, setError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  console.log("payment")
  const esewaData = searchParams.get("data");
  console.log(esewaData)
  const savedTicket = localStorage.getItem("ticketinfo");
  const parsedTicket = JSON.parse(savedTicket);
  console.log(savedTicket)


  useEffect(()=>{
    const createTicket = async () => {
      console.log("running createTicket")
      try {
        const res = await fetch("/api/bookings/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId: parsedTicket.eventId,
            ticketType:parsedTicket.ticketType.type,
            quantity:parsedTicket.quantity,
            esewaData
          }),
        });
  
        const data = await res.json();
        if (res.ok) {
          toast.success("Successfully registered!");
          setLoading(false)
          setError(false)
          setIsSuccess(true)
        } else {
          console.log(data.message)
          setError(true)
          setIsSuccess(false)
          setLoading(false)
          // toast.error(data.message || "Something went wrong");
        }
      } catch (err) {
        console.error(err);
        setError(true)
        setLoading(false)
        setIsSuccess(false)
        // toast.error("Error registering for event");
      }
    }

    createTicket()
  },[esewaData, parsedTicket])
  if ( loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 text-yellow-700">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <h2 className="text-3xl font-bold mb-4">Processing Payment...</h2>
          <p className="text-lg mb-6">We are updating your payment status. Please wait a moment.</p>
          <div className="spinner-border" role="status"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-700">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <h2 className="text-3xl font-bold mb-4">Payment Update Failed</h2>
          <p className="text-lg mb-6">Unfortunately, your eSewa payment update was not successful. Please try again or contact support.</p>
          <a
            href="/"
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-xl shadow-md hover:bg-red-700 transition-all"
          >
            Go Back Home
          </a>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-green-700">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <h2 className="text-3xl font-bold mb-4">Payment Updated!</h2>
          <p className="text-lg mb-6">Payment updated for Order ID: #<strong>{parsedTicket?.eventId}</strong></p>
          <a
            href="/"
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-xl shadow-md hover:bg-green-700 transition-all"
          >
            Go Back Home
          </a>
        </div>
      </div>
    );
  }

  return null;
};

export default PurchaseSuccess;