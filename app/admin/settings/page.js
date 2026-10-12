'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DISTRICTS } from '@/lib/format';
import { useAdmin } from '@/components/AdminCtx';

export default function Settings() {
  const { toast } = useAdmin();
  const [zones, setZones] = useState(null);
  const [s, setS] = useState(null);

  const load = async () => {
    const [{ data: z }, { data: st }] = await Promise.all([
      supabase.from('delivery_zones').select('*').order('sort'),
      supabase.from('settings').select('*').eq('id', 1).maybeSingle(),
    ]);
    setZones(z || []); setS(st || { free_over: 15000, whatsapp: '' });
  };
  useEffect(() => { load(); }, []);

  const saveZone = async (z, patch) => {
    const { error } = await supabase.from('delivery_zones').update(patch).eq('id', z.id);
    if (error) return toast(error.message);
    toast('Delivery saved'); load();
  };
  const moveDistrict = async (d, toId) => {
    for (const z of zones) {
      const has = z.districts.includes(d);
      if (z.id === toId && !has) await supabase.from('delivery_zones').update({ districts: [...z.districts, d] }).eq('id', z.id);
      if (z.id !== toId && has) await supabase.from('delivery_zones').update({ districts: z.districts.filter(x => x !== d) }).eq('id', z.id);
    }
    toast(`${d} moved`); load();
  };
  const saveSettings = async patch => {
    const { error } = await supabase.from('settings').upsert({ id: 1, ...s, ...patch });
    if (error) return toast(error.message);
    toast('Settings saved'); load();
  };

  if (!zones || !s) return <div className="adm-load">Loading…</div>;
  const zoneOf = d => zones.find(z => z.districts.includes(d))?.id || '';

  return (
    <>
      <div className="adm-head"><h2>Delivery charges</h2></div>
      <p className="mute" style={{ marginTop: 0 }}>Change a rate and checkout uses it immediately.</p>
      <div className="tbl-wrap">
        {zones.map(z => (
          <div className="zone" key={z.id}>
            <div>
              <input className="zname" defaultValue={z.name} aria-label="Zone name" onBlur={e => e.target.value !== z.name && saveZone(z, { name: e.target.value })} />
              <input className="zdays" defaultValue={z.days} aria-label="Delivery time" onBlur={e => e.target.value !== z.days && saveZone(z, { days: e.target.value })} />
              <br /><small>{z.districts.join(', ') || 'No districts'}</small>
            </div>
            <label>Rate (Rs.)<input type="number" min="0" step="10" defaultValue={z.rate} onBlur={e => +e.target.value !== z.rate && saveZone(z, { rate: Math.max(0, +e.target.value) })} /></label>
          </div>
        ))}
      </div>

      <details className="adm-card" style={{ marginTop: 16 }}>
        <summary><b>Move a district to another zone</b></summary>
        <div className="dgrid">
          {DISTRICTS.map(d => (
            <label key={d}>{d}
              <select value={zoneOf(d)} onChange={e => moveDistrict(d, +e.target.value)}>
                <option value="" disabled>Not delivered</option>
                {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
              </select>
            </label>
          ))}
        </div>
      </details>

      <div className="adm-head" style={{ marginTop: 30 }}><h2>Shop settings</h2></div>
      <div className="adm-card">
        <div className="f-row">
          <div className="f"><label htmlFor="fo">Free delivery over (Rs.) <small>0 turns it off</small></label><input id="fo" type="number" min="0" step="500" defaultValue={s.free_over} onBlur={e => +e.target.value !== s.free_over && saveSettings({ free_over: Math.max(0, +e.target.value) })} /></div>
          <div className="f"><label htmlFor="wa">WhatsApp number <small>country code, no + or spaces, e.g. 94771234567</small></label><input id="wa" inputMode="numeric" defaultValue={s.whatsapp} onBlur={e => { const v = e.target.value.replace(/\D/g, ''); if (v && v !== s.whatsapp) saveSettings({ whatsapp: v }); }} /></div>
        </div>
      </div>
    </>
  );
}
