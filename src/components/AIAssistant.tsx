import { useEffect, useState } from "react";

declare global {
  interface Window {
    wxOConfiguration?: any;
    wxoLoader?: any;
  }
}

export default function AIAssistant() {
  const [status, setStatus] = useState("Loading IBM Orchestrate Assistant…");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Clean up any previous chat widget
    const existingScript = document.querySelector(
      'script[src*="wxoLoader.js"]'
    );
    if (existingScript) existingScript.remove();

    // ✅ Configuration (your live values)
    window.wxOConfiguration = {
      orchestrationID:
        "ab446fdeebdd469cb1f8eb4b0ee169c8_afac4274-ed4f-4982-9175-d4a2f67c4307",
      hostURL: "https://jp-tok.watson-orchestrate.cloud.ibm.com",
      rootElementID: "ibm-chat-root", // IBM expects this
      showLauncher: true,
      deploymentPlatform: "ibmcloud",
      crn: "crn:v1:bluemix:public:watsonx-orchestrate:jp-tok:a/ab446fdeebdd469cb1f8eb4b0ee169c8:afac4274-ed4f-4982-9175-d4a2f67c4307::",
      chatOptions: {
        agentId: "d0e16d5c-30e8-4cc4-be77-9e682ecc4dee",
        agentEnvironmentId: "d9bd76f2-f547-4801-9ce1-ec38e8401981",
      },
    };

    // ✅ Inject Orchestrate script
    const script = document.createElement("script");
    script.src = `${window.wxOConfiguration.hostURL}/wxochat/wxoLoader.js?embed=true`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      try {
        if (window.wxoLoader && typeof window.wxoLoader.init === "function") {
          window.wxoLoader.init();
          setStatus("✅ IBM Orchestrate loaded successfully");
        } else {
          throw new Error("wxoLoader.init() not found");
        }
      } catch (err) {
        console.error("Orchestrate init error:", err);
        setError("Failed to initialize IBM Orchestrate");
      }
    };

    script.onerror = () => {
      setError("Failed to load Orchestrate script (network or CORS issue)");
    };

    document.body.appendChild(script);

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
      <p className="text-sm text-gray-500 mt-4">
        The chat bubble should appear at the bottom right.
      </p>
    </div>
  );
}
