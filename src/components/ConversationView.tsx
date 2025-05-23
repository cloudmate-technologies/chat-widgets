import { createSignal, For } from 'solid-js';
import { ChatIcon } from './AgodifyIcons';

// Message types
type BaseMessage = {
  id: string;
  timestamp: Date;
  isUser: boolean;
  sender?: string;
};

type TextMessage = BaseMessage & {
  type: 'text';
  text: string;
};

type TextWithButtonMessage = BaseMessage & {
  type: 'text_with_button';
  text: string;
  buttons: Array<{
    id: string;
    label: string;
    action: 'postback' | 'url';
    value: string;
  }>;
};

type CardMessage = BaseMessage & {
  type: 'card';
  title: string;
  subtitle?: string;
  imageUrl?: string;
  buttons?: Array<{
    id: string;
    label: string;
    action: 'postback' | 'url';
    value: string;
  }>;
};

type CarouselMessage = BaseMessage & {
  type: 'carousel';
  cards: Array<{
    id: string;
    title: string;
    subtitle?: string;
    imageUrl?: string;
    buttons?: Array<{
      id: string;
      label: string;
      action: 'postback' | 'url';
      value: string;
    }>;
  }>;
};

type SuggestionChipsMessage = BaseMessage & {
  type: 'suggestion_chips';
  text?: string;
  chips: Array<{
    id: string;
    label: string;
    value: string;
  }>;
};

type Message = TextMessage | TextWithButtonMessage | CardMessage | CarouselMessage | SuggestionChipsMessage;

type ConversationViewProps = {
  onClose: () => void;
  conversationTitle: string;
  onUpdateTitle: (newTitle: string) => void;
  onMessageSent: (text: string) => void;
};

export const ConversationView = (props: ConversationViewProps) => {
  const [message, setMessage] = createSignal('');
  const [messages, setMessages] = createSignal<Message[]>([
    {
      id: '1',
      type: 'text',
      text: "Thank you for reaching out! We are currently away. We will get back to you as soon as we are back.",
      isUser: false,
      sender: "Chatwoot",
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: '2',
      type: 'text',
      text: "Hi there! I'm Chatwoot Assistant. How can I help you with Chatwoot today?",
      isUser: false,
      sender: "Chatwoot Assistant",
      timestamp: new Date(Date.now() - 240000)
    },
    {
      id: '3',
      type: 'suggestion_chips',
      text: "Here are some common topics I can help you with:",
      chips: [
        { id: 'chip1', label: 'Getting Started', value: 'getting_started' },
        { id: 'chip2', label: 'Pricing', value: 'pricing' },
        { id: 'chip3', label: 'Features', value: 'features' },
        { id: 'chip4', label: 'Support', value: 'support' }
      ],
      isUser: false,
      sender: "Chatwoot Assistant",
      timestamp: new Date(Date.now() - 180000)
    },
    {
      id: '4',
      type: 'text_with_button',
      text: "Would you like to explore our main features or get a demo?",
      buttons: [
        { id: 'btn1', label: 'View Features', action: 'postback', value: 'show_features' },
        { id: 'btn2', label: 'Book Demo', action: 'url', value: 'https://chatwoot.com/demo' }
      ],
      isUser: false,
      sender: "Chatwoot Assistant",
      timestamp: new Date(Date.now() - 120000)
    },
    {
      id: '5',
      type: 'card',
      title: "Chatwoot Live Chat",
      subtitle: "Connect with your customers in real-time with our powerful live chat platform. Get instant notifications and respond quickly.",
      imageUrl: "https://images.unsplash.com/photo-1553484771-371a605b060b?w=350&h=200&fit=crop&crop=center",
      buttons: [
        { id: 'card_btn1', label: 'Learn More', action: 'postback', value: 'learn_more' },
        { id: 'card_btn2', label: 'Try Now', action: 'url', value: 'https://chatwoot.com/try' }
      ],
      isUser: false,
      sender: "Chatwoot Assistant",
      timestamp: new Date(Date.now() - 90000)
    },
    {
      id: '6',
      type: 'carousel',
      cards: [
        {
          id: 'carousel1',
          title: "Live Chat",
          subtitle: "Real-time customer support with instant messaging",
          imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=280&h=160&fit=crop&crop=center",
          buttons: [
            { id: 'c1_btn1', label: 'Learn More', action: 'postback', value: 'live_chat_details' }
          ]
        },
        {
          id: 'carousel2',
          title: "Help Desk",
          subtitle: "Complete ticket management and customer support system",
          imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=280&h=160&fit=crop&crop=center",
          buttons: [
            { id: 'c2_btn1', label: 'View Features', action: 'postback', value: 'helpdesk_details' }
          ]
        },
        {
          id: 'carousel3',
          title: "Knowledge Base",
          subtitle: "Self-service articles and documentation for customers",
          imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=280&h=160&fit=crop&crop=center",
          buttons: [
            { id: 'c3_btn1', label: 'Explore', action: 'postback', value: 'kb_details' }
          ]
        }
      ],
      isUser: false,
      sender: "Chatwoot Assistant",
      timestamp: new Date(Date.now() - 60000)
    }
  ]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleSendMessage = () => {
    const text = message().trim();
    if (text) {
      const newMessage: TextMessage = {
        id: Date.now().toString(),
        type: 'text',
        text,
        isUser: true,
        timestamp: new Date()
      };
      setMessages([...messages(), newMessage]);
      setMessage('');
      props.onMessageSent(text);
    }
  };

  const handleButtonClick = (action: string, value: string, buttonLabel: string) => {
    if (action === 'url') {
      window.open(value, '_blank');
    } else {
      const newMessage: TextMessage = {
        id: Date.now().toString(),
        type: 'text',
        text: buttonLabel,
        isUser: true,
        timestamp: new Date()
      };
      setMessages([...messages(), newMessage]);
      props.onMessageSent(buttonLabel);
    }
  };

  const handleChipClick = (chipLabel: string, chipValue: string) => {
    const newMessage: TextMessage = {
      id: Date.now().toString(),
      type: 'text',
      text: chipLabel,
      isUser: true,
      timestamp: new Date()
    };
    setMessages([...messages(), newMessage]);
    props.onMessageSent(chipLabel);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (msg: Message) => {
    switch (msg.type) {
      case 'text':
        return (
          <div class="message-text">{msg.text}</div>
        );

      case 'text_with_button':
        return (
          <div>
            <div class="message-text">{msg.text}</div>
            <div class="message-buttons">
              <For each={msg.buttons}>
                {(button) => (
                  <button 
                    class="message-button"
                    onClick={() => handleButtonClick(button.action, button.value, button.label)}
                  >
                    {button.label}
                  </button>
                )}
              </For>
            </div>
          </div>
        );

      case 'card':
        return (
          <div class="message-card">
            {msg.imageUrl && (
              <img src={msg.imageUrl} alt={msg.title} class="card-image" />
            )}
            <div class="card-content">
              <h3 class="card-title">{msg.title}</h3>
              {msg.subtitle && <p class="card-subtitle">{msg.subtitle}</p>}
              {msg.buttons && (
                <div class="card-buttons">
                  <For each={msg.buttons}>
                    {(button) => (
                      <button 
                        class="card-button"
                        onClick={() => handleButtonClick(button.action, button.value, button.label)}
                      >
                        {button.label}
                      </button>
                    )}
                  </For>
                </div>
              )}
            </div>
          </div>
        );

      case 'carousel':
        return (
          <div class="message-carousel">
            <div class="carousel-container">
              <For each={msg.cards}>
                {(card) => (
                  <div class="carousel-card">
                    {card.imageUrl && (
                      <img src={card.imageUrl} alt={card.title} class="carousel-card-image" />
                    )}
                    <div class="carousel-card-content">
                      <h4 class="carousel-card-title">{card.title}</h4>
                      {card.subtitle && <p class="carousel-card-subtitle">{card.subtitle}</p>}
                      {card.buttons && (
                        <div class="carousel-card-buttons">
                          <For each={card.buttons}>
                            {(button) => (
                              <button 
                                class="carousel-card-button"
                                onClick={() => handleButtonClick(button.action, button.value, button.label)}
                              >
                                {button.label}
                              </button>
                            )}
                          </For>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        );

      case 'suggestion_chips':
        return (
          <div>
            {msg.text && <div class="message-text">{msg.text}</div>}
            <div class="suggestion-chips">
              <For each={msg.chips}>
                {(chip) => (
                  <button 
                    class="suggestion-chip"
                    onClick={() => handleChipClick(chip.label, chip.value)}
                  >
                    {chip.label}
                  </button>
                )}
              </For>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div class="conversation-view">
      <div class="conversation-header">
        <button onClick={props.onClose} class="back-button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div class="header-content">
          <div class="header-icon">
            <ChatIcon />
          </div>
          <div class="header-text">
            <h2>{props.conversationTitle}</h2>
            <p>We will be back online at 09:00 AM</p>
          </div>
        </div>
      </div>

      <div class="messages-container">
        <div class="date-separator">Today</div>
        <For each={messages()}>
          {(msg) => (
            <div class={`message ${msg.isUser ? 'user' : 'bot'}`}>
              {!msg.isUser && (
                <div class="bot-avatar">
                  <ChatIcon />
                </div>
              )}
              <div class="message-content">
                {msg.sender && <div class="message-sender">{msg.sender}</div>}
                {renderMessage(msg)}
                <div class="message-timestamp">{formatTime(msg.timestamp)}</div>
              </div>
            </div>
          )}
        </For>
      </div>

      <div class="input-container">
        <input
          type="text"
          value={message()}
          onInput={(e) => setMessage(e.currentTarget.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message"
          class="message-input"
        />
        <button 
          class="send-button"
          onClick={handleSendMessage}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
          </svg>
        </button>
        <button class="attachment-button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
          </svg>
        </button>
        <button class="emoji-button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
        </button>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .conversation-view {
          display: flex;
          flex-direction: column;
          height: 100vh;
          max-height: 800px;
          background: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
        }

        .conversation-header {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          min-height: 72px;
        }

        .back-button {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .back-button:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .back-button svg {
          width: 20px;
          height: 20px;
        }

        .header-content {
          flex: 1;
          display: flex;
          align-items: center;
          margin-left: 16px;
        }

        .header-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          flex-shrink: 0;
        }

        .header-icon svg {
          width: 22px;
          height: 22px;
          color: white;
        }

        .header-text h2 {
          font-size: 17px;
          font-weight: 600;
          margin: 0 0 2px 0;
          color: #111827;
          line-height: 1.4;
        }

        .header-text p {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
          line-height: 1.4;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          background: #f9fafb;
        }

        .messages-container::-webkit-scrollbar {
          width: 6px;
        }

        .messages-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }

        .date-separator {
          text-align: center;
          font-size: 13px;
          font-weight: 500;
          color: #6b7280;
          margin: 24px 0;
          position: relative;
        }

        .date-separator::before,
        .date-separator::after {
          content: '';
          position: absolute;
          top: 50%;
          width: calc(50% - 32px);
          height: 1px;
          background: #e5e7eb;
        }

        .date-separator::before {
          left: 0;
        }

        .date-separator::after {
          right: 0;
        }

        .message {
          display: flex;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .message.user {
          justify-content: flex-end;
        }

        .bot-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          flex-shrink: 0;
        }

        .bot-avatar svg {
          width: 18px;
          height: 18px;
          color: white;
        }

        .message-content {
          max-width: 75%;
          background: #ffffff;
          border-radius: 20px 20px 20px 5px;
          padding: 12px 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          position: relative;
        }

        .message.user .message-content {
          background: #4f46e5;
          color: white;
          border-radius: 20px 20px 5px 20px;
        }

        .message-sender {
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 6px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .message.user .message-sender {
          color: rgba(255, 255, 255, 0.8);
        }

        .message-text {
          font-size: 15px;
          line-height: 1.5;
          margin-bottom: 8px;
          color: #111827;
        }

        .message.user .message-text {
          color: white;
        }

        .message-timestamp {
          font-size: 11px;
          color: #9ca3af;
          text-align: right;
          margin-top: 6px;
          font-weight: 500;
        }

        .message.user .message-timestamp {
          color: rgba(255, 255, 255, 0.7);
        }

        /* Suggestion Chips */
        .suggestion-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .suggestion-chip {
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .suggestion-chip:hover {
          background: #4f46e5;
          border-color: #4f46e5;
          color: white;
          transform: translateY(-1px);
        }

        /* Message Buttons */
        .message-buttons {
          display: flex;
          flex-direction: row;
          gap: 12px;
          margin-top: 16px;
        }

        .message-button {
          flex: 1;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 8px;
          // padding: 10px 16px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
          min-height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .message-button:hover {
          background: #4338ca;
        }

        .message-button:nth-child(2) {
          background: #10b981;
        }

        .message-button:nth-child(2):hover {
          background: #059669;
        }

        /* Card Messages */
        .message-card {
          border-radius: 16px;
          overflow: hidden;
          background: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-width: 340px;
          margin-top: 8px;
        }

        .card-image {
          width: 100%;
          height: 180px;
          object-fit: cover;
        }

        .card-content {
          padding: 20px;
        }

        .card-title {
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 8px 0;
          color: #111827;
          line-height: 1.3;
        }

        .card-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 16px 0;
          line-height: 1.5;
        }

        .card-buttons {
          display: flex;
          gap: 12px;
          margin-top: 4px;
        }

        .card-button {
          flex: 1;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
          min-height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-button:hover {
          background: #4338ca;
        }

        .card-button:nth-child(2) {
          background: #10b981;
        }

        .card-button:nth-child(2):hover {
          background: #059669;
        }

        /* Carousel Messages */
        .message-carousel {
          max-width: 100%;
          overflow: hidden;
          margin-top: 8px;
        }

        .carousel-container {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding: 4px 4px 12px 4px;
        }

        .carousel-container::-webkit-scrollbar {
          height: 6px;
        }

        .carousel-container::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 3px;
        }

        .carousel-container::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }

        .carousel-card {
          flex: 0 0 260px;
          background: white;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        }

        .carousel-card-image {
          width: 100%;
          height: 140px;
          object-fit: cover;
        }

        .carousel-card-content {
          padding: 16px;
        }

        .carousel-card-title {
          font-size: 16px;
          font-weight: 700;
          margin: 0 0 6px 0;
          color: #111827;
          line-height: 1.3;
        }

        .carousel-card-subtitle {
          font-size: 13px;
          color: #6b7280;
          margin: 0 0 12px 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .carousel-card-buttons {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }

        .carousel-card-button {
          flex: 1;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
          min-height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .carousel-card-button:hover {
          background: #4338ca;
        }

        .input-container {
          padding: 16px 20px;
          background: white;
          border-top: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .message-input {
          flex: 1;
          height: 44px;
          padding: 0 16px;
          border: 2px solid #e5e7eb;
          border-radius: 22px;
          font-size: 15px;
          background: #f9fafb;
          transition: all 0.2s ease;
        }

        .message-input:focus {
          outline: none;
          border-color: #4f46e5;
          background: white;
        }

        .message-input::placeholder {
          color: #9ca3af;
        }

        .send-button {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #4f46e5;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          color: white;
          transition: all 0.2s ease;
        }

        .send-button:hover {
          background: #4338ca;
          transform: scale(1.05);
        }

        .send-button svg {
          width: 18px;
          height: 18px;
        }

        .attachment-button,
        .emoji-button {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .attachment-button:hover,
        .emoji-button:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .attachment-button svg,
        .emoji-button svg {
          width: 18px;
          height: 18px;
        }

        @media (max-width: 768px) {
          .conversation-view {
            height: 100vh;
            border-radius: 0;
          }
          
          .message-content {
            max-width: 85%;
          }
          
          .carousel-card {
            flex: 0 0 240px;
          }
          
          .message-card {
            max-width: 300px;
          }
        }
      `}</style>
    </div>
  );
};