import { registerWebComponents } from './register';
import { parseChatbot, injectChatbotInWindow } from './window';
import './assets/index.css';

// Initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Register web components
  registerWebComponents();

  // Initialize chatbot
  const chatbot = parseChatbot();
  injectChatbotInWindow(chatbot);

  // Ensure Tailwind is available in shadow DOM
  const tailwindLink = document.createElement('link');
  tailwindLink.href = 'https://cdn.tailwindcss.com';
  tailwindLink.rel = 'stylesheet';
  document.head.appendChild(tailwindLink);

  // Add custom properties for the chat widget
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --chatbot-font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      --chatbot-primary-color: #3b82f6;
      --chatbot-primary-hover: #2563eb;
      --chatbot-bg-color: white;
      --chatbot-text-color: #1f2937;
    }
  `;
  document.head.appendChild(style);
});

// Export for module usage
export default parseChatbot();
