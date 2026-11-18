'use client';
import { useState } from 'react';
import { WAIcon } from './icons';
import { waLink } from '@/lib/format';

// "Request a call back": name + phone, sent to the shop as a WhatsApp message (no email server needed).
export default function CallbackForm({ whatsapp }) {
  const [f, setF] = useState({ name: '', phone: '' });
  const [errs, setErrs] = useState({});
  const set = (k, v) => { setF(x => ({ ...x, [k]: v })); setErrs(e => ({ ...e, [k]: null })); };

  const submit = e => {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 2) er.name = 'Enter your name';
    if (!/^0\d{9}$/.test(f.phone.replace(/\s/g, ''))) er.phone = 'Enter a 10-digit mobile number starting with 0';
    setErrs(er);
    if (Object.keys(er).length) return;
    const msg = `Hi Smile Shopping! Please call me back.\nName: ${f.name.trim()}\nMobile: ${f.phone.replace(/\s/g, '')}`;
    window.open(waLink(whatsapp, msg), '_blank', 'noopener');
  };

  return (
    <form className="card cb-card" onSubmit={submit} noValidate data-rv>
      <p className="eyebrow">Still deciding?</p>
      <h3>Request a call back</h3>
      <p>Leave your name and number and we&apos;ll call you to help pick a colour or size.</p>
      <div className="f">
        <label htmlFor="cb-name">Your name</label>
        <input id="cb-name" className={errs.name ? 'bad' : ''} value={f.name} onChange={e => set('name', e.target.value)} autoComplete="name" placeholder="e.g. Nimali" />
        <div className="err">{errs.name}</div>
      </div>
      <div className="f">
        <label htmlFor="cb-phone">Mobile number</label>
        <input id="cb-phone" className={errs.phone ? 'bad' : ''} value={f.phone} onChange={e => set('phone', e.target.value)} type="tel" inputMode="tel" autoComplete="tel" placeholder="07X XXX XXXX" />
        <div className="err">{errs.phone}</div>
      </div>
      <button className="btn btn-wa btn-block" type="submit"><WAIcon /> Send request</button>
    </form>
  );
}
