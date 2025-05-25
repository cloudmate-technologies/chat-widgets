import { registerWebComponents } from './register';
import { parseChatbot, injectChatbotInWindow } from './window';

// Initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Register web components
  registerWebComponents();

  // Initialize chatbot
  const chatbot = parseChatbot();
  injectChatbotInWindow(chatbot);
});

// Export for module usage
export default parseChatbot;
