'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AdminCtx } from '@/components/AdminCtx';
import { supabase, configured } from '@/lib/supabase';


const TABS = [['/admin', 'Orders'], ['/admin/products', 'Products'], ['/admin/categories', 'Categories'], ['/admin/settings', 'Delivery & settings']];

export default function AdminLayout({ children }) {
  const path = usePathname();
  const [session, setSession] = useState(undefined);
  const [isAdmin, setIsAdmin] = useState(null);
  const [msg, setMsg] = useState('');

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
        <div className="adm-top">
          <div className="wrap">
            <div>
              <img className="bird" src="/bird.webp" alt="" />
              <div><h1>Smile Shopping admin</h1><p>{session?.user?.email || 'Sign in to manage the shop'}</p></div>
              <div className="adm-links">
                <Link href="/" target="_blank">View shop ↗</Link>
                {session && <button type="button" onClick={() => supabase.auth.signOut()}>Sign out</button>}
              </div>
            </div>
            {isAdmin && (
              <nav className="tabs">
                {TABS.map(([h, l]) => (
                  <Link key={h} href={h} className={(h === '/admin' ? path === h : path.startsWith(h)) ? 'on' : ''}>{l}</Link>
                ))}
              </nav>
            )}
          </div>
        </div>
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
      <h2>Sign in</h2>
      <div className="f"><label htmlFor="em">Email</label><input id="em" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></div>
      <div className="f"><label htmlFor="pw">Password</label><input id="pw" type="password" autoComplete="current-password" required value={pw} onChange={e => setPw(e.target.value)} /></div>
      {err && <p className="err" style={{ display: 'block' }}>{err}</p>}
      <button className="btn btn-brand btn-block" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
    </form>
  );
}
