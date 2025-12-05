import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

const SignUp = () => {
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Verify OTP & Complete Signup
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSendOTP = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8000/signupopt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('OTP sent to your email! Please check your inbox.');
        setStep(2);
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        email: formData.email,
        username: formData.username,
        first_name: formData.firstName,
        last_name: formData.lastName,
        password: formData.password,
        hashed_password: formData.password,
        otp: parseInt(formData.otp)
      };
      
      console.log('Sending payload:', payload);
      
      const response = await fetch('http://localhost:8000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Account created successfully!');
        // Store token if needed
        if (data.user?.token) {
          localStorage.setItem('token', data.user.token);
        }
        // Redirect to login or home page after 2 seconds
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setError(data.error || 'Failed to create account');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">Sign Up</h2>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              {step === 1 ? (
                <div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button 
                    onClick={handleSendOTP}
                    className="btn btn-primary w-100"
                    disabled={loading || !formData.email || !formData.username}
                  >
                    {loading ? 'Sending...' : 'Send OTP'}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="otp" className="form-label">OTP (Check your email)</label>
                    <input
                      type="text"
                      className="form-control"
                      id="otp"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      placeholder="Enter 4-digit OTP"
                      required
                    />
                  </div>

                  <button 
                    onClick={handleSignUp}
                    className="btn btn-success w-100"
                    disabled={loading || !formData.firstName || !formData.lastName || !formData.password || !formData.otp}
                  >
                    {loading ? 'Creating Account...' : 'Complete Sign Up'}
                  </button>

                  <button
                    onClick={() => setStep(1)}
                    className="btn btn-link w-100 mt-2"
                  >
                    Back to Email Verification
                  </button>
                </div>
              )}

              <div className="text-center mt-3">
                <p>Already have an account? <a href="/login">Login</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;