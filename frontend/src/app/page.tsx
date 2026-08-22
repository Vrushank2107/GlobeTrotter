'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
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
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDvikO414axUhexyfepdeHTt0pHTTLu61B_EuQNmZd190wzM0K2Y111yy2LHh6ITc5dTMIkxrKvDkVWBH4zAhHhDl24Zv-DJMQYmYaC1uywzAoVQxb9PW_wraP1aiY3aBSeAbA9vcAtxe0xNx2twRsOTy8CDYYXpFpX3eDyX402fBv8KPzmpplKBDVjps8-Fw_IFne0xQh7qCK8kkYQV3n3uTmTIOxoF-ED4unp33Kceu3oNV9D7QMhxg')`,
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
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuArYptmIpqXbge6sxmqrDyEv8WAectrFHcy7Sye-zgfmc2y_F4GzYZw6k7OUR_Q8gjQgJSoILutrn3ggUHxR8ukRJ9KTAMfx8T1y-hjr-uRT0BZ0l_irlIU2IUHcMiu4s_h3r_7aR9wlva4i53BXDa9-meK12znUQarNYwqKDjbMNBufSexAWYC-8EuVvOk0Iczk4Jyl0aiE_zDNs0wWYyFNaOjCKnsT5Dc4_W686jwAeD-fSayGd2VEQ',
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuByL2v0GyCtfK6OfT8P_gX5zyw-aCWRwu7aXATIKLq-K77gUz2KepCOyh6F9wB1J2_KXlKT36MMG5dlh3_VHMgu-9rEr0IugPz4KX4ryG2f5-GbmiNmcKphEapj_LGo787HRN791OM7qQv0lGzvXTYY4ZzNSgPCuE2yfMLHxAz0_heimEQGhooa6OY6ixNdqdo9TOA1SzWnA5I9IRuHZf_wFhsLB_dF09ZyUN7FufBRf0C0ZLJJGljjCQ',
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuDZ28-g68ambpqteEvRGAjJNX1wC2xySeODGK9wVbC-eXQzoPHyhCSDgmo27G6cd6C5o4oFcSEsXbr4HV4zOWGnbebG5HJGZO-bpgHqGyKcDIxb1zsqrUCkjThR1TdmboBsLNPdoVisOof83NsudJ38UpmalU1CYObUhjNAGT6C9m9JG6VGOywjELZN6DbheTdrR8aQM6-nyDZnKB1ItFfPO5n4XS-f2MKCmDzMSdrvyemiyToTnefqsA',
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
                  transition: 'box-shadow 0.3s',
                }}>
                  {/* Decorative blob */}
                  <div style={{
                    position: 'absolute', top: '-40px', right: '-40px',
                    width: '128px', height: '128px', borderRadius: '9999px',
                    background: '#dae2fd', filter: 'blur(48px)', opacity: 0.3,
                    pointerEvents: 'none',
                  }} />

                  <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#191c1e', marginBottom: '8px' }}>Welcome back</h2>
                  <p style={{ fontSize: '14px', color: '#45464d', marginBottom: '32px' }}>Enter your details to access your itineraries.</p>

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
                          placeholder="name@company.com"
                          style={{
                            width: '100%', background: '#eceef0', border: 'none', borderRadius: '8px',
                            padding: '12px 16px 12px 40px', fontSize: '16px', color: '#191c1e',
                            outline: 'none', transition: 'background 0.2s',
                            fontFamily: 'Inter, sans-serif',
                          }}
                          onFocus={e => (e.target.style.background = '#fff')}
                          onBlur={e => (e.target.style.background = '#eceef0')}
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
                          placeholder="••••••••"
                          style={{
                            width: '100%', background: '#eceef0', border: 'none', borderRadius: '8px',
                            padding: '12px 40px 12px 40px', fontSize: '16px', color: '#191c1e',
                            outline: 'none', transition: 'background 0.2s',
                            fontFamily: 'Inter, sans-serif',
                          }}
                          onFocus={e => (e.target.style.background = '#fff')}
                          onBlur={e => (e.target.style.background = '#eceef0')}
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
                      onMouseOver={e => ((e.target as HTMLButtonElement).style.background = '#004c6e')}
                      onMouseOut={e => ((e.target as HTMLButtonElement).style.background = '#006591')}
                    >
                      <span>Sign In</span>
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
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <button style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      padding: '10px', borderRadius: '8px', background: '#f2f4f6',
                      border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500, color: '#191c1e',
                      fontFamily: 'Inter, sans-serif', transition: 'background 0.2s',
                    }}
                      onMouseOver={e => ((e.currentTarget as HTMLButtonElement).style.background = '#e6e8ea')}
                      onMouseOut={e => ((e.currentTarget as HTMLButtonElement).style.background = '#f2f4f6')}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      <span>Google</span>
                    </button>

                    <button style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      padding: '10px', borderRadius: '8px', background: '#f2f4f6',
                      border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500, color: '#191c1e',
                      fontFamily: 'Inter, sans-serif', transition: 'background 0.2s',
                    }}
                      onMouseOver={e => ((e.currentTarget as HTMLButtonElement).style.background = '#e6e8ea')}
                      onMouseOut={e => ((e.currentTarget as HTMLButtonElement).style.background = '#f2f4f6')}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                      <span>GitHub</span>
                    </button>
                  </div>

                  {/* Sign up link */}
                  <div style={{ marginTop: '16px', textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', color: '#45464d' }}>
                      Don&apos;t have an account?{' '}
                      <a href="#" style={{ fontSize: '12px', fontWeight: 500, color: '#006591', textDecoration: 'none' }}>Sign up</a>
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
