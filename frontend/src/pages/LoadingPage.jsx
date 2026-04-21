import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import {
  uploadFile,
  generateFeatures,
  runPrediction,
  getPredictions,
  getCohorts,
} from "../api/api";
import "../styles/main.css";
import "../styles/loading.css";

const STEP_MESSAGES = [
  "Analyzing data…",
  "Processing segments…",
  "Preparing insights…",
];

const MESSAGE_STAGGER_MS = 800;
const MIN_LOADING_MS = 2800;

function buildChartDataFromPredictions(rows) {
  const counts = {};
  rows.forEach((item) => {
    const date = item.created_at ? new Date(item.created_at) : new Date();
    const month = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    if (!counts[month]) {
      counts[month] = {
        month,
        Low: 0,
        Medium: 0,
        High: 0,
        VIP: 0,
      };
    }
    if (counts[month][item.predicted_bucket] !== undefined) {
      counts[month][item.predicted_bucket]++;
    }
  });
  return Object.values(counts);
}

function LoadingPage({ file, onComplete, onError, onBack, goAbout }) {
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [activeStep, setActiveStep] = useState(-1);
  const pipelineGenRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onErrorRef.current = onError;
  });

  useEffect(() => {
    const timers = STEP_MESSAGES.map((_, i) =>
      setTimeout(() => {
        setVisibleSteps((v) => Math.max(v, i + 1));
        setActiveStep(i);
      }, i * MESSAGE_STAGGER_MS)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (!file) return undefined;

    const runId = ++pipelineGenRef.current;
    const started = Date.now();

    (async () => {
      try {
        await uploadFile(file);
        if (runId !== pipelineGenRef.current) return;

        await generateFeatures();
        if (runId !== pipelineGenRef.current) return;

        await runPrediction();
        if (runId !== pipelineGenRef.current) return;

        const res = await getPredictions();
        if (runId !== pipelineGenRef.current) return;

        const cohortRes = await getCohorts();
        if (runId !== pipelineGenRef.current) return;

        if (!res.data || res.data.length === 0) {
          alert("No prediction data found.");
          onErrorRef.current();
          return;
        }

        const elapsed = Date.now() - started;
        const waitMore = Math.max(0, MIN_LOADING_MS - elapsed);
        if (waitMore > 0) {
          await new Promise((r) => setTimeout(r, waitMore));
        }
        if (runId !== pipelineGenRef.current) return;

        const chartData = buildChartDataFromPredictions(res.data);
        onCompleteRef.current({ 
          data: res.data, 
          chartData,
          cohortData: cohortRes.data
        });
      } catch (err) {
        console.error(err);
        if (runId !== pipelineGenRef.current) return;
        alert(
          err.response?.data?.error ||
            "Something went wrong while fetching predictions"
        );
        onErrorRef.current();
      }
    })();

    return () => {
      pipelineGenRef.current += 1;
    };
  }, [file]);

  return (
    <div className="page-loading">
      <Navbar onBack={onBack} onAbout={goAbout} />

      <div className="loading-body">
        <div className="loading-spinner-wrap" aria-hidden="true">
          <div className="loading-spinner" />
        </div>

        <p className="loading-title">Working on your insights</p>

        <ul className="loading-messages" aria-live="polite">
          {STEP_MESSAGES.map((msg, i) => (
            <li
              key={msg}
              className={[
                i < visibleSteps ? "is-visible" : "",
                i === activeStep ? "is-active" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {msg}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default LoadingPage;
