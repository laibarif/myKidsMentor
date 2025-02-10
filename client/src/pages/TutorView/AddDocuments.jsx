import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL_IMAGE = import.meta.env.VITE_MY_KIDS_MENTOR_IMAGE_URL;

const AddDocuments = () => {
  const [certificates, setCertificates] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);
  const tutor = useSelector((state) => state.auth.user);
  const tutorId = tutor?.id;

  // Fetch existing certificates on mount
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/tutor/getCertificates/${tutorId}`
        );
        setCertificates(response.data.certifications || []);
      } catch (err) {
        console.error("Error fetching certificates:", err);
        setError("Failed to load certificates.");
        toast.error("Failed to load certificates.");
      }
    };

    if (tutorId) fetchCertificates();
  }, [tutorId]);

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError("");
    setSuccess("");
  };

  // Handle certificate upload
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Please select a file to upload.");
      toast.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("certifications", selectedFile);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/tutor/addcertificate/${tutorId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setCertificates(response.data.certifications);
      setSuccess("Certificate uploaded successfully!");
      toast.success("Certificate uploaded successfully!");
      setError("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Error uploading certificate:", err);
      setError("Failed to upload certificate.");
      toast.error("Failed to upload certificate.");
      setSuccess("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle certificate deletion
  const handleDelete = async (certificate) => {
    if (!window.confirm("Are you sure you want to delete this certificate?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/tutor/deleteCertificate/${tutorId}`,
        { data: { certificate } }
      );
      setCertificates(response.data.certifications);
      setSuccess("Certificate deleted successfully!");
      toast.success("Certificate deleted successfully!");
      setError("");
    } catch (err) {
      console.error("Error deleting certificate:", err);
      setError("Failed to delete certificate.");
      toast.error("Failed to delete certificate.");
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-teal-100 to-green-200 py-10 px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8 transition-all">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 drop-shadow-lg">
          Tutor Certificates
        </h1>

        {/* Upload Certificate Form */}
        <form onSubmit={handleUpload} className="mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="w-full sm:w-auto block text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:from-teal-500 hover:to-blue-500 transition transform hover:scale-105"
            >
              Upload
            </button>
          </div>
        </form>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        {/* List of Certificates */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Uploaded Certificates</h2>
        {certificates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {certificates.map((certificate, index) => {
              const fileUrl = `${BASE_URL_IMAGE}uploads/${certificate}`;
              return (
                <div
                  key={index}
                  className="relative group bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:shadow-xl transition duration-300"
                >
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(certificate)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    title="Delete"
                  >
                    <FaTrash className="w-5 h-5" />
                  </button>

                  {/* Certificate Preview wrapped in an anchor to open in new tab */}
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="transition transform hover:scale-105"
                  >
                    {/\.(jpg|jpeg|png|gif)$/i.test(certificate) ? (
                      <img
                        src={fileUrl}
                        alt={certificate}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-32 h-32 bg-gray-200 rounded-lg">
                        <p className="text-sm text-gray-700">View Document</p>
                      </div>
                    )}
                  </a>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500">No certificates uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default AddDocuments;