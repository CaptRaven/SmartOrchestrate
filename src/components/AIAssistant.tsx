import { useEffect, useState } from "react";

declare global {
  interface Window {
    wxOConfiguration?: any;
    wxoLoader?: any;
  }
}

export default function AIAssistant() {
  const [status, setStatus] = useState("Loading SmartOrchestrate chat...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const container = document.createElement("div");
    container.id = "orchestrate-chat-root";
    document.body.appendChild(container);

    // ✅ Step 1: Fetch token from your FastAPI backend
    fetch("https://orchestrate-backend.onrender.com/api/token")
      .then(async (res) => {
        if (!res.ok) throw new Error(`Token request failed: ${res.status}`);
        const data = await res.json();
        const token = data.access_token;
        if (!token) throw new Error("Token missing from response");

        // ✅ Step 2: Set configuration for Orchestrate
        window.wxOConfiguration = {
          orchestrationID:
            "ab446fdeebdd469cb1f8eb4b0ee169c8_afac4274-ed4f-4982-9175-d4a2f67c4307",
          hostURL: "https://jp-tok.watson-orchestrate.cloud.ibm.com",
          rootElementID: "orchestrate-chat-root",
          showLauncher: true,
          crn: "crn:v1:bluemix:public:watsonx-orchestrate:jp-tok:a/ab446fdeebdd469cb1f8eb4b0ee169c8:afac4274-ed4f-4982-9175-d4a2f67c4307::",
          deploymentPlatform: "ibmcloud",
          chatOptions: {
            agentId: "d0e16d5c-30e8-4cc4-be77-9e682ecc4dee",
            agentEnvironmentId: "d9bd76f2-f547-4801-9ce1-ec38e8401981",
            authToken: token, // ✅ attach token here
          },
        };

        // ✅ Step 3: Load the Watson Orchestrate chat script
        const script = document.createElement("script");
        script.src = `${window.wxOConfiguration.hostURL}/wxochat/wxoLoader.js?embed=true`;
        script.async = true;

        script.onload = () => {
          try {
            window.wxoLoader.init();
            setStatus("✅ SmartOrchestrate chat initialized");
          } catch (err) {
            console.error("Initialization error:", err);
            setError("Failed to initialize Watsonx Orchestrate");
          }
        };

        script.onerror = () => setError("Failed to load Orchestrate script");
        document.head.appendChild(script);
      })
      .catch((err) => {
        console.error("Error initializing chat:", err);
        setError(err.message);
      });

    // Cleanup
    return () => {
      const container = document.getElementById("orchestrate-chat-root");
      if (container) container.remove();
      delete window.wxOConfiguration;
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-gray-800">
      <h2 className="text-2xl font-bold mb-2">💬 SmartOrchestrate Assistant</h2>
      {error ? (
        <p className="text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
          {error}
        </p>
      ) : (
        <p>{status}</p>
      )}
    </div>
  );
}
