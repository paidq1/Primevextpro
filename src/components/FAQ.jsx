import { useState, useRef, useEffect } from 'react';

const faqs = [
  {
    question: 'How do I create an account on your platform?',
    answer: "To create an account, click on the 'Sign Up' button at the top right corner of the homepage. Fill in the required information, verify your email, and you're all set!",
  },
  {
    question: 'What are the trading fees on your platform?',
    answer: 'Our trading fees are competitive and transparent. We charge a small percentage per trade with no hidden costs. Check our pricing page for detailed information.',
  },
  {
    question: 'How can I stake my cryptocurrency?',
    answer: 'To stake your cryptocurrency, navigate to the Staking section, select your preferred coin, choose a staking plan, and confirm your investment. Rewards are paid automatically.',
  },
  {
    question: 'Is my account secure?',
    answer: 'Yes, we use industry-leading security measures including 2FA, SSL encryption, and cold storage for funds to ensure your account and assets are always protected.',
  },
  {
    question: 'How do I withdraw my funds?',
    answer: 'To withdraw funds, go to your wallet, click Withdraw, enter the amount and destination address, and confirm. Withdrawals are processed within 24 hours.',
  },
];

const FAQ = () => {
  const ref = useRef(null);
  const faqRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <><section id="faq" className="scroll-anim" ref={faqRef} style={{ background: '#151c27', width: '100%', boxSizing: 'border-box', padding: '32px 16px', position: 'relative', overflow: 'hidden' }}>

      {/* Network graph top left */}
      <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '150px', height: '150px', background: 'radial-gradient(circle at 40% 40%, rgba(80,60,220,0.3) 0%, rgba(60,40,180,0.12) 40%, transparent 70%)', borderRadius: '50%', filter: 'blur(25px)', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', top: '-8px', left: '0px', width: '90px', height: '90px', opacity: 0.9 }}>
        <img src='/network-graph.png' style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'relative', zIndex: 1 }} />
      </div>

      {/* Network graph bottom right */}
      <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '150px', height: '150px', background: 'radial-gradient(circle at 60% 60%, rgba(80,60,220,0.3) 0%, rgba(60,40,180,0.12) 40%, transparent 70%)', borderRadius: '50%', filter: 'blur(25px)', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '-8px', right: '0px', width: '90px', height: '90px', opacity: 0.9, transform: 'rotate(180deg)' }}>
        <img src='/network-graph.png' style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'relative', zIndex: 1 }} />
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
        <h2 style={{ color: 'white', fontWeight: '700', fontSize: 'clamp(14px, 4vw, 20px)', marginBottom: '8px' }}>Frequently Asked Questions</h2>
        <p style={{ color: '#94a3b8', fontSize: 'clamp(9px, 2.5vw, 12px)', lineHeight: '1.6', maxWidth: '320px', margin: '0 auto' }}>
          Find answers to the most common questions about trading, staking, account management, and more.
        </p>
      </div>

      {/* FAQ Container */}
      <div style={{
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px',
        padding: '24px 16px', maxWidth: '420px', margin: '0 auto',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {faqs.map((faq, index) => (
            <div key={index} className={`scroll-anim delay-${(index % 5) + 1}`} style={{ animationDelay: index * 0.1 + 's',
              background: '#3d5060', borderRadius: '0px', overflow: 'hidden',
            }}>
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  padding: '10px', gap: '6px',
                }}
              >
                <span style={{ color: 'white', fontSize: 'clamp(9px, 2.2vw, 11px)', fontWeight: '600', textAlign: 'left' }}>{faq.question}</span>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ color: 'white', fontSize: '16px', lineHeight: 1 }}>{openIndex === index ? '−' : '+'}</span>
                </div>
              </button>
              {openIndex === index && (
                <p style={{ color: '#94a3b8', fontSize: 'clamp(8px, 2vw, 15px)', lineHeight: '1.6', padding: '0 10px 10px 10px', margin: 0 }}>
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ width: '160px', height: '1px', background: 'rgba(255,255,255,0.15)', margin: '24px auto 0' }} />
      </div>

      {/* Need More Help Card */}
      <div style={{ animationDelay: '0.6s',
        maxWidth: '420px', margin: '24px auto 0',
        background: '#3d5060', borderRadius: '0px',
        padding: '24px 16px', display: 'flex', alignItems: 'center', gap: '16px',
        position: 'relative', zIndex: 1,
      }}>
        {/* Illustration */}
        <div style={{ flexShrink: 0, width: 'clamp(80px, 20vw, 130px)', height: 'clamp(80px, 20vw, 130px)', position: 'relative' }}><div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '150px', height: '160px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.7) 0%, transparent 70%)', zIndex: 0 }} />
          <img src='/faq-illustration.png' style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'relative', zIndex: 1 }} />
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{ color: 'white', fontWeight: '700', fontSize: 'clamp(11px, 3vw, 15px)', marginBottom: '8px' }}>Need More Help? Contact Us</h3>
          <p style={{ color: '#94a3b8', fontSize: 'clamp(7px, 1.8vw, 15px)', lineHeight: '1.6', marginBottom: '12px' }}>
            If you didn't find the answer you were looking for, our support team is here to help. Reach out to us directly for more assistance or explore our detailed support resources.
          </p>
          <button onClick={() => window.location.href='/signup'} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: '#6366f1', border: 'none', borderRadius: '4px',
            color: 'white', fontSize: 'clamp(8px, 2vw, 15px)', fontWeight: '600',
            padding: '8px 14px', cursor: 'pointer',
          }}>
            Reach Out Now
            <svg width="10" height="10" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </button>
        </div>
      </div>

    </section></>
  );
};

export default FAQ;
