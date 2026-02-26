export default function ChatButton() {
  const openChat = () => {
    if (window.smartsupp) {
      window.smartsupp('chat:open');
    } else {
      window.open('https://www.smartsupp.com', '_blank');
    }
  };

  return (
    <div onClick={openChat} style={{
      position: 'fixed', bottom: '20px', right: '20px', zIndex: 99999,
      width: '50px', height: '50px', borderRadius: '50%',
      background: '#6366f1', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 20px rgba(99,102,241,0.5)'
    }}>
      <svg width="22" height="22" fill="none" stroke="white" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    </div>
  );
}
