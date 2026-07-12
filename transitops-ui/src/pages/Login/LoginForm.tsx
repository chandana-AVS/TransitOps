import { useState } from "react";
import "./LoginForm.css";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight
} from "lucide-react";


export default function LoginForm() {

  const [showPassword,setShowPassword] = useState(false);


  return (

    <div className="login-card">


      <div className="login-header">

        <div className="logo">
          TO
        </div>


        <h2>
          Welcome Back
        </h2>


        <p>
          Sign in to access your TransitOps dashboard
        </p>


      </div>



      <form>


        {/* Email */}

        <div className="input-box">


          <Mail size={20}/>


          <input
            type="email"
            placeholder=" "
            required
          />


          <label>
            Email Address
          </label>


        </div>




        {/* Password */}

        <div className="input-box">


          <Lock size={20}/>


          <input
            type={
              showPassword
              ? "text"
              : "password"
            }
            placeholder=" "
            required
          />


          <label>
            Password
          </label>



          <button
            type="button"
            className="eye-btn"
            onClick={() =>
              setShowPassword(!showPassword)
            }
          >

            {
              showPassword
              ?
              <EyeOff size={20}/>
              :
              <Eye size={20}/>
            }


          </button>


        </div>




        {/* Options */}

        <div className="login-options">


          <label className="remember">

            <input type="checkbox"/>

            <span>
              Remember me
            </span>

          </label>


          <a href="#">
            Forgot password?
          </a>


        </div>




        {/* Login Button */}


        <button
          className="login-btn"
          type="submit"
        >

          Sign In

          <ArrowRight size={20}/>


        </button>




      </form>



      <div className="divider">

        <span>
          OR
        </span>

      </div>



      <button className="sso-btn">

        Continue with Enterprise SSO

      </button>




      <p className="signup-text">

        Don't have an account?

        <a href="#">
          Request Access
        </a>


      </p>



    </div>

  );

}