'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('demo@globetrotter.com');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const contentType = res.headers.get('content-type');
      const data = contentType && contentType.includes('application/json') ? await res.json() : null;
      if (data?.success) {
        router.push('/dashboard');
      } else {
        setErrorMsg(data?.message || 'Authentication failed');
        // Fallback for hackathon demo
        router.push('/dashboard');
      }
    } catch (err) {
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { overscroll-behavior: none; }
        ::-webkit-scrollbar { display: none; }

        body {
          font-family: 'Inter', system-ui, sans-serif;
          background-color: #f7f9fb;
          color: #191c1e;
          min-height: 100vh;
        }

        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-weight: normal;
          font-style: normal;
          font-size: 24px;
          line-height: 1;
          letter-spacing: normal;
          text-transform: none;
          display: inline-block;
          white-space: nowrap;
          word-wrap: normal;
          direction: ltr;
          -webkit-font-smoothing: antialiased;
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          user-select: none;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <main style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', position: 'relative', minHeight: '100vh' }}>

          {/* Background Hero Image */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundImage: `url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'absolute',
                inset: 0,
              }}
            />
            {/* Left gradient overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to right, rgba(247,249,251,0.95) 0%, rgba(247,249,251,0.80) 50%, transparent 100%)',
            }} />
            {/* Bottom gradient overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, transparent 0%, transparent 60%, rgba(247,249,251,0.50) 100%)',
            }} />
          </div>

          {/* Main content grid */}
          <div style={{
            position: 'relative', zIndex: 10, width: '100%', maxWidth: '1280px',
            margin: '0 auto', padding: '32px 16px', minHeight: '100vh',
            display: 'flex', alignItems: 'center',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: '24px',
              width: '100%',
            }}>

              {/* Left: Hero copy */}
              <div className="animate-fade-in-up" style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {/* Badge */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(230,232,234,0.5)', backdropFilter: 'blur(12px)',
                  padding: '8px 16px', borderRadius: '9999px', width: 'fit-content',
                  marginBottom: '16px',
                }}>
                  <span className="material-symbols-outlined" style={{ color: '#006591', fontSize: '16px' }}>flight_takeoff</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#45464d', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Journey Awaits
                  </span>
                </div>

                {/* Headline */}
                <h1 style={{
                  fontSize: '48px', lineHeight: '56px', fontWeight: 700, letterSpacing: '-0.02em',
                  color: '#191c1e', marginBottom: '16px', maxWidth: '560px',
                }}>
                  Plan your perfect{' '}
                  <span style={{ background: 'linear-gradient(to right, #006591, #39b8fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    multi-city
                  </span>{' '}
                  journey in minutes.
                </h1>

                {/* Subtext */}
                <p style={{
                  fontSize: '18px', lineHeight: '28px', color: '#45464d',
                  marginBottom: '32px', maxWidth: '448px',
                }}>
                  The expert concierge for complex itineraries. Seamlessly synchronize flights, stays, and budgets without the cognitive overload.
                </p>

                {/* Social proof avatars */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex' }}>
                    {[
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
                    ].map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt="Traveler"
                        style={{
                          width: '40px', height: '40px', borderRadius: '9999px',
                          objectFit: 'cover', boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                          border: '2px solid #f7f9fb',
                          marginLeft: i === 0 ? '0' : '-12px',
                        }}
                      />
                    ))}
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '9999px',
                      backgroundColor: '#39b8fd', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.15)', border: '2px solid #f7f9fb',
                      marginLeft: '-12px',
                    }}>
                      <span style={{ fontSize: '12px', fontWeight: 500, color: '#004666' }}>+2k</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '14px', color: '#45464d' }}>Trusted by expert travelers globally.</p>
                </div>
              </div>

              {/* Right: Login card */}
              <div style={{ gridColumn: '8 / span 5', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.90)', backdropFilter: 'blur(24px)',
                  borderRadius: '16px', padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#191c1e', marginBottom: '8px' }}>Welcome back</h2>
                  <p style={{ fontSize: '14px', color: '#45464d', marginBottom: '32px' }}>Enter your details to access your itineraries.</p>

                  {errorMsg && (
                    <div style={{ padding: '10px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', fontSize: '12px', marginBottom: '16px' }}>
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Email */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label htmlFor="email" style={{ fontSize: '12px', fontWeight: 500, color: '#45464d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Email address
                      </label>
                      <div style={{ position: 'relative' }}>
                        <span className="material-symbols-outlined" style={{
                          position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                          color: 'rgba(69,70,77,0.5)', fontSize: '20px',
                        }}>mail</span>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@company.com"
                          style={{
                            width: '100%', background: '#eceef0', border: 'none', borderRadius: '8px',
                            padding: '12px 16px 12px 40px', fontSize: '16px', color: '#191c1e',
                            outline: 'none', transition: 'background 0.2s',
                            fontFamily: 'Inter, sans-serif',
                          }}
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <label htmlFor="password" style={{ fontSize: '12px', fontWeight: 500, color: '#45464d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Password
                        </label>
                        <a href="#" style={{ fontSize: '12px', fontWeight: 500, color: '#006591', textDecoration: 'none' }}>Forgot password?</a>
                      </div>
                      <div style={{ position: 'relative' }}>
                        <span className="material-symbols-outlined" style={{
                          position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                          color: 'rgba(69,70,77,0.5)', fontSize: '20px',
                        }}>lock</span>
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          style={{
                            width: '100%', background: '#eceef0', border: 'none', borderRadius: '8px',
                            padding: '12px 40px 12px 40px', fontSize: '16px', color: '#191c1e',
                            outline: 'none', transition: 'background 0.2s',
                            fontFamily: 'Inter, sans-serif',
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                            color: 'rgba(69,70,77,0.5)',
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                            {showPassword ? 'visibility' : 'visibility_off'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Sign In button */}
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        width: '100%', background: '#006591', color: '#fff',
                        border: 'none', borderRadius: '8px', padding: '12px 24px',
                        fontSize: '14px', fontWeight: 600, letterSpacing: '0.05em',
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', gap: '8px',
                        boxShadow: '0 4px 16px rgba(0,101,145,0.25)',
                        transition: 'all 0.2s', marginTop: '8px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  );
}
