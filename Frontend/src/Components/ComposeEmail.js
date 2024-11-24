import React, { useState } from "react";
import { createEmail } from "./Api"; 
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dkwurpttz/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "mailupload";

const ComposeEmail = () => {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    media: "",
    receiver: "",
    sender: ""
  });
  const [file, setFile] = useState(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {user} = useUser();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const uploadFileToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw new Error("File upload failed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const emailData = {
      subject: formData.subject,
      message: formData.message,
      receiver: formData.receiver,
    };

    if (file) {
      try {
        const fileUrl = await uploadFileToCloudinary(file);
        emailData.media = fileUrl;
        setUploadedFileUrl(fileUrl);
      } catch (error) {
        alert("Failed to upload the file.");
        setLoading(false);
        return;
      }
    }

    try {
      emailData.sender = user.emailAddresses[0]?.emailAddress || ""
      const response = await createEmail(emailData);
      console.log(response);
      alert(response?.message || "Email sent successfully!");
      setLoading(false);
    } catch (error) {
      setError("Failed to send email.");
      setLoading(false);
      console.error("Error sending email:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 mt-[-40px]">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 mt-[-70px]">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">COMPOSE EMAIL</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Receiver Email
            </label>
            <input
              type="text"
              name="receiver"
              placeholder="Enter Email..."
              value={formData.receiver}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              placeholder="Enter Subject..."
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              name="message"
              placeholder="Write Message here..."
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
              rows="4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Media (File/Photo)
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full border-gray-300 rounded-lg p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          {uploadedFileUrl && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">Uploaded File:</p>
              <a
                href={uploadedFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View File
              </a>
            </div>
          )}
          {loading && (
            <div className="text-blue-600 text-sm">Sending email...</div>
          )}
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ComposeEmail;
