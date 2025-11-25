// Main component
export { ChatWithAI } from "./ChatWithAI";
export type { ChatWithAIProps, ChatAPIConfig, ChatMessage } from "./ChatWithAI";

// Pre-configured setups
export {
    srsDocumentChatConfig,
    diagramChatConfig,
    wireframeChatConfig,
    createGenericChatConfig,
    createFormDataChatConfig,
} from "./chat-configs";

// Legacy ChatBot (if still needed)
export { default as ChatBot } from "./ChatBot";
