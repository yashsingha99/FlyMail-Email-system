import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { deleteEmail, getAllEmails } from "./Api";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
const Inbox = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const { user } = useUser();
  const currUerEmail =  user.emailAddresses[0]?.emailAddress;
  const [res, setRes]=useState("")
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        setLoading(true);
        const userData = user.emailAddresses[0]?.emailAddress || "";
        const result = await getAllEmails(userData);
        setEmails(result?.emails || []);
      } catch (err) {
        setError("Failed to load emails. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    user && fetchEmails();
  }, [user, res]);

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
  };

  const closeModal = () => {
    setSelectedEmail(null);
  };

  const handleDelete  = async(emailId) => {
     const data =  await deleteEmail(emailId);
     setRes(data)
      alert("successfully mail deleted")
  }

  return (
    <div className="w-full mx-auto p-6 bg-gray-100 h-screen">
      {loading ? (
        <p className="text-center text-gray-500">Loading emails...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : emails && emails.length > 0 ? (
        <div className="overflow-y-auto max-h-[600px] border rounded-lg bg-white shadow-sm p-4">
          <ul className="space-y-4">
            {emails.map((email) => (
              <div className="border flex justify-between ">
                <li
                  key={email._id}
                  onClick={() => handleEmailClick(email)}
                  className="p-4 w-[95%] bg-white rounded-lg  hover:bg-gray-50 transition duration-200 cursor-pointer"
                >
                  <h4 className="text-lg font-medium text-blue-600">{email.subject}</h4>
                  <p className="text-sm text-gray-500">From: {email.sender.name}</p>
                  
                </li>
                {currUerEmail === email.sender.email ? (
                  <span onClick={() => handleDelete(email._id)} className=" rounded-lg text-red-500 text-xl cursor-pointer  px-4 py-2"><DeleteForeverIcon/></span>
                  ) : ""}
              </div>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-center text-gray-500">No emails found.</p>
      )}

      {/*popup for detail of selected email*/}
      {selectedEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-8 relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-red-500 text-2xl font-bold focus:outline-none"
            >
              ×
            </button>
            <h4 className="text-xl font-semibold text-blue-600">
              {selectedEmail.subject}
            </h4>
            <p className="text-sm text-gray-500 mt-2">
              <span className="font-semibold">From:</span> {selectedEmail.sender.name} (
              {selectedEmail.sender.email})
            </p>
            <p className="text-sm text-gray-500 mt-1">
              <span className="font-semibold">To:</span> {selectedEmail.receiver?.email}
            </p>
            <div className="mt-4 p-4 bg-gray-100 rounded-lg text-gray-700">
              {selectedEmail?.message}
            </div>
            {selectedEmail.media && (
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-500">Attachment:</p>
                {selectedEmail.media.endsWith(".jpg") ||
                selectedEmail.media.endsWith(".png") ? (
                  <img
                    src={selectedEmail.media}
                    alt="Attachment"
                    className="w-full rounded-lg mt-2"
                  />
                ) : (
                  <a
                    href={selectedEmail.media}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline mt-2 block"
                  >
                    View Attachment
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Inbox;
