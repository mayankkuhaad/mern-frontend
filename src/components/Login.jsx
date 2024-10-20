import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import { HashLoader } from "react-spinners";
import { serverUrl } from "../index";

const Login = () => {
  const navigate = useNavigate();

  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const { data } = await axios.post(`${serverUrl}/auth/login`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      localStorage.setItem('token', data.token); 


      if (data.success === false) {
        toast.error(data.message);
        setLoading(false);
        setError(data.message);
        return;
      }
      toast.success(data.message);
      setLoading(false);

            const userRole = data.user.role;
            if (userRole === 'admin') {
                navigate('/admin'); 
            } else {
                navigate('/dashboard'); 
            }

    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
      setError(error.response.data.message);

    }
  };

  return (
    <section className="px-5 lg:px-0">
      <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10">
        <h3 className="text-[22px] leading-9 font-bold mb-10 text-headingColor">
          Hello!
          <span className="text-primaryColor">Welcome</span>Back 🎉
        </h3>

        <form className="py-4 md:py-0" onSubmit={handleSubmit}>
          <div className="mb-5">
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Enter Your Email"
              onChange={handleInputChange}
              className="w-full px-4 py-3 mb-3 border-b border-solid border-[#0066ff61]
              focus:outline-none focus:border-b-primaryColor text-[16px] leading-7
              text-headingColor placeholder:text-textColor  cursor-pointer"
              required
            />
          </div>

          <div className="mb-5">
            <input
              type="password"
              name="password"
              value={formData.password}
              placeholder="Enter Your Password"
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-b border-solid border-[#0066ff61]
              focus:outline-none focus:border-b-primaryColor text-[16px] leading-7
              text-headingColor placeholder:text-textColor  cursor-pointer"
              required
            />
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full px-4 py-3 bg-primaryColor text-white text-[20px] leading-[30px] rounded-lg"
              disabled={loading}
            >
              {loading ? <HashLoader size={35} color="#ffffff" /> : "Sign In"}
            </button>
          </div>

          <p className="mt-5 text-center text-textColor">
            Don&apos;t have an Account?
            <Link to="/register" className="text-primaryColor font-medium ml-1">
              Sign Up
            </Link>
          </p>

          <p className="mt-5 text-center text-textColor">
            Forgot password?
            <Link to="/forgot-password" className="text-primaryColor font-medium ml-1">
              Click here
            </Link>
          </p>
          <p className="text-red-700">
            {error ? error || "Something went wrong!" : ""}
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;
