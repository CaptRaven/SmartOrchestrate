import { useEffect, useState } from "react";

declare global {
  interface Window {
    wxOConfiguration?: any;
    wxoLoader?: any;
  }
}

export default function AIAssistant() {
  const [status, setStatus] = useState("Initializing SmartOrchestrate Assistant…");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const chatContainer = document.getElementById("orchestrate-chat-root");
    if (!chatContainer) {
      console.error("❌ Missing orchestrate-chat-root div");
      setError("Chat container not found in DOM.");
      return;
    }

    // 🧩 Step 1: Configure the Orchestrate Chat
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
      },
    };

    // 🧩 Step 2: Inject the Watson Orchestrate script
    const script = document.createElement("script");
    script.src = `${window.wxOConfiguration.hostURL}/wxochat/wxoLoader.js?embed=true`;
    script.async = true;

    script.onload = async () => {
      try {
        // ✅ Initialize chat loader
        if (window.wxoLoader) {
          window.wxoLoader.init();

          // 🧠 Handle authTokenNeeded event (when chat requests a token)
          document.addEventListener("authTokenNeeded", async (event: any) => {
            try {
              const res = await fetch("http://localhost:8000/api/token"); // 🔹 your FastAPI endpoint
              const data = await res.json();

              if (data?.access_token) {
                console.log("🔐 Injecting IBM IAM token");
                event.authToken = data.access_token;
              } else {
                console.error("❌ Token missing in API response");
                setError("Missing IAM token from backend");
              }
            } catch (tokenErr) {
              console.error("❌ Failed to fetch IAM token:", tokenErr);
              setError("Failed to get authentication token");
            }
          });

          setStatus("✅ SmartOrchestrate chat loaded and authenticated.");
        } else {
          throw new Error("IBM wxoLoader not found");
        }
      } catch (err) {
        console.error("💥 Error initializing Orchestrate chat:", err);
        setError("Failed to initialize Orchestrate Assistant");
      }
    };

    script.onerror = () => {
      console.error("💥 Failed to load IBM Orchestrate script");
      setError("Failed to load IBM Orchestrate script");
    };

    document.head.appendChild(script);

    // Cleanup
    return () => {
      script.remove();
      delete window.wxOConfiguration;
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-gray-800">
      <h1 className="text-2xl font-bold mb-2">💬 SmartOrchestrate Assistant</h1>
      {error ? (
        <p className="text-red-600 bg-red-50 p-2 rounded">{error}</p>
      ) : (
        <p>{status}</p>
      )}
      {/* ✅ Chat widget container */}
      <div id="orchestrate-chat-root" className="w-full h-full"></div>
    </div>
  );
}
