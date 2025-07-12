import { createPortal } from "react-dom";
import BluePotteryChatbot from "./BluePotteryChatbot";

const ChatbotPortal = () => {
  return createPortal(<BluePotteryChatbot />, document.body);
};

export default ChatbotPortal;
