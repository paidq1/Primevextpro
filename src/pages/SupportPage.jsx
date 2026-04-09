import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SupportPage() {
  const [contacts, setContacts] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [adminReply, setAdminReply] = useState('');
  const [adminSending, setAdminSending] = useState(false);
  const bottomRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchChats = () =>
    fetch('https://quantyrexs.onrender.com/api/chat/all', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => {
        const list = Array.isArray(d) ? d : [];
        setContacts(list);
        if (selectedChat) {
          const updated = list.find(c => c._id === selectedChat._id);
          if (updated) setSelectedChat(updated);
        }
      }).catch(() => {});

  useEffect(() => { fetchChats(); const i = setInterval(fetchChats, 3000); return () => clearInterval(i); }, [selectedChat]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [selectedChat?.messages]);

  const sendReply = async () => {
    if (!adminReply?.trim() || adminSending) return;
    setAdminSending(true);
    try {
      const res = await fetch(`https://quantyrexs.onrender.com/api/chat/reply/${selectedChat._id}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ text: adminReply }) });
      const data = await res.json();
      setSelectedChat(data);
      setAdminReply('');
    } catch(e) {}
    setAdminSending(false);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#000', overflow: 'hidden', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: selectedChat ? '0px' : '100%', maxWidth: '280px', flexShrink: 0, background: '#0a0a0a', borderRight: '1px solid rgba(255,255,255,0.06)', overflowY: 'auto', transition: 'width 0.2s', overflow: 'hidden' }}>
        <div style={{ padding: '16px 12px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => navigate('/admin')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '18px', padding: '0' }}>←</button>
          <span style={{ color: 'white', fontWeight: '700', fontSize: '13px' }}>Support Chats</span>
          <span style={{ background: '#6366f1', color: 'white', fontSize: '9px', padding: '2px 7px', borderRadius: '10px', marginLeft: 'auto' }}>{contacts.length}</span>
        </div>
        {contacts.length === 0 && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', padding: '20px 12px' }}>No conversations yet</div>}
        {contacts.map((c, i) => (
          <div key={i} onClick={async () => {
            setSelectedChat(c);
            await fetch(`https://quantyrexs.onrender.com/api/chat/read/${c._id}`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } });
          }} style={{ padding: '12px 14px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.04)', background: selectedChat?._id === c._id ? 'rgba(99,102,241,0.15)' : 'transparent', borderLeft: selectedChat?._id === c._id ? '3px solid #6366f1' : '3px solid transparent' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'white', fontWeight: '700', flexShrink: 0 }}>{(c.name || c.email || 'U').slice(0,2).toUpperCase()}</div>
                <div>
                  <div style={{ color: 'white', fontSize: '11px', fontWeight: '600' }}>{c.name || c.email || 'User'}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px', marginTop: '1px' }}>{c.messages?.[c.messages.length-1]?.text?.slice(0,30) || 'Image'}{c.messages?.[c.messages.length-1]?.text?.length > 30 ? '...' : ''}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                {c.unreadAdmin > 0 && <span style={{ background: '#ef4444', color: 'white', fontSize: '8px', padding: '1px 5px', borderRadius: '8px' }}>{c.unreadAdmin}</span>}
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.visitorOnline ? '#22c55e' : 'transparent' }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#000', minWidth: 0 }}>
        {!selectedChat ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>Select a conversation</div>
        ) : (
          <>
            {/* Header */}
            <div style={{ background: '#0a0a0a', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button onClick={() => setSelectedChat(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '18px', padding: '0' }}>←</button>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'white', fontWeight: '700' }}>{(selectedChat.name || selectedChat.email || 'U').slice(0,2).toUpperCase()}</div>
              <div>
                <div style={{ color: 'white', fontSize: '12px', fontWeight: '700' }}>{selectedChat.name || selectedChat.email}</div>
                <div style={{ color: selectedChat.visitorOnline ? '#22c55e' : 'rgba(255,255,255,0.3)', fontSize: '9px' }}>{selectedChat.visitorOnline ? '● Online' : '○ Offline'}</div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                {selectedChat.status === 'open' && (
                  <button onClick={async () => {
                    await fetch(`https://quantyrexs.onrender.com/api/chat/resolve/${selectedChat._id}`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } });
                    fetchChats(); setSelectedChat(prev => ({ ...prev, status: 'resolved' }));
                  }} style={{ background: '#22c55e', border: 'none', color: 'white', fontSize: '9px', padding: '5px 12px', cursor: 'pointer', borderRadius: '4px' }}>Resolve</button>
                )}
                <button onClick={async () => {
                  if (!window.confirm('Delete?')) return;
                  await fetch(`https://quantyrexs.onrender.com/api/chat/delete/${selectedChat._id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
                  fetchChats(); setSelectedChat(null);
                }} style={{ background: '#ef4444', border: 'none', color: 'white', fontSize: '9px', padding: '5px 12px', cursor: 'pointer', borderRadius: '4px' }}>Delete</button>
              </div>
            </div>

            {/* User Info Panel */}
            <div style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: 'white', fontWeight: '700', flexShrink: 0 }}>
                {(selectedChat.name || selectedChat.email || 'U').slice(0,2).toUpperCase()}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ color: 'white', fontSize: '13px', fontWeight: '700' }}>{selectedChat.name || 'Unknown'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>
                  <svg width='10' height='10' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth='2'><path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'/><polyline points='22,6 12,13 2,6'/></svg>
                  {selectedChat.email}
                </div>
                {selectedChat.userInfo?.country && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>
                    <svg width='10' height='10' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth='2'><path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z'/><circle cx='12' cy='9' r='2.5'/></svg>
                    {selectedChat.userInfo.country}
                  </div>
                )}
                {selectedChat.userInfo?.device && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>
                    <svg width='10' height='10' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth='2'><rect x='5' y='2' width='14' height='20' rx='2'/></svg>
                    {selectedChat.userInfo.device}
                  </div>
                )}
                {selectedChat.userInfo?.browser && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>
                    <svg width='10' height='10' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth='2'><circle cx='12' cy='12' r='10'/><line x1='2' y1='12' x2='22' y2='12'/><path d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10'/></svg>
                    {selectedChat.userInfo.browser.includes('Chrome') ? 'Chrome' : selectedChat.userInfo.browser.includes('Firefox') ? 'Firefox' : selectedChat.userInfo.browser.includes('Safari') ? 'Safari' : 'Browser'}
                  </div>
                )}
                {selectedChat.userInfo?.page && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px' }}>
                    <svg width='10' height='10' fill='none' stroke='#6366f1' viewBox='0 0 24 24' strokeWidth='2'><path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71'/><path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'/></svg>
                    <span style={{ color: '#6366f1' }}>vertextradspro.vercel.app{selectedChat.userInfo.page}</span>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: selectedChat.visitorOnline ? '#22c55e' : 'rgba(255,255,255,0.3)', fontSize: '10px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: selectedChat.visitorOnline ? '#22c55e' : 'rgba(255,255,255,0.3)' }}></div>
                  {selectedChat.visitorOnline ? 'Online' : 'Offline'}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedChat.messages?.map((msg, i) => {
                const msgDate = new Date(msg.createdAt).toDateString();
                const prevDate = i > 0 ? new Date(selectedChat.messages[i-1].createdAt).toDateString() : null;
                const initials = (selectedChat.name || selectedChat.email || 'U').slice(0,2).toUpperCase();
                return (
                  <div key={i}>
                    {msgDate !== prevDate && (
                      <div style={{ textAlign: 'center', margin: '8px 0' }}>
                        <span style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', fontSize: '9px', padding: '3px 10px', borderRadius: '8px' }}>
                          {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: msg.sender === 'system' ? 'center' : msg.sender === 'admin' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: '6px' }}>
                      {msg.sender === 'system' ? (
                        <div style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', fontSize: '9px', padding: '4px 12px', borderRadius: '10px' }}>{msg.text} <span style={{ color: 'rgba(255,255,255,0.25)' }}>{new Date(msg.createdAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</span></div>
                      ) : msg.sender === 'user' ? (
                        <>
                          <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: 'white', fontWeight: '700', flexShrink: 0 }}>{initials}</div>
                          <div style={{ background: '#1c1c1c', color: 'white', fontSize: '11px', padding: '8px 12px', borderRadius: '8px 8px 8px 0', maxWidth: '65%', lineHeight: '1.5', wordBreak: 'break-word' }}>
                            {msg.image ? <a href={msg.image} target='_blank' rel='noopener noreferrer'><img src={msg.image} style={{ maxWidth: '200px', borderRadius: '6px', display: 'block', cursor: 'pointer' }} /></a> : msg.text}
                            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '8px', marginTop: '3px' }}>{new Date(msg.createdAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', maxWidth: '65%' }}>
                            <div style={{ background: '#4f46e5', color: 'white', fontSize: '11px', padding: msg.image ? '4px' : '8px 12px', borderRadius: '8px 8px 0 8px', lineHeight: '1.5', wordBreak: 'break-word' }}>
                              {msg.image ? <a href={msg.image} target='_blank' rel='noopener noreferrer'><img src={msg.image} style={{ maxWidth: '200px', borderRadius: '6px', display: 'block', cursor: 'pointer' }} /></a> : msg.text}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '8px' }}>{new Date(msg.createdAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</span>
                              <span style={{ color: msg.read ? '#22c55e' : 'rgba(255,255,255,0.4)', fontSize: '9px' }}>{msg.read ? '✓✓' : '✓'}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            {selectedChat.status === 'open' && (
              <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', background: '#0a0a0a', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="file" accept="image/*" id="supportImageUpload" style={{ display: 'none' }} onChange={async e => {
                  const file = e.target.files[0]; if (!file) return;
                  setAdminSending(true);
                  const fd = new FormData(); fd.append('image', file);
                  try {
                    const res = await fetch(`https://quantyrexs.onrender.com/api/chat/reply-image/${selectedChat._id}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
                    const data = await res.json(); setSelectedChat(data);
                  } catch(e) {}
                  setAdminSending(false); e.target.value = '';
                }} />
                <button onClick={() => document.getElementById('supportImageUpload').click()} style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '8px 10px', borderRadius: '6px', cursor: 'pointer', flexShrink: 0 }}>
                  <svg width='16' height='16' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth='2'><rect x='3' y='3' width='18' height='18' rx='2'/><circle cx='8.5' cy='8.5' r='1.5'/><polyline points='21,15 16,10 5,21'/></svg>
                </button>
                <input value={adminReply || ''} onChange={e => setAdminReply(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') sendReply(); }} placeholder="Type a message..." style={{ flex: 1, background: '#111', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '12px', padding: '10px 14px', outline: 'none', borderRadius: '6px' }} />
                <button onClick={sendReply} disabled={adminSending} style={{ background: adminSending ? '#4b5563' : '#6366f1', border: 'none', color: 'white', fontSize: '11px', padding: '10px 16px', cursor: 'pointer', borderRadius: '6px', fontWeight: '600' }}>{adminSending ? '...' : 'Send'}</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
