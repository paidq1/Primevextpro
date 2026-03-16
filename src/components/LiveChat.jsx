import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const API = 'https://vertextrades.onrender.com/api/chat';

export default function LiveChat() {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const bottomRef = useRef(null);

  const fetchChat = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API}/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setChat(data);
      if (data && !open) setUnread(data.unreadUser || 0);
    } catch (e) {}
  };

  useEffect(() => {
    fetchChat();
    const interval = setInterval(fetchChat, 5000);
    return () => clearInterval(interval);
  }, [token, open]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [open, chat]);

  const sendMessage = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      setChat(data);
      setText('');
    } catch (e) {}
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
      {open && (
        <div style={{ position: fullscreen ? 'fixed' : 'absolute', bottom: fullscreen ? 0 : '50px', right: fullscreen ? 0 : 0, top: fullscreen ? 0 : 'auto', left: fullscreen ? 0 : 'auto', width: fullscreen ? '100%' : '280px', height: fullscreen ? '100%' : 'auto', background: 'white', border: '1px solid rgba(99,102,241,0.4)', borderRadius: fullscreen ? '0' : '8px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', zIndex: 9999 }}>
          {/* Header */}
          <div style={{ background: '#6366f1', padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>Live Support</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '9px' }}>We typically reply within minutes</div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button onClick={() => setFullscreen(!fullscreen)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '12px' }}>{fullscreen ? '⊡' : '⛶'}</button>
              <button onClick={() => { setOpen(false); setFullscreen(false); }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px' }}>×</button>
            </div>
          </div>

          {/* Messages */}
          <div style={{ height: fullscreen ? 'calc(100vh - 115px)' : '220px', overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px', background: 'white' }}>
            {!chat || chat.messages?.length === 0 ? (
              <div style={{ color: 'rgba(0,0,0,0.3)', fontSize: '9px', textAlign: 'center', marginTop: '80px' }}>
                Send a message to start chatting
              </div>
            ) : (chat?.messages || []).map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  background: msg.sender === 'user' ? '#6366f1' : '#f3f4f6',
                  color: msg.sender === 'user' ? 'white' : '#1f2937', fontSize: '9px', padding: '6px 10px',
                  borderRadius: msg.sender === 'user' ? '8px 8px 0 8px' : '8px 8px 8px 0',
                  maxWidth: '75%', lineHeight: '1.4'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '8px', borderTop: '1px solid rgba(0,0,0,0.1)', display: 'flex', gap: '6px', background: 'white', position: fullscreen ? 'fixed' : 'relative', bottom: fullscreen ? 0 : 'auto', left: fullscreen ? 0 : 'auto', right: fullscreen ? 0 : 'auto', zIndex: 10000 }}>
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              style={{ flex: 1, background: '#f3f4f6', border: '1px solid rgba(0,0,0,0.1)', color: '#1f2937', fontSize: '9px', padding: '6px 8px', outline: 'none', borderRadius: '4px' }}
            />
            <button onClick={sendMessage} disabled={loading} style={{ background: '#6366f1', border: 'none', color: 'white', fontSize: '9px', padding: '6px 10px', cursor: 'pointer', borderRadius: '4px', fontWeight: '600' }}>
              {loading ? '...' : 'Send'}
            </button>
          </div>
        </div>
      )}

      {/* Bubble */}
      <button onClick={() => setOpen(!open)} style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#6366f1', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(99,102,241,0.5)', position: 'relative' }}>
        <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
        {unread > 0 && (
          <div style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: 'white', fontSize: '8px', fontWeight: '700', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {unread}
          </div>
        )}
      </button>
    </div>
  );
}
