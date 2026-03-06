import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircleHeart, X, Send, Loader2, Bot, User, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

type Msg = { role: 'user' | 'assistant'; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cvd-chat`;

export default function HealthChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const streamChat = useCallback(async (allMessages: Msg[]) => {
    setIsLoading(true);
    setError(null);
    let assistantSoFar = '';

    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: 'assistant', content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (resp.status === 429) { setError('Rate limited. Please wait a moment.'); setIsLoading(false); return; }
      if (resp.status === 402) { setError('AI credits exhausted.'); setIsLoading(false); return; }
      if (!resp.ok || !resp.body) { setError('Service unavailable. Try again.'); setIsLoading(false); return; }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        let nl: number;
        while ((nl = buf.indexOf('\n')) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') break;
          try {
            const parsed = JSON.parse(json);
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) upsert(c);
          } catch { /* partial json */ }
        }
      }
    } catch (e) {
      console.error(e);
      setError('Connection error. Please try again.');
    }
    setIsLoading(false);
  }, []);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    const userMsg: Msg = { role: 'user', content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    streamChat(updated);
  };

  const quickPrompts = [
    '💓 How to lower blood pressure?',
    '🥗 Heart-healthy diet tips',
    '🏃 Exercise for heart health',
    '⚠️ CVD warning signs',
  ];

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
            aria-label="Open health chatbot"
          >
            <MessageCircleHeart className="h-6 w-6" />
            <span className="absolute inset-0 rounded-full bg-primary/40 pulse-ring" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-6rem)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-sm">CardioGuard AI</p>
                  <p className="text-[10px] opacity-80">CVD Health Assistant</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-primary-foreground/20 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <ScrollArea className="flex-1 p-4" ref={scrollRef as any}>
              {messages.length === 0 ? (
                <div className="space-y-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <MessageCircleHeart className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-foreground">Hello! 👋</p>
                    <p className="text-xs text-muted-foreground mt-1">I'm your CVD health assistant. Ask me anything about heart health.</p>
                  </div>
                  <div className="space-y-2">
                    {quickPrompts.map(q => (
                      <button key={q} onClick={() => setInput(q)} className="block w-full text-left text-xs bg-muted hover:bg-accent rounded-lg px-3 py-2 transition-colors text-foreground">{q}</button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'assistant' && (
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                          <Bot className="h-3 w-3 text-primary" />
                        </div>
                      )}
                      <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-muted text-foreground rounded-bl-md'}`}>
                        {msg.role === 'assistant' ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:my-1 [&>ul]:my-1 [&>ol]:my-1 [&>li]:my-0.5">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        ) : msg.content}
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                    <div className="flex gap-2 items-center">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-3 w-3 text-primary" />
                      </div>
                      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {error && (
              <div className="mx-4 mb-2 p-2 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-xs text-destructive">
                <AlertTriangle className="h-3 w-3 shrink-0" />
                {error}
                <button onClick={() => setError(null)} className="ml-auto"><X className="h-3 w-3" /></button>
              </div>
            )}

            <div className="p-3 border-t border-border shrink-0 bg-card">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Ask about heart health..."
                  rows={1}
                  className="flex-1 resize-none bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary max-h-24"
                />
                <Button size="icon" onClick={handleSend} disabled={!input.trim() || isLoading} className="shrink-0 h-9 w-9 rounded-lg">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-[9px] text-muted-foreground text-center mt-2">General health info only • Not medical advice • Consult your doctor</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
