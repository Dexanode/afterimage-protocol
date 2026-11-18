import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const guardians = [
  { initials: 'MR', name: 'Mira Rahman', address: 'qore1mira…m9q2', role: 'Designated guardian', state: 'approved' },
  { initials: 'TJ', name: 'Theo James', address: 'qore1theo…2xr8', role: 'Legal guardian', state: 'pending' },
  { initials: 'LS', name: 'Lena Sato', address: 'qore1lena…8pk1', role: 'Technical guardian', state: 'pending' }
];

function App() {
  const [active, setActive] = useState('overview');
  const [released, setReleased] = useState(false);
  const [notice, setNotice] = useState('');
  const [wallet, setWallet] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const approvals = released ? 2 : 1;

  const release = () => {
    setReleased(true);
    setNotice('Second guardian approval recorded. Capsule is ready for recipient-side decryption.');
  };

  const connectQorex = async () => {
    const provider = window.qorex?.native;
    if (!provider) {
      setNotice('QoreX was not found. Open Afterimage in QoreX or install and unlock the QoreX browser extension.');
      return;
    }
    setConnecting(true);
    try {
      await provider.enable('qorechain-diana');
      const key = await provider.getKey('qorechain-diana');
      setWallet({ address: key.bech32Address, name: key.name || 'QoreX account' });
      setNotice(`QoreX connected to qorechain-diana: ${key.bech32Address}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'QoreX connection was not approved.';
      setNotice(message);
    } finally {
      setConnecting(false);
    }
  };


  return <main>
    <aside>
      <a className="brand" href="#top"><span className="brand-mark">A</span><span>afterimage<span className="dot">.</span></span></a>
      <div className="workspace"><span>WORKSPACE</span><strong>Legacy capsule</strong></div>
      <nav>
        <button className={active === 'overview' ? 'active' : ''} onClick={() => setActive('overview')}><i>◉</i> Overview</button>
        <button className={active === 'capsules' ? 'active' : ''} onClick={() => setActive('capsules')}><i>◇</i> Capsules <b>1</b></button>
        <button className={active === 'guardians' ? 'active' : ''} onClick={() => setActive('guardians')}><i>◌</i> Guardians</button>
        <button className={active === 'activity' ? 'active' : ''} onClick={() => setActive('activity')}><i>↗</i> Activity</button>
      </nav>
      <section className="security"><span className="lock">✦</span><div><strong>Post-quantum sealed</strong><p>ML-KEM-1024 envelope<br/>bound to QoreChain keys</p></div></section>
      <div className="profile"><span className="avatar">AD</span><div><strong>Alex Doe</strong><small>qore1a7d…c91e</small></div><span>⌄</span></div>
    </aside>

    <section className="content" id="top">
      <header><div className="crumb">CAPSULES <span>/</span> <strong>PROJECT AFTERIMAGE</strong></div><button className={wallet ? 'connect connected' : 'connect'} onClick={connectQorex} disabled={connecting}>{wallet ? `● ${wallet.address.slice(0, 11)}…${wallet.address.slice(-5)}` : connecting ? 'Connecting QoreX…' : 'Connect QoreX'}</button></header>
      <div className="page-title"><div><p className="eyebrow">AFTERIMAGE PROTOCOL</p><h1>Your digital legacy,<br/><em>sealed for the right moment.</em></h1><p className="intro">A post-quantum capsule for the people and agents you trust.</p></div><button className="new-capsule" onClick={() => setNotice('A new capsule draft is ready to compose.')}>+ New capsule</button></div>

      {notice && <div className="notice"><span>✦</span>{notice}<button onClick={() => setNotice('')}>×</button></div>}

      <div className="grid">
        <article className="capsule-card">
          <div className="card-head"><span className="tag">ACTIVE CAPSULE</span><span className={released ? 'status released' : 'status'}>{released ? '● RELEASED' : '◌ SEALED'}</span></div>
          <div className="capsule-icon">✧</div>
          <h2>Project Afterimage</h2><p className="muted">Instructions, context, and access policies for the people who carry your work forward.</p>
          <div className="facts"><div><span>RELEASE CONDITION</span><strong>2 of 3 guardians</strong></div><div><span>CREATED</span><strong>Nov 18, 2026</strong></div></div>
          <div className="progress"><div><span>Guardian approvals</span><b>{approvals} / 3</b></div><div className="bar"><i style={{width: `${approvals / 3 * 100}%`}} /></div></div>
          <button className="open" onClick={() => setNotice(released ? 'Secure viewing must happen in the recipient’s browser.' : 'The capsule remains sealed until the second guardian approves.')}>{released ? 'View release package  →' : 'View capsule details  →'}</button>
        </article>

        <article className="guardian-card"><div className="card-head"><span className="tag">GUARDIAN QUORUM</span><span className="quorum">{approvals} / 3</span></div><h3>People who can open the way.</h3><p className="muted">Each guardian holds their own address-bound encrypted envelope.</p>
          <div className="guardian-list">{guardians.map((g, i) => <div className="guardian" key={g.name}><span className="avatar guardian-avatar">{g.initials}</span><div><strong>{g.name}</strong><small>{g.address} · {g.role}</small></div><span className={released && i === 1 ? 'approved-pill' : g.state === 'approved' ? 'approved-pill' : 'pending-pill'}>{released && i === 1 ? 'Approved' : g.state === 'approved' ? 'Approved' : 'Pending'}</span></div>)}</div>
          {!released && <button className="simulate" onClick={release}>Simulate guardian approval <span>→</span></button>}
        </article>
      </div>

      <section className="timeline"><div className="section-heading"><div><p className="eyebrow">CHAIN OF CUSTODY</p><h2>Capsule activity</h2></div><button onClick={() => setActive('activity')}>View all activity →</button></div>
        <div className="events"><div className="event"><span className="event-icon">✦</span><div><strong>Capsule sealed on QoreChain</strong><p>ML-KEM-1024 envelopes created for 3 recipients.</p></div><time>Today, 10:42</time></div><div className="event"><span className="event-icon dim">✓</span><div><strong>Mira accepted guardianship</strong><p>Authenticated with a hybrid QoreChain signature.</p></div><time>Today, 10:47</time></div><div className="event"><span className="event-icon dim">◌</span><div><strong>Release condition configured</strong><p>Requires 2 of 3 approvals. No server holds the plaintext.</p></div><time>Today, 10:48</time></div></div>
      </section>
      <footer>AFTERIMAGE PROTOCOL <span>·</span> Built for the post-quantum future on QoreChain testnet</footer>
    </section>
  </main>
}

createRoot(document.getElementById('root')).render(<App />);
