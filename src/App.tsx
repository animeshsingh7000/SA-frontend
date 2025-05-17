import React, { useState, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./scss/custom.scss";
import { RouterProvider } from "react-router-dom";
import Container from "react-bootstrap/Container";
import { Suspense } from "react";
import { router } from "./routes";
import { AuthProvider } from "./hooks/useAuth";
import { MessageModalProvider } from "./contexts/MessageModalProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./utils/queryClient";
import { ChatWidget } from "./components";

function App() {
  const [showChat, setShowChat] = useState(false);
  const [btnPressed, setBtnPressed] = useState(false);

  useEffect(() => {
    // Remove any HubSpot widget remnants from the DOM
    const removeHubSpot = () => {
      const hubspotContainer = document.getElementById('hubspot-messages-iframe-container');
      if (hubspotContainer) hubspotContainer.remove();
      // Remove any iframes with src containing 'hs-scripts.com' or 'hubspot'
      document.querySelectorAll('iframe').forEach(iframe => {
        if (iframe.src.includes('hubspot') || iframe.src.includes('hs-scripts.com')) {
          iframe.remove();
        }
      });
    };
    removeHubSpot();
    // Also run on route changes if needed (optional)
    // window.addEventListener('hashchange', removeHubSpot);
    // return () => window.removeEventListener('hashchange', removeHubSpot);
  }, []);

  // useEffect(() => {
  //   const script = document.createElement('script');
  //   script.src = "//js.hs-scripts.com/5188164.js";
  //   script.async = true;
  //   document.body.appendChild(script);
  //   return () => {
  //     document.body.removeChild(script);
  //   }
  // }, []);

  const handleChatBtnClick = () => {
    setBtnPressed(true);
    setTimeout(() => setBtnPressed(false), 150);
    setShowChat((prev) => !prev);
  };

  return (
    <MessageModalProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <Container fluid>
              <Suspense fallback={"Loading"}>
                <RouterProvider router={router} />
              </Suspense>
            </Container>
            <ToastContainer position="top-center"/>
            <style>
              {`
                .floating-chat-btn {
                  box-shadow: 0 0 32px 12px rgba(100, 200, 255, 0.5) !important;
                  background: transparent !important;
                  color: inherit !important;
                  border: none !important;
                  outline: none !important;
                  padding: 0 !important;
                  transition: transform 0.3s cubic-bezier(0.4, 0.2, 0.2, 1), box-shadow 0.3s;
                }
                .floating-chat-btn:hover {
                  transform: scale(1.15);
                }
              `}
            </style>
            <button
              className="floating-chat-btn"
              aria-label={showChat ? "Close chat" : "Open chat"}
              style={{
                position: 'fixed',
                bottom: 32,
                right: 32,
                zIndex: 1100,
                width: 60,
                height: 60,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                overflow: 'hidden',
              }}
              onClick={handleChatBtnClick}
            >
              <img
                src="/output-onlinegiftools.gif"
                alt="Chat Icon"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  pointerEvents: 'none',
                  display: 'block',
                  border: 'none',
                  outline: 'none',
                }}
                aria-hidden="true"
              />
            </button>
            {/* Chat Widget Overlay */}
            {showChat && (
              <div style={{
                position: 'fixed',
                right: 24,
                bottom: 100 + 24, // 100px for button + 24px gap
                zIndex: 1200,
                maxHeight: '60vh',
                height: '500px',
                width: '370px',
                maxWidth: '95vw',
                boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                borderRadius: '20px',
                overflow: 'hidden',
                background: 'white',
                display: 'flex',
                flexDirection: 'column',
                marginTop: '10vh', // margin from top
                paddingBottom: '16px', // extra space at bottom inside widget
              }}>
                <ChatWidget onClose={() => setShowChat(false)} />
              </div>
            )}
        </AuthProvider>
      </QueryClientProvider>
    </MessageModalProvider>
  );
}

export default App;
