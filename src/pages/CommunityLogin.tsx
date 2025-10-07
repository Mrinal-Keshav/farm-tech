import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function CommunityLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const navigate = useNavigate();

  const messages = [
    "Hello Farmers!",
    "Login here to join the community",
    "Grow together, succeed together 🌱",
    "Welcome to the farm family 👨‍🌾",
  ];

  useEffect(() => {
    let typingInterval: NodeJS.Timeout;

    if (charIndex < messages[messageIndex].length) {
      typingInterval = setInterval(() => {
        setDisplayText((prev) => prev + messages[messageIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 100); // typing speed (100ms per character)
    } else {
      // wait 2s before moving to the next message
      setTimeout(() => {
        setDisplayText("");
        setCharIndex(0);
        setMessageIndex((prev) => (prev + 1) % messages.length);
      }, 2000);
    }

    return () => clearInterval(typingInterval);
  }, [charIndex, messageIndex]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/community");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      // For demo purposes, create a mock user if backend is not running
      const mockUser = { 
        email, 
        displayName: email.split('@')[0],
        avatar: "/avatar.svg",
        location: "Demo Farm",
        bio: "Demo farmer using FarmTech"
      };
      localStorage.setItem("user", JSON.stringify(mockUser));
      navigate("/community");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/community");
      } else {
        alert("Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      // For demo purposes, create a mock user if backend is not running
      const mockUser = { 
        email, 
        displayName: email.split('@')[0],
        avatar: "/avatar.svg",
        location: "Demo Farm",
        bio: "Demo farmer using FarmTech"
      };
      localStorage.setItem("user", JSON.stringify(mockUser));
      navigate("/community");
    }
  };

  const handleDemoLogin = (demoEmail: string) => {
    const demoUsers = {
      "priya@farmtech.com": {
        email: "priya@farmtech.com",
        displayName: "Priya Sharma",
        avatar: "/avatar.svg",
        location: "Punjab, India",
        bio: "Tomato specialist with 10 years experience"
      },
      "rajesh@farmtech.com": {
        email: "rajesh@farmtech.com",
        displayName: "Rajesh Kumar",
        avatar: "/avatar.svg",
        location: "Haryana, India",
        bio: "Corn and bean farmer, expert in companion planting"
      },
      "anita@farmtech.com": {
        email: "anita@farmtech.com",
        displayName: "Anita Patel",
        avatar: "/avatar.svg",
        location: "Gujarat, India",
        bio: "Wheat farmer, weather analysis enthusiast"
      },
      "deepak@farmtech.com": {
        email: "deepak@farmtech.com",
        displayName: "Deepak Singh",
        avatar: "/avatar.svg",
        location: "Uttar Pradesh, India",
        bio: "Soil health expert, organic farming advocate"
      },
      "sunita@farmtech.com": {
        email: "sunita@farmtech.com",
        displayName: "Sunita Reddy",
        avatar: "/avatar.svg",
        location: "Andhra Pradesh, India",
        bio: "Sustainability champion, FarmSphere game expert"
      }
    };

    const demoUser = demoUsers[demoEmail as keyof typeof demoUsers];
    if (demoUser) {
      localStorage.setItem("user", JSON.stringify(demoUser));
      navigate("/community");
    }
  };

  return (
    <div className="login-page">
      {/* Left typing message */}
      <div className="login-left">
        <h2 className="typing-text">
          {displayText}
          <span className="cursor">|</span>
        </h2>
      </div>

      {/* Right login box */}
      <div className="login-right">
        <div className="login-box">
          <h2>Farm Community Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
            <button 
              type="button" 
              onClick={handleRegister}
              style={{ 
                background: '#6b7280', 
                marginTop: '0.5rem' 
              }}
            >
              Register
            </button>
          </form>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
            Demo: Use any email/password to login
          </p>
          
          {/* Demo Users */}
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#166534' }}>Demo Users:</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button 
                type="button" 
                onClick={() => handleDemoLogin('priya@farmtech.com')}
                style={{ 
                  background: '#f3f4f6', 
                  border: '1px solid #d1d5db',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                👩‍🌾 Priya Sharma (Tomato Expert)
              </button>
              <button 
                type="button" 
                onClick={() => handleDemoLogin('rajesh@farmtech.com')}
                style={{ 
                  background: '#f3f4f6', 
                  border: '1px solid #d1d5db',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                👨‍🌾 Rajesh Kumar (Corn & Beans)
              </button>
              <button 
                type="button" 
                onClick={() => handleDemoLogin('anita@farmtech.com')}
                style={{ 
                  background: '#f3f4f6', 
                  border: '1px solid #d1d5db',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                👩‍🌾 Anita Patel (Wheat Farmer)
              </button>
              <button 
                type="button" 
                onClick={() => handleDemoLogin('deepak@farmtech.com')}
                style={{ 
                  background: '#f3f4f6', 
                  border: '1px solid #d1d5db',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                👨‍🌾 Deepak Singh (Soil Expert)
              </button>
              <button 
                type="button" 
                onClick={() => handleDemoLogin('sunita@farmtech.com')}
                style={{ 
                  background: '#f3f4f6', 
                  border: '1px solid #d1d5db',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                👩‍🌾 Sunita Reddy (Sustainability)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
