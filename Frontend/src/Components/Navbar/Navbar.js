import React, { useEffect, useState } from "react";
import { Menu, X, Mail } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
  useAuth,
} from "@clerk/clerk-react";
import axios from "axios";
import Cookies from "js-cookie";
import ComposeEmail from "../ComposeEmail";
import EmailDetails from "../EmailDetails";
import Inbox from "../Inbox";
import EastIcon from "@mui/icons-material/East";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [view, setView] = useState("inbox");

  const VIEWS = {
    INBOX: "inbox",
    COMPOSE: "compose",
    DETAILS: "details",
  };

  const handleAuth = async () => {
    if (!user) return;

    const data = {
      email: user.emailAddresses[0]?.emailAddress || "",
      name: user.fullName || "",
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/createOrLogin",
        data
      );
      console.log("Auth Response:", response.data);

      Cookies.remove("ready");
    } catch (error) {
      console.error("Error during authentication:", error.message);
    }
  };

  useEffect(() => {
    const check = Cookies.get("ready");
    if (user && check === "true") {
      handleAuth();
    }
  }, [user]);

  const handleSignIn = () => {
    if (!isSignedIn) Cookies.set("ready", "true");
  };

  const renderView = () => {
    if (view === VIEWS.COMPOSE) return isSignedIn && <ComposeEmail />;
    if (view === VIEWS.INBOX) return isSignedIn && <Inbox userId={user?.id} />;
    if (view === VIEWS.DETAILS)
      return isSignedIn && <EmailDetails email={selectedEmail} />;
  };

  return (
    <header className="bg-white  fixed w-full">
      <div className="mx-auto ">
        <div className="flex justify-between items-center shadow-md w-full py-4 px-4">
          <div className="flex items-center">
            <Mail className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">
              FlyMail
            </span>
          </div>

          {isSignedIn && (
            <nav className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setView(VIEWS.INBOX)}
                className={`px-4 py-2 rounded font-bold ${
                  view === VIEWS.INBOX
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                INBOX
              </button>
              <button
                onClick={() => setView(VIEWS.COMPOSE)}
                className={`px-4 py-2 rounded font-bold ${
                  view === VIEWS.COMPOSE
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                COMPOSE
              </button>
            </nav>
          )}
          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn ? (
              <SignedIn>
                <UserButton />
              </SignedIn>
            ) : (
              <SignedOut>
                <SignInButton>
                  <button
                    onClick={handleSignIn}
                    className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center p-2 rounded-md"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1">
            <button
              onClick={() => {
                setView(VIEWS.INBOX);
                setIsMenuOpen(false);
              }}
              className="block px-3 py-2 text-gray-700 hover:text-blue-600"
            >
              Inbox
            </button>
            <button
              onClick={() => {
                setView(VIEWS.COMPOSE);
                setIsMenuOpen(false);
              }}
              className="block px-3 py-2 text-gray-700 hover:text-blue-600"
            >
              Compose
            </button>
          </div>
        </div>
      )}

      <div className="mt-4">{renderView()}</div>
      {!isSignedIn && (
        <div className="flex h-full flex-col gap-40 items-center content-between  w-full mt-20 ">
          <div className="w-full h-5/6 max-w-4xl">
            <div className="flex flex-col justify-center items-center gap-6 text-center">
              <h1 className=" dark:text-cyan-900 text-white text-4xl sm:text-4xl lg:text-5xl font-extrabold">
                The Power of Seamless Sharing
                <div className="text-cyan-900 text-2xl sm:text-3xl font-bold mt-2">
                  One Platform, Infinite Sharing
                </div>
              </h1>
              <p className="text-blue-400 text-xl sm:text-2xl lg:text-3xl font-medium">
                All your mails, ready when you are
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl font-medium">
                Share with Ease, Anywhere! Effortless Mail Transfers Your Mail,
                Just a Click Away Fast. Secure. Reliable. Simplify Your Mail
                Sharing, Send Large Files in Seconds, Share Smarter, Not Harder
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <SignedOut>
                  <SignInButton>
                    <button
                      onClick={handleSignIn}
                      className="bg-cyan-700 text-white gap-2 font-medium py-3 px-6 flex items-center btn-border rounded transition"
                    >
                      <p>Quick Share</p>
                      <EastIcon />
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <button className="bg-cyan-700 text-white gap-2 font-medium py-3 px-6 flex items-center btn-border rounded  transition">
                    <p>Quick Share</p>
                    <EastIcon />
                  </button>
                </SignedIn>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
