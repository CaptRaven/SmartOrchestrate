import { useEffect, useState } from "react";

declare global {
  interface Window {
    wxOConfiguration?: any;
    wxoLoader?: any;
  }
}

export default function AIAssistant() {
  const [status, setStatus] = useState("Loading SmartOrchestrate Assistant...");
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  const container = document.createElement("div");
  container.id = "orchestrate-chat-root";
  document.body.appendChild(container);

  window.wxOConfiguration = {
    orchestrationID:
      "ab446fdeebdd469cb1f8eb4b0ee169c8_afac4274-ed4f-4982-9175-d4a2f67c4307",
    hostURL: "https://jp-tok.watson-orchestrate.cloud.ibm.com",
    rootElementID: "orchestrate-chat-root",
    showLauncher: true,
    deploymentPlatform: "ibmcloud",
    crn: "crn:v1:bluemix:public:watsonx-orchestrate:jp-tok:a/ab446fdeebdd469cb1f8eb4b0ee169c8:afac4274-ed4f-4982-9175-d4a2f67c4307::",
    chatOptions: {
      agentId: "d0e16d5c-30e8-4cc4-be77-9e682ecc4dee",
      agentEnvironmentId: "d9bd76f2-f547-4801-9ce1-ec38e8401981",
    },
  };

  // 🔹 Use IBM's hosted loader instead of hostURL
  const script = document.createElement("script");
  script.src = "https://dl.watson-orchestrate.ibm.com/wxochat/wxoLoader.js?embed=true";
  script.async = true;

  script.onload = () => {
    try {
      window.wxoLoader.init();
      setStatus("✅ SmartOrchestrate chat initialized");
    } catch (err) {
      console.error("❌ Initialization error:", err);
      setError("Failed to initialize Watson Orchestrate");
    }
  };

  script.onerror = (err) => {
    console.error("❌ Script load error:", err);
    setError("Failed to load Orchestrate script");
  };

  document.head.appendChild(script);

  return () => {
    const chatRoot = document.getElementById("orchestrate-chat-root");
    if (chatRoot) chatRoot.remove();
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
      <p className="text-gray-500 text-sm mt-2">
        (The chat bubble will appear once the Orchestrate script loads)
      </p>
    </div>
  );
}
