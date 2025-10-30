import { useEffect } from "react";

declare global {
  interface Window {
    wxOConfiguration?: any;
    wxoLoader?: any;
  }
}

export default function AIAssistant() {
  useEffect(() => {
    // Inject IBM Orchestrate chat
    window.wxOConfiguration = {
      orchestrationID:
        "ab446fdeebdd469cb1f8eb4b0ee169c8_afac4274-ed4f-4982-9175-d4a2f67c4307",
      hostURL: "https://jp-tok.watson-orchestrate.cloud.ibm.com",
      rootElementID: "root",
      showLauncher: true,
      deploymentPlatform: "ibmcloud",
      crn: "crn:v1:bluemix:public:watsonx-orchestrate:jp-tok:a/ab446fdeebdd469cb1f8eb4b0ee169c8:afac4274-ed4f-4982-9175-d4a2f67c4307::",
      chatOptions: {
        agentId: "d0e16d5c-30e8-4cc4-be77-9e682ecc4dee",
        agentEnvironmentId: "d9bd76f2-f547-4801-9ce1-ec38e8401981",
      },
    };

    const script = document.createElement("script");
    script.src = `${window.wxOConfiguration.hostURL}/wxochat/wxoLoader.js?embed=true`;
    script.addEventListener("load", function () {
      console.log("✅ IBM Orchestrate chat script loaded successfully");
      if (window.wxoLoader && typeof window.wxoLoader.init === "function") {
        window.wxoLoader.init();
        console.log("💬 IBM Orchestrate chat initialized");
      } else {
        console.error("❌ wxoLoader not found after script load");
      }
    });
    script.addEventListener("error", (e) => {
      console.error("❌ Failed to load IBM Orchestrate chat script", e);
    });
    document.head.appendChild(script);

    // Handle authentication token when requested by the chat widget
    const handleAuthNeeded = async (event: any) => {
      console.log("🔐 IBM Orchestrate authTokenNeeded event detected");
      try {
        const res = await fetch("/api/ibm-token");
        const data = await res.json();

        if (data.access_token) {
          event.authToken = data.access_token;
          console.log("✅ Provided new IBM IAM access token");
        } else {
          console.error("⚠️ Failed to get valid token:", data);
        }
      } catch (err) {
        console.error("❌ Error fetching IBM token:", err);
      }
    };

    window.addEventListener("authTokenNeeded", handleAuthNeeded);

    return () => {
      window.removeEventListener("authTokenNeeded", handleAuthNeeded);
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">
        SmartOrchestrate AI Assistant
      </h1>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Connecting to IBM Watson Orchestrate... Your digital factory assistant
        will appear here shortly.
      </p>
      <div id="root" className="w-full min-h-[500px]" />
    </div>
  );
}
