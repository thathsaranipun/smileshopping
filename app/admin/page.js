'use client';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { money, STAGES, STAGE_LABEL } from '@/lib/format';
import { useAdmin } from '@/components/AdminCtx';

const ALL = [...STAGES, 'Cancelled'];

export default function Orders() {
  const { toast } = useAdmin();
  const [orders, setOrders] = useState(null);
  const [lowStock, setLowStock] = useState(0);
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(null);

  const load = async () => {
    const [{ data }, { count }] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(500),
      supabase.from('products').select('id', { count: 'exact', head: true }).lte('stock', 5).eq('active', true),
    ]);
    setOrders(data || []); setLowStock(count || 0);
  };
  useEffect(() => {
    load();
    const ch = supabase.channel('orders').on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, load).subscribe();
    const t = setInterval(load, 30000);
    return () => { supabase.removeChannel(ch); clearInterval(t); };
  }, []);

  const update = async (o, patch, label) => {
    const { error } = await supabase.from('orders').update(patch).eq('id', o.id);
    if (error) return toast(error.message);
    setOrders(os => os.map(x => (x.id === o.id ? { ...x, ...patch } : x)));
    toast(label);
  };

  const list = useMemo(() => (orders || []).filter(o =>
    (filter === 'all' || o.status === filter) &&
    (!q || `${o.order_no} ${o.customer_name} ${o.mobile} ${o.district}`.toLowerCase().includes(q.toLowerCase()))), [orders, filter, q]);

  if (!orders) return <div className="adm-load">Loading orders…</div>;
  const revenue = orders.filter(o => o.pay_status === 'Paid' || o.status === 'Delivered').reduce((a, o) => a + o.total, 0);
  const toPack = orders.filter(o => o.status === 'Confirmed' || o.status === 'Processing').length;
  const today = orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()).length;

  return (
    <>
      <div className="kpis">
        <div className="kpi"><small>Orders today</small><b>{today}</b></div>
        <div className="kpi"><small>Revenue collected</small><b>{money(revenue)}</b></div>
        <div className="kpi"><small>To pack</small><b>{toPack}</b></div>
        <div className="kpi"><small>Low stock items</small><b>{lowStock}</b></div>
      </div>
      <div className="tools">
        <label className="search"><input type="search" placeholder="Search order no, name, mobile, district" value={q} onChange={e => setQ(e.target.value)} aria-label="Search orders" /></label>
        <select className="sel" value={filter} onChange={e => setFilter(e.target.value)} aria-label="Filter by status">
          <option value="all">All statuses</option>{ALL.map(s => <option key={s} value={s}>{STAGE_LABEL[s]}</option>)}
        </select>
      </div>
      {list.length === 0 ? (
        <div className="empty"><b>No orders yet</b>New orders appear here automatically.</div>
      ) : (
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Order</th><th>Date</th><th>Customer</th><th>Deliver to</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead>
            <tbody>
              {list.map(o => (
                <Fragment key={o.id}>
                  <tr className="clickable" onClick={() => setOpen(open === o.id ? null : o.id)}>
                    <td><b>{o.order_no}</b><br /><small className="mute">{o.items.length} item{o.items.length > 1 ? 's' : ''} · {open === o.id ? 'hide' : 'details'}</small></td>
                    <td>{new Date(o.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                    <td>{o.customer_name}<br /><a href={`tel:${o.mobile}`} onClick={e => e.stopPropagation()} className="mute">{o.mobile}</a></td>
                    <td>{o.district}</td>
                    <td><b>{money(o.total)}</b><br /><small className="mute">incl. {money(o.delivery)} delivery</small></td>
                    <td onClick={e => e.stopPropagation()}>
                      <select value={o.pay_status} className={`st-pill p-${o.pay_status}`} onChange={e => update(o, { pay_status: e.target.value }, `${o.order_no}: payment ${e.target.value}`)} aria-label="Payment status">
                        {['Unpaid', 'Paid', 'COD', 'Failed'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <select value={o.status} onChange={e => update(o, { status: e.target.value }, `${o.order_no}: ${STAGE_LABEL[e.target.value]}`)} aria-label="Order status">
                        {ALL.map(s => <option key={s} value={s}>{STAGE_LABEL[s]}</option>)}
                      </select>
                    </td>
                  </tr>
                  {open === o.id && (
                    <tr className="detail"><td colSpan={7}>
                      <div className="od">
                        <div>
                          <h4>Items</h4>
                          {o.items.map((it, i) => <div key={i}>{it.qty} × {it.name}{it.variant ? ` (${it.variant})` : ''} — {money(it.price * it.qty)}</div>)}
                        </div>
                        <div>
                          <h4>Delivery</h4>
                          <div>{o.customer_name}</div><div>{o.address}, {o.district}</div><div>{o.mobile}{o.email ? ` · ${o.email}` : ''}</div>
                          {o.notes && <div className="mute">Note: {o.notes}</div>}
                        </div>
                        <div>
                          <h4>Contact</h4>
                          <a className="btn btn-wa" style={{ padding: '8px 14px', fontSize: 14 }} target="_blank" rel="noopener"
                            href={`https://wa.me/94${o.mobile.replace(/^0/, '')}?text=${encodeURIComponent(`Hi ${o.customer_name.split(' ')[0]}, this is Smile Shopping about your order ${o.order_no}.`)}`}>WhatsApp customer</a>
                        </div>
                      </div>
                    </td></tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
