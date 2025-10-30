import { useEffect, useState } from "react";

declare global {
  interface Window {
    wxOConfiguration?: any;
    wxoLoader?: any;
  }
}

export default function AIAssistant() {
  const [status, setStatus] = useState("Loading Orchestrate Assistant…");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ✅ Define configuration (your live embed code)
    window.wxOConfiguration = {
      orchestrationID:
        "ab446fdeebdd469cb1f8eb4b0ee169c8_afac4274-ed4f-4982-9175-d4a2f67c4307",
      hostURL: "https://jp-tok.watson-orchestrate.cloud.ibm.com",
      rootElementID: "ibm-orchestrate-chat", // Local placeholder container
      showLauncher: true,
      deploymentPlatform: "ibmcloud",
      crn: "crn:v1:bluemix:public:watsonx-orchestrate:jp-tok:a/ab446fdeebdd469cb1f8eb4b0ee169c8:afac4274-ed4f-4982-9175-d4a2f67c4307::",
      chatOptions: {
        agentId: "d0e16d5c-30e8-4cc4-be77-9e682ecc4dee",
        agentEnvironmentId: "d9bd76f2-f547-4801-9ce1-ec38e8401981",
      },
    };

    // ✅ Inject the Orchestrate chat script
    const script = document.createElement("script");
    script.src = `${window.wxOConfiguration.hostURL}/wxochat/wxoLoader.js?embed=true`;
    script.async = true;

    script.onload = () => {
      try {
        if (window.wxoLoader && typeof window.wxoLoader.init === "function") {
          window.wxoLoader.init();
          setStatus("✅ SmartOrchestrate Assistant initialized");
        } else {
          setError("Chat loader not found after load");
        }
      } catch (err) {
        console.error("Initialization error:", err);
        setError("Failed to initialize Watsonx Orchestrate");
      }
    };

    script.onerror = () => {
      setError("Failed to load IBM Orchestrate script");
    };

    document.head.appendChild(script);

    // ✅ Cleanup on unmount
    return () => {
      script.remove();
      delete window.wxOConfiguration;
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50 text-gray-800">
      <h2 className="text-2xl font-bold mb-3">🤖 SmartOrchestrate Assistant</h2>

      {error ? (
        <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg">
          {error}
        </div>
      ) : (
        <p className="text-gray-600">{status}</p>
      )}

      {/* 🔹 Placeholder container (keeps layout safe) */}
      <div id="ibm-orchestrate-chat" className="hidden" />
    </div>
  );
}
