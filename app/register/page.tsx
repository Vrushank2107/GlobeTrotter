'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useTripContext } from '@/context/TripContext';

export default function RegisterPage() {
  const router = useRouter();
  const { refreshData } = useTripContext();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '419997250020-qu70plcjrmcfkhdchr6qrj3ptcs3sdgi.apps.googleusercontent.com';

    const handleGoogleCallback = async (response: any) => {
      setLoading(true);
      setErrorMsg('');
      try {
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: response.credential }),
        });
        const data = await res.json();
        if (data?.success) {
          await refreshData();
          router.push('/dashboard');
        } else {
          setErrorMsg(data?.message || 'Google Sign-In failed.');
        }
      } catch {
        setErrorMsg('Failed to sign in with Google.');
      } finally {
        setLoading(false);
      }
    };

    const initGoogle = () => {
      if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
        (window as any).google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCallback,
        });

        const btnDiv = document.getElementById('google-btn-container-register');
        if (btnDiv) {
          btnDiv.innerHTML = '';
          (window as any).google.accounts.id.renderButton(btnDiv, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'continue_with',
            shape: 'rectangular',
          });
        }
      }
    };

    if (typeof window !== 'undefined') {
      if (!(window as any).google?.accounts?.id) {
        const script = document.createElement('script');
        script.id = 'google-gsi-reg';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = initGoogle;
        document.body.appendChild(script);
      } else {
        initGoogle();
      }
    }
  }, [router, refreshData]);

  const handleGoogleManualClick = () => {
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      (window as any).google.accounts.id.prompt();
    } else {
      router.push('/dashboard');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (data?.success) {
        await refreshData();
        router.push('/dashboard');
      } else {
        setErrorMsg(data?.message || 'Registration failed');
      }
    } catch {
      setErrorMsg('Failed to create account');
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

          {/* Top Navigation Bar */}
          <header style={{
            position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
            padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            maxWidth: '1280px', margin: '0 auto', width: '100%'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: '#006591', fontSize: '28px' }}>explore</span>
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#191c1e', letterSpacing: '-0.02em' }}>GlobeTrotter</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link href="/login" style={{
                padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 500,
                color: '#006591', textDecoration: 'none', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)',
              }}>Sign In</Link>
              <Link href="/register" style={{
                padding: '8px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600,
                color: '#ffffff', textDecoration: 'none', background: '#006591',
                boxShadow: '0 2px 8px rgba(0,101,145,0.25)', transition: 'all 0.2s',
              }}>Sign Up</Link>
            </div>
          </header>

          {/* Main content grid */}
          <div style={{
            position: 'relative', zIndex: 10, width: '100%', maxWidth: '1280px',
            margin: '0 auto', padding: '96px 16px 32px 16px', minHeight: '100vh',
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
                    Start Your Adventure
                  </span>
                </div>

                {/* Headline */}
                <h1 style={{
                  fontSize: '48px', lineHeight: '56px', fontWeight: 700, letterSpacing: '-0.02em',
                  color: '#191c1e', marginBottom: '16px', maxWidth: '560px',
                }}>
                  Join thousands of{' '}
                  <span style={{ background: 'linear-gradient(to right, #006591, #39b8fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    globe trotters
                  </span>{' '}
                  today.
                </h1>

                {/* Subtext */}
                <p style={{
                  fontSize: '18px', lineHeight: '28px', color: '#45464d',
                  marginBottom: '32px', maxWidth: '448px',
                }}>
                  Create your account to start crafting custom travel routes, managing group budgets, and discovering hidden gems worldwide.
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

              {/* Right: Register card */}
              <div style={{ gridColumn: '8 / span 5', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.90)', backdropFilter: 'blur(24px)',
                  borderRadius: '16px', padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#191c1e', marginBottom: '8px' }}>Create an Account</h2>
                  <p style={{ fontSize: '14px', color: '#45464d', marginBottom: '24px' }}>Sign up to start building custom itineraries & budgets.</p>

                  {errorMsg && (
                    <div style={{ padding: '8px 12px', borderRadius: '8px', background: '#fee2e2', color: '#991b1b', fontSize: '12px', marginBottom: '16px' }}>
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Name field */}
                    <div>
                      <label htmlFor="name" style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#45464d', marginBottom: '6px' }}>
                        Full Name
                      </label>
                      <div style={{ position: 'relative' }}>
                        <span className="material-symbols-outlined" style={{
                          position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                          color: 'rgba(69,70,77,0.5)', fontSize: '20px',
                        }}>person</span>
                        <input
                          id="name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Alex Morgan"
                          style={{
                            width: '100%', background: '#eceef0', border: 'none', borderRadius: '8px',
                            padding: '12px 12px 12px 40px', fontSize: '16px', color: '#191c1e',
                            outline: 'none', transition: 'background 0.2s',
                            fontFamily: 'Inter, sans-serif',
                          }}
                        />
                      </div>
                    </div>

                    {/* Email field */}
                    <div>
                      <label htmlFor="email" style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#45464d', marginBottom: '6px' }}>
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
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="alex@example.com"
                          style={{
                            width: '100%', background: '#eceef0', border: 'none', borderRadius: '8px',
                            padding: '12px 12px 12px 40px', fontSize: '16px', color: '#191c1e',
                            outline: 'none', transition: 'background 0.2s',
                            fontFamily: 'Inter, sans-serif',
                          }}
                        />
                      </div>
                    </div>

                    {/* Password field */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label htmlFor="password" style={{ fontSize: '12px', fontWeight: 500, color: '#45464d' }}>
                          Password
                        </label>
                      </div>
                      <div style={{ position: 'relative' }}>
                        <span className="material-symbols-outlined" style={{
                          position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                          color: 'rgba(69,70,77,0.5)', fontSize: '20px',
                        }}>lock</span>
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          required
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

                    {/* Sign Up button */}
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
                      <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                    </button>
                  </form>

                  {/* Divider */}
                  <div style={{ margin: '24px 0', position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: '100%', height: '1px', background: '#c6c6cd' }} />
                    </div>
                    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                      <span style={{ background: 'rgba(255,255,255,0.90)', padding: '0 16px', fontSize: '12px', color: '#45464d' }}>
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* OAuth buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                    <div id="google-btn-container-register" style={{ width: '100%', minHeight: '40px', display: 'flex', justifyContent: 'center' }}>
                      <button type="button" onClick={handleGoogleManualClick} style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        padding: '10px', borderRadius: '8px', background: '#f2f4f6',
                        border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: '#191c1e',
                        fontFamily: 'Inter, sans-serif', transition: 'background 0.2s',
                      }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span>Continue with Google</span>
                      </button>
                    </div>
                  </div>

                  {/* Sign in link */}
                  <div style={{ marginTop: '16px', textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', color: '#45464d' }}>
                      Already have an account?{' '}
                      <Link href="/login" style={{ fontSize: '12px', fontWeight: 500, color: '#006591', textDecoration: 'none' }}>Sign in</Link>
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Location badge bottom-left */}
          <div style={{
            position: 'absolute', bottom: '16px', left: '16px', zIndex: 10,
            display: 'flex', alignItems: 'center', gap: '8px',
            color: 'rgba(69,70,77,0.70)',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>location_on</span>
            <span style={{ fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Patagonia, Argentina
            </span>
          </div>

        </div>
      </main>
    </>
  );
}
