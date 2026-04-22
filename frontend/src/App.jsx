import { useCallback, useState } from "react";
import Landing from "./pages/Landing";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UploadPage from "./pages/UploadPage";
import LoadingPage from "./pages/LoadingPage";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import BlueprintPage from "./pages/BlueprintPage";
import HistoryPage from "./pages/HistoryPage";
import { getHistory } from "./api/api";

function App() {
  const [screen, setScreen] = useState("landing");

  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [cohortData, setCohortData] = useState([]);
  const [pendingFile, setPendingFile] = useState(null);

  const [aboutReturn, setAboutReturn] = useState("landing");
  const [currentUser, setCurrentUser] = useState(null);
  const [showHistoryPopup, setShowHistoryPopup] = useState(false);
  const [dashboardBackScreen, setDashboardBackScreen] = useState("upload");

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
    setDashboardBackScreen("upload");
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

  const handleLoginSuccess = async (user) => {
    setCurrentUser(user);
    try {
      const res = await getHistory(user.email);
      if (res.data && res.data.length > 0) {
        setShowHistoryPopup(true);
      } else {
        setScreen("blueprint");
      }
    } catch (e) {
      setScreen("blueprint");
    }
  };

  if (showHistoryPopup) {
    return (
      <div className="page-first" style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
        <div
          className="auth-card"
          style={{
            padding: "34px 32px",
            backgroundColor: "#fff",
            borderRadius: "14px",
            textAlign: "center",
            boxShadow: "0 16px 46px rgba(0,0,0,0.12)",
            maxWidth: "460px",
            width: "100%",
            border: "1px solid #e7e7e7",
          }}
        >
          <h2 style={{ fontSize: "1.8rem", marginBottom: "12px", color: "#111" }}>Welcome Back</h2>
          <p style={{ color: "#666", marginBottom: "24px", lineHeight: "1.6" }}>
            Do you want to continue with previous analysis or upload new data?
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button className="auth-btn" onClick={() => { setShowHistoryPopup(false); setScreen("history"); }}>
              View History
            </button>
            <button className="auth-btn" style={{ backgroundColor: "#f0f0f0", color: "#333", border: "1px solid #d8d8d8" }} onClick={() => { setShowHistoryPopup(false); setScreen("blueprint"); }}>
              Upload New Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "login") {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
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
        currentUser={currentUser}
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

  if (screen === "history") {
    return (
      <HistoryPage
        currentUser={currentUser}
        goBack={() => setScreen("landing")}
        goUpload={() => setScreen("upload")}
        onDataLoaded={(historyPayload) => {
          setData(historyPayload.data || []);
          setChartData(historyPayload.chartData || []);
          setCohortData(historyPayload.cohortData || []);
          setDashboardBackScreen("history");
          setScreen("dashboard");
        }}
      />
    );
  }


  return (
    <Dashboard
      data={data}
      chartData={chartData}
      cohortData={cohortData}
      goBack={() => setScreen(dashboardBackScreen)}
      goAbout={() => openAbout("dashboard")}
    />
  );
}

export default App;