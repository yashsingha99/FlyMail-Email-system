import Navbar from "./Components/Navbar/Navbar";
import { useAuth } from "@clerk/clerk-react";
function App() {
  const { isSignedIn } = useAuth();
  return (
    <>
      <Navbar />
    </>
  );
}

export default App;
