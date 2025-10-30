import { useEffect } from "react";

declare global {
  interface Window {
    wxOConfiguration?: any;
    wxoLoader?: any;
  }
}

export default function AIAssistant() {
  useEffect(() => {
    const container = document.createElement("div");
    container.id = "orchestrate-chat-root";
    document.body.appendChild(container);

    // Fetch IAM token dynamically from your backend
    async function initChat() {
      try {
        const res = await fetch("https://orchestrate-backend.onrender.com/api/token");
        const data = await res.json();
        const token = data.access_token;

        if (!token) throw new Error("No token received");

        // Inject IBM configuration
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
            authToken: token,
          },
        };

        const script = document.createElement("script");
        script.src = `${window.wxOConfiguration.hostURL}/wxochat/wxoLoader.js?embed=true`;
        script.async = true;
        script.onload = () => {
          window.wxoLoader.init();
        };
        document.head.appendChild(script);
      } catch (error) {
        console.error("Failed to initialize chat:", error);
      }
    }

    initChat();

    return () => {
      container.remove();
      delete window.wxOConfiguration;
    };
  }, []);

  return null;
}
