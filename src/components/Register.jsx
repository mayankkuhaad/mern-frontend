import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { serverUrl } from "../index";
import { HashLoader } from "react-spinners";
import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

const SignUp = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [signUpImage, setSignUpImage] = useState(
    'https://res.cloudinary.com/dckw1lzpk/image/upload/v1729373389/user_photos/iidhxx834fge6lafkjlr.jpg'
  );

  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const previewURL = URL.createObjectURL(file);
      setPreviewUrl(previewURL);
    }
  };

  const onSubmit = async (formData) => {
    setLoading(true);

    const submissionData = new FormData();
    submissionData.append("name", formData.name);
    submissionData.append("email", formData.email);
    submissionData.append("password", formData.password);

    if (selectedFile) {
      submissionData.append("photo", selectedFile);
    }

    try {
      const { data } = await axios.post(`${serverUrl}/auth/register`, submissionData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (!data.success) {
        toast.error(data.message);
        setLoading(false);
        return;
      }

      toast.success(data.message);
      setLoading(false);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <section className="px-5 xl:px-0">
      <div className="max-w-[1170px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="hidden lg:block rounded-l-lg">
            <figure className="rounded-l-lg">
              <img
                src={signUpImage}
                alt="SignUpImg"
                className="w-full rounded-l-lg"
              />
            </figure>
          </div>

          <div className="rounded-l-lg lg:pl-16 py-10">
            <h3 className="text-[22px] leading-9 font-bold mb-10 text-headingColor">
              Create an <span className="text-primaryColor">Account</span>
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
              <div className="mb-5">
                <input
                  type="text"
                  placeholder="Full Name"
                  {...register('name', {
                    required: 'Name is required',
                  })}
                  className="w-full pr-4 py-3 mb-3 border-b border-solid border-[#0066ff61]
                  focus:outline-none focus:border-b-primaryColor text-[16px] leading-7
                  text-headingColor placeholder:text-textColor cursor-pointer"
                />
                {errors.name && <p className="text-red-700">{errors.name.message}</p>}
              </div>

              {/* Email Field */}
              <div className="mb-5">
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                      message: 'Enter a valid email',
                    },
                  })}
                  className="w-full pr-4 py-3 mb-3 border-b border-solid border-[#0066ff61]
                  focus:outline-none focus:border-b-primaryColor text-[16px] leading-7
                  text-headingColor placeholder:text-textColor cursor-pointer"
                />
                {errors.email && <p className="text-red-700">{errors.email.message}</p>}
              </div>

              <div className="mb-5">
                <input
                  type="password"
                  placeholder="Enter Your Password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className="w-full pr-4 py-3 mb-3 border-b border-solid border-[#0066ff61]
                  focus:outline-none focus:border-b-primaryColor text-[16px] leading-7
                  text-headingColor placeholder:text-textColor cursor-pointer"
                />
                {errors.password && <p className="text-red-700">{errors.password.message}</p>}
              </div>

              <div className="mb-5">
                {previewUrl && (
                  <div className="mb-3">
                    <figure className="w-[20rem] h-[20rem] border-2 border-solid border-primaryColor flex items-center justify-center">
                      <img
                        src={previewUrl}
                        alt="Avatar Preview"
                        className="w-full h-full object-fill"
                      />
                    </figure>
                    <p className="mt-2">Preview Image</p>
                  </div>
                )}

                <div className="relative w-full">
                  <input
                    type="file"
                    id="fileUpload"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="opacity-0 absolute z-10 cursor-pointer w-full h-full"
                    style={{ height: '50px' }}
                  />
                  <label
                    htmlFor="fileUpload"
                    className="w-full h-[50px] flex items-center justify-center bg-[#0066ff46] text-headingColor font-semibold rounded-lg cursor-pointer"
                  >
                    {selectedFile ? "Change Photo" : "Upload Photo"}
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
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
