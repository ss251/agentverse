// pages/chat.tsx

import React from "react";
import ChatInterface from "../ui/ChatInterface";

const ChatPage = () => {

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold text-center">Chat with Your Agent</h1>
      <ChatInterface />
    </div>
  );
};

export default ChatPage;
