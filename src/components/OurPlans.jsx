import { useEffect, useRef, useState } from 'react';

const plans = [
  { tag: 'Min. 14% Daily', name: 'BRONZE', price: '$500', minReturn: '$500', maxReturn: '$5,000', roi: '14% Daily', duration: '7 days' },
  { tag: 'Min. 14% Daily', name: 'SILVER', price: '$5,000', minReturn: '$5,000', maxReturn: '$10,000', roi: '14% Daily', duration: '7 days' },
  { tag: 'Min. 10% Daily', name: 'GOLD', price: '$10,000', minReturn: '$10,000', maxReturn: '$25,000', roi: '10% Daily', duration: '7 days' },
  { tag: 'Min. 50% Weekly', name: 'PLATINUM', price: '$20,000', minReturn: '$20,000', maxReturn: '$50,000', roi: '50% Weekly', duration: '30 days' },
  { tag: 'Min. 100% Weekly', name: 'DIAMOND', price: '$50,000', minReturn: '$50,000', maxReturn: '$300,000', roi: '100% Weekly', duration: '30 days' },
  { tag: 'Min. 60% Weekly', name: 'ELITE', price: '$100,000', minReturn: '$100,000', maxReturn: '$1,000,000', roi: '60% Weekly', duration: '60 days' },
];

export default function OurPlans() {
  const ref = useRef(null);

  return (
    <>
      
      <section ref={ref} style={{ background: '#1e2530', width: '100%', boxSizing: 'border-box', padding: '24px 16px', overflow: 'hidden' }}>
        <div className="scroll-anim">

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: 'white', fontSize: '16px', fontWeight: '800', margin: '0 0 8px 0' }}>Our Plans</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px', lineHeight: '1.6', margin: '0 0 14px 0', maxWidth: '260px', marginLeft: 'auto', marginRight: 'auto' }}>
              Select from our tailored plans designed to meet the needs of every trader, investor, and crypto enthusiast.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button onClick={() => window.location.href="/signup"} style={{ background: '#6366f1', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '0px', fontSize: '8px', fontWeight: '600', cursor: 'pointer' }}>
                Get Started Today
              </button>
              <button style={{ background: 'transparent', border: '1px solid #6366f1', color: 'white', padding: '6px 12px', borderRadius: '0px', fontSize: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Explore More Plans
                <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            {plans.map((p, i) => (
              <div key={i} className={`scroll-anim delay-${i + 1}`} style={{ background: '#2e3840', borderRadius: '0px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                
                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#f87171', fontSize: '6px', fontWeight: '600' }}>{p.tag}</span>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="8" height="8" fill="none" stroke="white" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" strokeWidth="3"/>
                    </svg>
                  </div>
                </div>

                {/* Plan name */}
                <div style={{ color: 'white', fontWeight: '800', fontSize: '11px', letterSpacing: '0.5px' }}>{p.name}</div>
                
                {/* Price */}
                <div style={{ color: '#6366f1', fontWeight: '700', fontSize: '10px' }}>{p.price}</div>

                {/* Divider */}
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />

                {/* Details */}
                {[
                  ['Minimum Returns', p.minReturn],
                  ['Maximum Returns', p.maxReturn],
                  ['ROI', p.roi],
                  ['Duration', p.duration],
                ].map(([label, value], j) => (
                  <div key={j} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '6.5px' }}>{label}</span>
                    <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '6.5px', fontWeight: '500' }}>{value}</span>
                  </div>
                ))}

                {/* Button */}
                <button style={{ width: '100%', background: '#6366f1', border: 'none', color: 'white', padding: '8px', borderRadius: '0px', fontSize: '7px', fontWeight: '600', cursor: 'pointer', marginTop: '4px' }}>
                  Join Plan
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
