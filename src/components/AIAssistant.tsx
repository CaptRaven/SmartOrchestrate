import { useEffect, useState } from 'react';

// Type declarations for Watson Orchestrate
declare global {
  interface Window {
    wxOConfiguration: {
      orchestrationID: string;
      hostURL: string;
      rootElementID: string;
      showLauncher: boolean;
      chatOptions: {
        agentId: string;
        agentEnvironmentId: string;
      };
      layout: {
        form: 'fullscreen-overlay' | 'float' | 'custom';
        width: string;
        height: string;
        showOrchestrateHeader: boolean;
        customElement?: HTMLElement;
      };
    };
    wxoLoader: {
      init: () => void;
    };
  }
}

export default function AIAssistant() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeChat = () => {
      try {
        // Configure Watson Orchestrate with float layout
        window.wxOConfiguration = {
          orchestrationID: "20251024-1027-2250-70d4-4169d715f5e1_20251024-1027-5237-4093-b4428b129b9c",
          hostURL: "https://dl.watson-orchestrate.ibm.com",
          rootElementID: "watson-chat-container",
          showLauncher: false,
          chatOptions: {
            agentId: "4bf799df-3f89-4844-87bc-727c7389dbae",
            agentEnvironmentId: "b7105b43-f883-4349-9d0a-1579814f5385",
          },
          layout: {
            form: 'float',
            width: '100%',
            height: '600px',
            showOrchestrateHeader: true
          }
        };

        setTimeout(() => {
          const script = document.createElement('script');
          script.src = `${window.wxOConfiguration.hostURL}/wxochat/wxoLoader.js?embed=true`;
          
          script.addEventListener('load', () => {
            if (mounted && window.wxoLoader) {
              window.wxoLoader.init();
              setIsLoading(false);
            }
          });

          script.addEventListener('error', (e) => {
            console.error('Script loading error:', e);
            if (mounted) {
              setError('Failed to load chat service');
              setIsLoading(false);
            }
          });

          document.head.appendChild(script);
        }, 0);

        return () => {
          const script = document.querySelector(`script[src*="wxoLoader.js"]`);
          if (script && script.parentNode) {
            script.parentNode.removeChild(script);
          }
        };
      } catch (err) {
        console.error('Initialization error:', err);
        if (mounted) {
          setError(`Failed to initialize chat: ${err instanceof Error ? err.message : 'Unknown error'}`);
          setIsLoading(false);
        }
      }
    };

    const cleanup = initializeChat();

    return () => {
      mounted = false;
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 p-4">
        {isLoading && (
          <div className="flex justify-center items-center h-32">
            <p className="text-gray-600">Loading chat service...</p>
          </div>
        )}
        
        {error && (
          <div className="p-4 mb-4 bg-red-50 text-red-700 rounded-md">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        <div
          id="watson-chat-container"
          className="w-full max-w-5xl mx-auto bg-white rounded-lg shadow-lg"
          style={{
            position: 'relative',
            minHeight: '600px',
            display: isLoading ? 'none' : 'block'
          }}
        />
      </div>
    </div>
  );
}