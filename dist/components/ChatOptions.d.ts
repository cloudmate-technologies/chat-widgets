import { JSX } from 'solid-js';
type ChatOption = {
    title: string;
    description: string;
    icon: (props: {
        class?: string;
    }) => JSX.Element;
    iconBgColor: string;
    action?: () => void;
    actionText?: string;
    showArrow?: boolean;
};
type ChatOptionsProps = {
    options: ChatOption[];
};
export declare const ChatOptions: (props: ChatOptionsProps) => JSX.Element;
export {};
//# sourceMappingURL=ChatOptions.d.ts.map