type ConversationViewProps = {
    onClose: () => void;
    onUpdateTitle: (newTitle: string) => void;
    onMessageSent: (text: string) => void;
    leadFormStatus?: boolean;
    chatConfig?: any;
};
export declare const ConversationView: (props: ConversationViewProps) => import("solid-js").JSX.Element;
export {};
//# sourceMappingURL=ConversationView.d.ts.map