type ConversationViewProps = {
    onClose: () => void;
    conversationTitle: string;
    onUpdateTitle: (newTitle: string) => void;
    onMessageSent: (text: string) => void;
    leadFormStatus?: boolean;
};
export declare const ConversationView: (props: ConversationViewProps) => import("solid-js").JSX.Element;
export {};
//# sourceMappingURL=ConversationView.d.ts.map