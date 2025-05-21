import { registerWebComponents } from './register';
import { parseChatbot, injectChatbotInWindow } from './window';

registerWebComponents();

const chatbot = parseChatbot();
console.log('chatbot', chatbot);
injectChatbotInWindow(chatbot);

export default chatbot;
