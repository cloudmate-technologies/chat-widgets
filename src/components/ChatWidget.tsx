import { createSignal, Show, createEffect, onCleanup, onMount } from 'solid-js';
import { 
  ChatIcon, 
  CalendarIcon, 
  PhoneIcon, 
  BookIcon, 
  CloseIcon 
} from './AgodifyIcons';
import { ConversationView } from './ConversationView';

type ChatWidgetProps = {
  title?: string;
  subtitle?: string;
  onClose?: () => void;
}

export const ChatWidget = (props: ChatWidgetProps) => {
  // Always start closed on fresh page load
  const [expanded, setExpanded] = createSignal(false);
  const [activeView, setActiveView] = createSignal<'menu' | 'conversation'>('menu');
  const [userInitiatedClose, setUserInitiatedClose] = createSignal(false);
  const [isFirstLoad, setIsFirstLoad] = createSignal(true);

  // Persist state changes to localStorage, but only after first user interaction
  const persistState = (isExpanded: boolean, view: 'menu' | 'conversation') => {
    if (!isFirstLoad()) {
      localStorage.setItem('chatWidget_expanded', isExpanded.toString());
      localStorage.setItem('chatWidget_view', view);
    }
  };

  const toggleExpand = () => {
    const newState = !expanded();
    setExpanded(newState);
    setUserInitiatedClose(!newState);
    setIsFirstLoad(false);
    if (newState) {
      setActiveView('menu');
    }
    persistState(newState, activeView());
  };

  const handleOptionClick = (view: 'menu' | 'conversation') => {
    console.log('handleOptionClick', view);
    setActiveView(view);
    setIsFirstLoad(false);
    persistState(expanded(), view);
  };

  // Keep widget open unless explicitly closed
  createEffect(() => {
    if (expanded() && !userInitiatedClose() && !isFirstLoad()) {
      const keepAlive = () => {
        if (!userInitiatedClose()) {
          setExpanded(true);
          persistState(true, activeView());
        }
      };
      
      // Check every second to ensure widget stays open
      const interval = setInterval(keepAlive, 1000);
      
      // Cleanup interval when component unmounts
      onCleanup(() => {
        clearInterval(interval);
      });
    }
  });

  // Prevent accidental cleanup
  onMount(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (expanded() && !userInitiatedClose() && !isFirstLoad()) {
        persistState(true, activeView());
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    onCleanup(() => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    });
  });

  // Handle visibility change (when user switches tabs)
  onMount(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && expanded() && !userInitiatedClose() && !isFirstLoad()) {
        setExpanded(true);
        persistState(true, activeView());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    onCleanup(() => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    });
  });

  return (
    <div class="chat-widget">
      <Show when={expanded()}>
        <div class="chat-widget-container">
          <Show when={activeView() === 'menu'}>
            <div class="chat-widget-header">
              <div class="logo-container">
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHJ4PSI2IiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjgiIGN5PSIxMiIgcj0iMyIgZmlsbD0iI0ZGNDg0OCIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiIGZpbGw9IiNGRkEyMEIiLz48Y2lyY2xlIGN4PSIxNiIgY3k9IjEyIiByPSIzIiBmaWxsPSIjMDBDMTdDIi8+PC9zdmc+" alt="agodify logo" class="logo-img" />
              </div>
              <h1 class="title">{props.title}</h1>
              <p class="subtitle">{props.subtitle}</p>
              <p class="description">Get the best prices on 2,000,000+ properties, worldwide</p>
            </div>
            
            <div class="chat-options">
              <button class="chat-option" onClick={() => handleOptionClick('conversation')}>
                <div class="option-icon conversation">
                  <ChatIcon />
                </div>
                <div class="option-content">
                  <h3 class="option-title">Conversations</h3>
                  <p class="option-description">Your conversations</p>
                </div>
                <div class="option-action">
                  <span class="action-text">New message</span>
                  <span class="action-arrow">›</span>
                </div>
              </button>

              <button class="chat-option">
                <div class="option-icon schedule">
                  <CalendarIcon />
                </div>
                <div class="option-content">
                  <h3 class="option-title">Schedule a call</h3>
                  <p class="option-description">Can't talk right now? Book a slot directly</p>
                </div>
                <span class="action-arrow">›</span>
              </button>

              <button class="chat-option">
                <div class="option-icon call">
                  <PhoneIcon />
                </div>
                <div class="option-content">
                  <h3 class="option-title">Call agent</h3>
                  <p class="option-description">No queues, no fees</p>
                </div>
                <span class="action-arrow">›</span>
              </button>

              <button class="chat-option">
                <div class="option-icon knowledge">
                  <BookIcon />
                </div>
                <div class="option-content">
                  <h3 class="option-title">Knowledge base</h3>
                  <p class="option-description">Find answers to the most FAQ</p>
                </div>
                <span class="action-arrow">›</span>
              </button>
            </div>
          </Show>

          <Show when={activeView() === 'conversation'}>
            <ConversationView 
              onClose={() => setActiveView('menu')}
              conversationTitle="Chatwoot"
              onUpdateTitle={(title) => {/* Handle title update */}}
              onMessageSent={(text) => {/* Handle message sent */}}
            />
          </Show>
        </div>
      </Show>

      <button 
        class={`toggle-button ${expanded() ? 'expanded' : ''}`}
        onClick={toggleExpand}
      >
        {expanded() ? <CloseIcon /> : <ChatIcon />}
      </button>

      <style>{`
        .chat-widget {
          position: fixed;
          bottom: 24px;
          right: 24px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          z-index: 1000;
        }

        .chat-widget-container {
          width: 420px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
          margin-bottom: 76px;
          overflow: hidden;
        }

        .chat-widget-header {
          background: #1A73E8;
          padding: 24px;
          color: white;
          text-align: center;
        }

        .logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .logo-img {
          width: 50px;
          height: 50px;
        }

        .logo-text {
          font-size: 16px;
          font-weight: 600;
          color: white;
        }

        .title {
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 16px;
          color: white;
        }

        .subtitle {
          font-size: 15px;
          font-weight: 400;
          margin: 0 0 12px;
          color: rgba(255, 255, 255, 0.9);
        }

        .description {
          font-size: 14px;
          font-weight: 400;
          margin: 0;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.4;
        }

        .chat-options {
          padding-left: 14px;
          padding-right: 14px;
        }

        .chat-option {
          width: 100%;
          display: flex;
          border-radius: 12px;
          border: 0.5px solid #E0E0E0;
          align-items: center;
          padding: 16px;
          background: white;
          margin-top: 14px;
          margin-bottom: 14px;
          cursor: pointer;
          transition: background-color 0.2s;
          text-align: left;
        }

        .chat-option:hover {
          background: #F8F9FA;
        }

        .option-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          flex-shrink: 0;
        }

        .option-icon svg {
          width: 20px;
          height: 20px;
          color: white;
        }

        .conversation { background: #4285F4; }
        .schedule { background: #EA4335; }
        .call { background: #00BFA5; }
        .knowledge { background: #4285F4; }

        .option-content {
          flex: 1;
          min-width: 0;
        }

        .option-title {
          font-size: 16px;
          font-weight: 800;
          color: #1A1A1A;
          margin: 0 0 4px;
        }

        .option-description {
          font-size: 14px;
          font-weight: 400;
          color: #666666;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .option-action {
          display: flex;
          align-items: center;
          margin-left: 16px;
        }

        .action-text {
          font-size: 14px;
          font-weight: 400;
          color: #4285F4;
          margin-right: 8px;
        }

        .action-arrow {
          font-size: 30px;
          color: #666666;
          line-height: 1;
        }

        .toggle-button {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #4285F4;
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
          transition: transform 0.2s, box-shadow 0.2s;
          z-index: 1001;
        }

        .toggle-button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(66, 133, 244, 0.4);
        }

        .toggle-button svg {
          width: 24px;
          height: 24px;
        }

        .toggle-button.expanded {
          background: #1A73E8;
        }

        /* Mobile Responsive Styles */
        @media screen and (max-width: 480px) {
          .chat-widget {
            bottom: 16px;
            right: 16px;
          }

          .chat-widget-container {
            width: calc(100vw - 32px);
            max-width: 420px;
            margin-bottom: 60px;
          }

          .chat-widget-header {
            padding: 16px;
          }

          .logo-img {
            width: 40px;
            height: 40px;
          }

          .title {
            font-size: 20px;
            margin-bottom: 12px;
          }

          .subtitle {
            font-size: 14px;
          }

          .description {
            font-size: 13px;
          }

          .chat-options {
            padding-left: 12px;
            padding-right: 12px;
          }

          .chat-option {
            padding: 12px;
            margin-top: 10px;
            margin-bottom: 10px;
          }

          .option-icon {
            width: 36px;
            height: 36px;
            margin-right: 12px;
          }

          .option-icon svg {
            width: 18px;
            height: 18px;
          }

          .option-title {
            font-size: 15px;
          }

          .option-description {
            font-size: 13px;
          }

          .action-text {
            font-size: 13px;
          }

          .toggle-button {
            width: 48px;
            height: 48px;
            bottom: 16px;
            right: 16px;
          }

          .toggle-button svg {
            width: 20px;
            height: 20px;
          }
        }

        /* Small height screens */
        @media screen and (max-height: 600px) {
          .chat-widget-container {
            max-height: calc(100vh - 100px);
          }

          .chat-options {
            max-height: calc(100vh - 280px);
            overflow-y: auto;
          }
        }

        /* Tablet Responsive Styles */
        @media screen and (min-width: 481px) and (max-width: 768px) {
          .chat-widget-container {
            width: 380px;
            margin-bottom: 70px;
          }

          .chat-widget-header {
            padding: 20px;
          }

          .chat-options {
            padding-left: 12px;
            padding-right: 12px;
          }
        }

        /* Landscape Mode */
        @media screen and (max-width: 480px) and (orientation: landscape) {
          .chat-widget-container {
            max-height: calc(100vh - 80px);
          }

          .chat-widget-header {
            padding: 12px;
          }

          .logo-container {
            margin-bottom: 12px;
          }

          .title {
            font-size: 18px;
            margin-bottom: 8px;
          }

          .subtitle {
            margin-bottom: 8px;
          }

          .chat-options {
            max-height: calc(100vh - 200px);
            overflow-y: auto;
          }
        }
      `}</style>
    </div>
  );
};