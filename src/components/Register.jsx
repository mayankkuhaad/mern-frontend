import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { serverUrl } from "../index";
import { HashLoader } from "react-spinners";
import React from "react";
import axios from "axios";
import signUpImage from "../assets/images/bike.jpg";
import toast from "react-hot-toast";
const SignUp = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // File input change handler
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedFile(file);

      const previewURL = URL.createObjectURL(file);
      setPreviewUrl(previewURL);
    }
  };

  const logFormData = (formData) => {
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
  };

  // Submit handler
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const submissionData = new FormData();
    submissionData.append("name", formData.name);
    submissionData.append("email", formData.email);
    submissionData.append("password", formData.password);

    if (selectedFile) {
      submissionData.append("photo", selectedFile);
    }

    logFormData(submissionData);

    try {
      const { data } = await axios.post(`${serverUrl}/auth/register`, submissionData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (!data.success) {
        setError(data.message);
        toast.error(data.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || "An error occurred");
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <section className="px-5 xl:px-0">
      <div className="max-w-[1170px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image Section */}
          <div className="hidden lg:block bg-primaryColor rounded-l-lg">
            <figure className="rounded-l-lg">
              <img
                src={signUpImage}
                alt="SignUpImg"
                className="w-full rounded-l-lg"
              />
            </figure>
          </div>

          {/* SignUp Form Section */}
          <div className="rounded-l-lg lg:pl-16 py-10">
            <h3 className="text-[22px] leading-9 font-bold mb-10 text-headingColor">
              Create an <span className="text-primaryColor">Account</span>
            </h3>

            <form onSubmit={submitHandler}>
              <div className="mb-5">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="w-full pr-4 py-3 mb-3 border-b border-solid border-[#0066ff61]
                  focus:outline-none focus:border-b-primaryColor text-[16px] leading-7
                  text-headingColor placeholder:text-textColor cursor-pointer"
                  required
                />
              </div>

              <div className="mb-5">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter Your Email"
                  className="w-full pr-4 py-3 mb-3 border-b border-solid border-[#0066ff61]
                  focus:outline-none focus:border-b-primaryColor text-[16px] leading-7
                  text-headingColor placeholder:text-textColor cursor-pointer"
                  required
                />
              </div>

              <div className="mb-5">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter Your Password"
                  className="w-full pr-4 py-3 mb-3 border-b border-solid border-[#0066ff61]
                  focus:outline-none focus:border-b-primaryColor text-[16px] leading-7
                  text-headingColor placeholder:text-textColor cursor-pointer"
                  required
                />
              </div>

              <div className="mb-5 flex items-center gap-3">
                {previewUrl && (
                  <div>

                  <figure className="w-[20rem] h-[20rem] border-2 border-solid border-primaryColor flex items-center justify-center">
                    <img
                      src={previewUrl}
                      alt="Avatar"
                      className="w-full h-full  object-fill"
                      />
                  </figure>
                    <p>Preview Image</p>
                      </div>
                )}

                <div className="relative w-[130px] h-[50px]">
                  <input
                    type="file"
                    name="photo"
                    id="customFile"
                    onChange={handleFileInputChange}
                    accept="image/*"
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <label
                    htmlFor="customFile"
                    className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem]
                    py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor
                    font-semibold rounded-lg truncate cursor-pointer"
                  >
                    Upload Photo
                  </label>
                </div>
              </div>

              <div className="mt-8">
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full px-4 py-3 bg-primaryColor text-white text-[20px] leading-[30px] rounded-lg"
                >
                  {loading ? <HashLoader size={35} color="#ffffff" /> : "Sign Up"}
                </button>
              </div>

              <p className="mt-5 text-center text-textColor">
                Already have an Account?
                <Link to="/login" className="text-primaryColor font-medium ml-1">
                  Login
                </Link>
              </p>
              <p className="mt-5 text-center text-textColor">
                {error ? error : ""}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;