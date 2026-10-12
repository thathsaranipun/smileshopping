'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAdmin } from '@/components/AdminCtx';

const fmt = d => (d ? new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Never');

export default function Admins() {
  const { toast, email: me } = useAdmin();
  const [list, setList] = useState(null);
  const [form, setForm] = useState({ email: '', password: '' });
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const load = async () => {
    const { data, error } = await supabase.rpc('list_admins');
    if (error) { setErr(error.message); setList([]); return; }
    setList(data || []);
  };
  useEffect(() => { load(); }, []);

  const add = async e => {
    e.preventDefault(); setErr('');
    if (form.password.length < 8) return setErr('Password must be at least 8 characters');
    setBusy(true);
    const { error } = await supabase.rpc('create_admin', { new_email: form.email, new_password: form.password });
    setBusy(false);
    if (error) return setErr(error.message);
    toast(`${form.email} can now sign in`);
    setForm({ email: '', password: '' }); load();
  };

  const remove = async a => {
    if (!confirm(`Remove ${a.email}? They will no longer be able to sign in.`)) return;
    const { error } = await supabase.rpc('remove_admin', { old_email: a.email });
    if (error) return toast(error.message);
    toast(`${a.email} removed`); load();
  };

  const changePw = async e => {
    e.preventDefault();
    if (pw.length < 8) return toast('Password must be at least 8 characters');
    const { error } = await supabase.rpc('change_my_password', { new_password: pw });
    if (error) return toast(error.message);
    setPw(''); toast('Password changed. Use it next time you sign in.');
  };

  const gen = () => {
    const a = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    const r = crypto.getRandomValues(new Uint32Array(12));
    setForm(f => ({ ...f, password: 'Smile-' + Array.from(r, n => a[n % a.length]).join('') }));
  };

  if (!list) return <div className="adm-load">Loading…</div>;
  return (
    <>
      <div className="adm-head"><h2>Admins</h2><span className="mute">{list.length} {list.length === 1 ? 'person' : 'people'} can manage the shop</span></div>

      <div className="tbl-wrap">
        <table>
          <thead><tr><th>Email</th><th>Login</th><th>Last signed in</th><th></th></tr></thead>
          <tbody>
            {list.map(a => (
              <tr key={a.email}>
                <td><b>{a.email}</b>{a.email === me?.toLowerCase() && <span className="you">You</span>}</td>
                <td>{a.has_login ? <span className="st-pill p-Paid">Active</span> : <span className="st-pill p-Unpaid">No login yet</span>}</td>
                <td className="mute">{fmt(a.last_sign_in)}</td>
                <td style={{ textAlign: 'right' }}>{a.email !== me?.toLowerCase() && <button type="button" className="lnk danger" onClick={() => remove(a)}>Remove</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="adm-grid2">
        <form className="adm-card" onSubmit={add}>
          <h3 className="card-h">Add an admin</h3>
          <p className="mute" style={{ marginTop: 0 }}>They sign in at this page with the email and password you set. Share the password with them privately.</p>
          <div className="f"><label htmlFor="na-email">Email</label><input id="na-email" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="name@smileshopping.lk" /></div>
          <div className="f">
            <label htmlFor="na-pw">Password <small>(at least 8 characters)</small></label>
            <div className="pw-row">
              <input id="na-pw" type="text" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} autoComplete="new-password" />
              <button type="button" className="btn btn-line" onClick={gen}>Generate</button>
            </div>
          </div>
          {err && <p className="err" style={{ display: 'block' }}>{err}</p>}
          <button className="btn btn-brand" disabled={busy}>{busy ? 'Adding…' : 'Add admin'}</button>
        </form>

        <form className="adm-card" onSubmit={changePw}>
          <h3 className="card-h">Change your password</h3>
          <p className="mute" style={{ marginTop: 0 }}>Signed in as {me}.</p>
          <div className="f"><label htmlFor="my-pw">New password</label><input id="my-pw" type="password" value={pw} onChange={e => setPw(e.target.value)} autoComplete="new-password" /></div>
          <button className="btn btn-ink">Change password</button>
        </form>
      </div>
    </>
  );
}
