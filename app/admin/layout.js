'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { AdminCtx } from '@/components/AdminCtx';
import Drawer from '@/components/Drawer';
import { MenuIcon, ChevronIcon } from '@/components/icons';
import { supabase, configured } from '@/lib/supabase';


const TABS = [['/admin', 'Orders'], ['/admin/products', 'Products'], ['/admin/categories', 'Categories'], ['/admin/settings', 'Delivery & settings'], ['/admin/admins', 'Admins']];

export default function AdminLayout({ children }) {
  const path = usePathname();
  const [session, setSession] = useState(undefined);
  const [isAdmin, setIsAdmin] = useState(null);
  const [msg, setMsg] = useState('');
  const [menu, setMenu] = useState(false);
  const closeMenu = useCallback(() => setMenu(false), []);
  const isOn = h => (h === '/admin' ? path === h : path.startsWith(h));

  useEffect(() => setMenu(false), [path]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!session) { setIsAdmin(null); return; }
    supabase.rpc('is_admin').then(({ data }) => setIsAdmin(!!data));
  }, [session]);

  const toast = m => { setMsg(m); setTimeout(() => setMsg(''), 2400); };

  let body;
  if (!configured) body = <Notice title="Supabase isn't connected yet">Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel → Settings → Environment Variables, then redeploy.</Notice>;
  else if (session === undefined) body = <div className="adm-load">Loading…</div>;
  else if (!session) body = <Login />;
  else if (isAdmin === null) body = <div className="adm-load">Checking access…</div>;
  else if (!isAdmin) body = (
    <Notice title="This account isn't an admin">
      Signed in as <b>{session.user.email}</b>. In Supabase → SQL Editor run:<br />
      <code>insert into admins (email) values (&apos;{session.user.email}&apos;);</code><br /><br />
      <button className="btn btn-line" type="button" onClick={() => supabase.auth.signOut()}>Sign out</button>
    </Notice>
  );
  else body = children;

  return (
    <AdminCtx.Provider value={{ toast, email: session?.user?.email }}>
      <div className="adm">
        <header className="adm-top">
          <div className="wrap adm-bar">
            <Link className="logo" href="/admin" aria-label="Smile Shopping admin">
              <img className="bird" src="/bird.webp" alt="" width="52" height="47" />
              <img className="word" src="/word.webp" alt="Smile Shopping" width="211" height="19" />
              <span className="adm-badge">Admin</span>
            </Link>
            <div className="adm-links">
              {session?.user?.email && <span className="mute adm-who">{session.user.email}</span>}
              <Link className="btn btn-line btn-sm" href="/" target="_blank">View shop</Link>
              {session && <button className="btn btn-ink btn-sm" type="button" onClick={() => supabase.auth.signOut()}>Sign out</button>}
            </div>
            {isAdmin && (
              <div className="adm-mob">
                <span className="adm-cur">{TABS.find(([h]) => isOn(h))?.[1]}</span>
                <button className="ibtn" type="button" aria-label="Open admin menu" aria-controls="admin-menu" aria-expanded={menu} onClick={() => setMenu(true)}><MenuIcon /></button>
              </div>
            )}
          </div>
          {isAdmin && (
            <nav className="wrap tabs">
              {TABS.map(([h, l]) => (
                <Link key={h} href={h} className={isOn(h) ? 'on' : ''} aria-current={isOn(h) ? 'page' : undefined}>{l}</Link>
              ))}
            </nav>
          )}
          <div className="plumage" />
        </header>
        {isAdmin && (
          <Drawer
            id="admin-menu" open={menu} onClose={closeMenu} title="Admin menu"
            head={<span className="drw-title">Admin<span className="adm-badge">Menu</span></span>}
            foot={<>
              {session?.user?.email && <p className="mute drw-who">Signed in as <b>{session.user.email}</b></p>}
              <div className="drw-btns">
                <Link className="btn btn-line" href="/" target="_blank">View shop</Link>
                <button className="btn btn-ink" type="button" data-close onClick={() => supabase.auth.signOut()}>Sign out</button>
              </div>
            </>}
          >
            <nav className="drw-nav" aria-label="Admin">
              {TABS.map(([h, l]) => (
                <Link key={h} href={h} className={isOn(h) ? 'on' : ''} aria-current={isOn(h) ? 'page' : undefined}>{l}<ChevronIcon /></Link>
              ))}
            </nav>
          </Drawer>
        )}
        <section className="wrap adm-body">{body}</section>
        <div id="toast" role="status" className={msg ? 'on' : ''}>{msg}</div>
      </div>
    </AdminCtx.Provider>
  );
}

function Notice({ title, children }) {
  return <div className="adm-card" style={{ maxWidth: 560, margin: '40px auto' }}><h2 style={{ fontSize: 26, marginBottom: 12 }}>{title}</h2><p className="mute">{children}</p></div>;
}

function Login() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async e => {
    e.preventDefault(); setBusy(true); setErr('');
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pw });
    setBusy(false);
    if (error) setErr(error.message === 'Invalid login credentials' ? 'Email or password is incorrect.' : error.message);
  };
  return (
    <form className="adm-card login" onSubmit={submit}>
      <img src="/bird.webp" alt="" width="64" style={{ display: 'block', margin: '0 auto 8px' }} /><h2 style={{ textAlign: 'center' }}>Admin sign in</h2>
      <div className="f"><label htmlFor="em">Email</label><input id="em" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></div>
      <div className="f"><label htmlFor="pw">Password</label><input id="pw" type="password" autoComplete="current-password" required value={pw} onChange={e => setPw(e.target.value)} /></div>
      {err && <p className="err" style={{ display: 'block' }}>{err}</p>}
      <button className="btn btn-brand btn-block" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
    </form>
  );
}
