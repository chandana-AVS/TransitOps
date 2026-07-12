import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { api } from "../../api/client";
import { useAuth } from "../auth/AuthProvider";
import Button from "../../components/ui/Button";

const CHANNELS = [
  { id: "support-direct", name: "Fleet Manager", desc: "Direct message with Fleet Manager" },
  { id: "general", name: "General", desc: "General operations chat" },
];

export default function ChatPage() {
  const { user } = useAuth();
  const [activeChannel, setActiveChannel] = useState("support-direct");
  const [typedMessage, setTypedMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const receiverId = activeChannel === "support-direct" ? 1 : null;

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");
    const socket = io("http://localhost:3001", {
      auth: { token },
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      if (receiverId) socket.emit("join:dm", receiverId);
    });

    socket.on("new:message", (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    return () => { socket.disconnect(); };
  }, [user, receiverId]);

  useEffect(() => {
    const url = receiverId ? `/chat/messages?receiverId=${receiverId}` : "/chat/messages";
    api.get(url).then((data) => {
      setMessages(data || []);
    }).catch(() => setMessages([]));
  }, [receiverId]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!typedMessage.trim() || !socketRef.current?.connected) return;
    socketRef.current.emit("send:message", { message: typedMessage, receiverId });
    setTypedMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-[calc(100vh-8rem)] flex rounded-2xl border border-surface-200/80 dark:border-surface-800 bg-white dark:bg-surface-900 overflow-hidden shadow-sm animate-fade-in">
      <div className="w-56 border-r border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-950/30 flex flex-col">
        <div className="p-4 border-b border-surface-200 dark:border-surface-800">
          <h2 className="text-sm font-bold text-surface-900 dark:text-white uppercase tracking-wider">Chat</h2>
        </div>
        <div className="flex-1 p-2 space-y-1 overflow-y-auto">
          {CHANNELS.map((ch) => (
            <button key={ch.id} onClick={() => setActiveChannel(ch.id)}
              className={`w-full flex flex-col items-start p-3 rounded-xl transition-all text-left ${
                activeChannel === ch.id
                  ? "bg-primary-500/10 text-primary-600 dark:text-primary-300 border border-primary-500/20"
                  : "text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800/50"
              }`}
            >
              <span className="text-xs font-bold">{ch.name}</span>
              <span className="text-[10px] text-surface-500 mt-0.5 truncate w-full">{ch.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white dark:bg-surface-900">
        <div className="p-4 border-b border-surface-200 dark:border-surface-800 bg-surface-50/20 dark:bg-surface-950/10">
          <h3 className="text-sm font-bold text-surface-900 dark:text-white">
            {CHANNELS.find((c) => c.id === activeChannel)?.name}
          </h3>
          <p className="text-xs text-surface-500">{CHANNELS.find((c) => c.id === activeChannel)?.desc}</p>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-surface-400 space-y-2">
              <svg className="w-12 h-12 stroke-current opacity-30" fill="none" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-xs">No messages yet. Start a conversation.</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isSelf = msg.senderId === user?.id;
              return (
                <div key={msg.id} className={`flex gap-3 max-w-[80%] ${isSelf ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold select-none ${
                    isSelf ? "bg-primary-600 text-white" : "bg-surface-200 dark:bg-surface-800 text-surface-700 dark:text-surface-300"
                  }`}>
                    {msg.sender?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="space-y-1">
                    <div className={`flex items-baseline gap-2 ${isSelf ? "justify-end" : ""}`}>
                      <span className="text-[10px] font-bold text-surface-700 dark:text-surface-300">{msg.sender?.name}</span>
                      <span className="text-[9px] text-surface-500 font-mono">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      isSelf
                        ? "bg-primary-500 text-white rounded-tr-none"
                        : "bg-surface-100 dark:bg-surface-800/80 text-surface-800 dark:text-surface-200 rounded-tl-none border border-surface-200/50 dark:border-surface-700/50"
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-3 border-t border-surface-200 dark:border-surface-800 bg-surface-50/30 dark:bg-surface-950/20 flex gap-2">
          <input type="text" value={typedMessage} onChange={(e) => setTypedMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-600 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 rounded-xl text-xs text-surface-900 dark:text-white focus:outline-none transition-all placeholder-surface-400"
          />
          <Button type="submit" size="sm">Send</Button>
        </form>
      </div>
    </div>
  );
}
