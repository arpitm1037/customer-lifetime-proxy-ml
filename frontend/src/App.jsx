import { useCallback, useState } from "react";
import Landing from "./pages/Landing";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UploadPage from "./pages/UploadPage";
import LoadingPage from "./pages/LoadingPage";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import BlueprintPage from "./pages/BlueprintPage";

function App() {
  const [screen, setScreen] = useState("landing");

  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [cohortData, setCohortData] = useState([]);
  const [pendingFile, setPendingFile] = useState(null);

  const [aboutReturn, setAboutReturn] = useState("landing");

  const openAbout = useCallback((returnScreen) => {
    setAboutReturn(returnScreen);
    setScreen("about");
  }, []);


  const handleUploadContinue = (file) => {
    setPendingFile(file);
    setScreen("processing");
  };


  const handleProcessingComplete = useCallback((payload) => {
    setData(payload.data);
    setChartData(payload.chartData);
    setCohortData(payload.cohortData);
    setPendingFile(null);
    setScreen("dashboard");
  }, []);

  const handleProcessingExit = useCallback(() => {
    setPendingFile(null);
    setScreen("upload");
  }, []);

  const handleProcessingAbout = useCallback(() => {
    setPendingFile(null);
    setAboutReturn("upload");
    setScreen("about");
  }, []);



  if (screen === "landing") {
    return (
      <Landing
        goNext={() => setScreen("login")}
        goAbout={() => openAbout("landing")}
      />
    );
  }

  if (screen === "login") {
    return (
      <LoginPage
        onLoginSuccess={() => setScreen("blueprint")}
        goSignup={() => setScreen("signup")}
        goBack={() => setScreen("landing")}
      />
    );
  }

  if (screen === "signup") {
    return (
      <SignupPage
        onSignupSuccess={() => setScreen("login")}
        goLogin={() => setScreen("login")}
        goBack={() => setScreen("login")}
      />
    );
  }

  if (screen === "upload") {
    return (
      <UploadPage
        onDone={handleUploadContinue}
        goBack={() => setScreen("landing")}
        goAbout={() => openAbout("upload")}
      />
    );
  }

  if (screen === "processing") {
    if (!pendingFile) {
      return (
        <UploadPage
          onDone={handleUploadContinue}
          goBack={() => setScreen("landing")}
          goAbout={() => openAbout("upload")}
        />
      );
    }

    return (
      <LoadingPage
        file={pendingFile}
        onComplete={handleProcessingComplete}
        onError={handleProcessingExit}
        onBack={handleProcessingExit}
        goAbout={handleProcessingAbout}
      />
    );
  }

  if (screen === "about") {
    return <About goBack={() => setScreen(aboutReturn)} />;
  }

  if (screen === "blueprint") {
    return (
      <BlueprintPage
        goBack={() => setScreen("landing")}
        goUpload={() => setScreen("upload")}
        goAbout={() => openAbout("blueprint")}
      />
    );
  }


  return (
    <Dashboard
      data={data}
      chartData={chartData}
      cohortData={cohortData}
      goBack={() => setScreen("upload")}
      goAbout={() => openAbout("dashboard")}
    />
  );
}

export default App;