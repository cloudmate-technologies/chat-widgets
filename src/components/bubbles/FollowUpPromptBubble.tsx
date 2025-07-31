type Props = {
  prompt: string;
  onPromptClick?: () => void;
  starterPromptFontSize?: number;
};
export const FollowUpPromptBubble = (props: Props) => (
  <>
    <div
      data-modal-target="defaultModal"
      data-modal-toggle="defaultModal"
      class="flex justify-start items-start animate-fade-in gap-1 host-container hover:brightness-90 active:brightness-75"
      onClick={() => props.onPromptClick?.()}
    >
      <span
        class="px-2 py-1 whitespace-pre-wrap chatbot-host-bubble border inline-block"
        data-testid="host-bubble"
        style={{
          'max-width': '100%',
          'word-wrap': 'break-word',
          'word-break': 'break-word',
          'font-size': props.starterPromptFontSize ? `${props.starterPromptFontSize}px` : '15px', // Convert to string with unit
          'border-radius': '15px',
          cursor: 'pointer',
        }}
      >
        {props.prompt}
      </span>
    </div>
  </>
);
