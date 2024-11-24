import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// import dotenv from "dotenv";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";

// dotenv.config();
const PUBLISHABLE_KEY = "pk_test_bG95YWwtbGl6YXJkLTI5LmNsZXJrLmFjY291bnRzLmRldiQ";



if (!PUBLISHABLE_KEY) {
  console.log(PUBLISHABLE_KEY);

  throw new Error("Missing Publishable Key");
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <App />
    </ClerkProvider>
  </React.StrictMode>
);
