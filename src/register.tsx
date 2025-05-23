import { customElement } from 'solid-element';
import { defaultBotProps } from './constants';
import { Bubble } from './features/bubble';
import { Full } from './features/full';
import { ChatWidget } from './components/ChatWidget';

export const registerWebComponents = () => {
  if (typeof window === 'undefined') return;
  // @ts-expect-error element incorrect type
  customElement('autocampaign-fullchatbot', defaultBotProps, Full);
  customElement('autocampaign-chatbot', defaultBotProps, Bubble);
  // @ts-expect-error prop types
  customElement('autocampaign-chatwidget', { title: String, subtitle: String }, ChatWidget);
};
