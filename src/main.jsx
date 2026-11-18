import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './composer.css';
import './pages.css';

const guardians = [
  { initials: 'MR', name: 'Mira Rahman', address: 'qore1mira…m9q2', role: 'Designated guardian', state: 'approved' },
  { initials: 'TJ', name: 'Theo James', address: 'qore1theo…2xr8', role: 'Legal guardian', state: 'pending' },
  { initials: 'LS', name: 'Lena Sato', address: 'qore1lena…8pk1', role: 'Technical guardian', state: 'pending' }
];

const defaultDraft = {
  title: 'Project Afterimage',
  message: 'Instructions, context, and access policies for the people who carry your work forward.',
  threshold: 2
};

const pageCopy = {
  overview: { eyebrow: 'AFTERIMAGE PROTOCOL', title: <>Your digital legacy,<br/><em>sealed for the right moment.</em></>, intro: 'A post-quantum capsule for the people and agents you trust.' },
  capsules: { eyebrow: 'CAPSULE LIBRARY', title: <>Hold context gently,<br/><em>release it deliberately.</em></>, intro: 'Each capsule holds encrypted instructions and a clear release rule.' },
  guardians: { eyebrow: 'TRUSTED CIRCLE', title: <>The people who<br/><em>can open the way.</em></>, intro: 'Guardians approve release independently. They never need to share a secret.' },
  activity: { eyebrow: 'CHAIN OF CUSTODY', title: <>Every threshold has<br/><em>a quiet record.</em></>, intro: 'A readable timeline of capsule decisions and release events.' }
};

function App() {
  const [active, setActive] = useState('overview');
  const [released, setReleased] = useState(false);
  const [notice, setNotice] = useState('');
  const [wallet, setWallet] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState(defaultDraft);
  const [capsule, setCapsule] = useState(defaultDraft);
  const [theme, setTheme] = useState('light');
  const approvals = released ? 2 : 1;

  const release = () => {
    setReleased(true);
    setNotice('Second guardian approval recorded. Capsule is ready for recipient-side decryption.');
  };

  const updateDraft = (field, value) => setDraft(current => ({ ...current, [field]: value }));

  const saveDraft = () => {
    setCapsule(draft);
    setComposerOpen(false);
    setNotice(`“${draft.title}” is ready for QoreSeal encryption and on-chain registration.`);
  };

  const page = pageCopy[active];

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


  return <main className={`theme-${theme}`}>
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
      <header><div className="crumb">CAPSULES <span>/</span> <strong>PROJECT AFTERIMAGE</strong></div><div className="header-actions"><button className="theme-toggle" onClick={() => setTheme(current => current === 'light' ? 'dark' : 'light')} aria-label="Toggle color theme"><span>{theme === 'light' ? '◐' : '☼'}</span><small>{theme === 'light' ? 'Night' : 'Light'}</small></button><button className={wallet ? 'connect connected' : 'connect'} onClick={connectQorex} disabled={connecting}>{wallet ? `● ${wallet.address.slice(0, 11)}…${wallet.address.slice(-5)}` : connecting ? 'Connecting QoreX…' : 'Connect QoreX'}</button></div></header>
      <div className="page-title"><div><p className="eyebrow">{page.eyebrow}</p><h1>{page.title}</h1><p className="intro">{page.intro}</p></div>{active !== 'activity' && <button className="new-capsule" onClick={() => setComposerOpen(true)}>+ New capsule</button>}</div>

      {notice && <div className="notice"><span>✦</span>{notice}<button onClick={() => setNotice('')}>×</button></div>}

      {active === 'overview' && <><div className="grid">
        <article className="capsule-card">
          <div className="card-head"><span className="tag">ACTIVE CAPSULE</span><span className={released ? 'status released' : 'status'}>{released ? '● RELEASED' : '◌ SEALED'}</span></div>
          <div className="capsule-icon">✧</div>
          <h2>{capsule.title}</h2><p className="muted">{capsule.message}</p>
          <div className="facts"><div><span>RELEASE CONDITION</span><strong>{capsule.threshold} of 3 guardians</strong></div><div><span>CREATED</span><strong>Nov 18, 2026</strong></div></div>
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
      </>}
      {active === 'capsules' && <section className="library"><article className="library-card active-library"><div className="library-icon">✧</div><div className="library-main"><p className="tag">ACTIVE · SEALED</p><h2>{capsule.title}</h2><p>{capsule.message}</p><div className="library-meta"><span>{capsule.threshold} of 3 guardian approvals</span><span>Created Nov 18, 2026</span></div></div><button className="quiet-button" onClick={() => setActive('overview')}>Open overview →</button></article><article className="empty-card"><span>＋</span><div><h3>Make room for another story.</h3><p>A separate release rule for every context that deserves one.</p></div><button onClick={() => setComposerOpen(true)}>Create capsule</button></article></section>}
      {active === 'guardians' && <section className="guardian-page"><div className="guardian-page-intro"><span>3</span><div><h2>A small, intentional circle.</h2><p>Each person receives their own encrypted envelope and approves from their own wallet.</p></div></div><div className="guardian-grid">{guardians.map((guardian, index) => <article key={guardian.name} className="guardian-profile"><span className="avatar guardian-avatar">{guardian.initials}</span><div className="guardian-profile-title"><div><p className="tag">GUARDIAN 0{index + 1}</p><h3>{guardian.name}</h3></div><span className={index === 0 || (released && index === 1) ? 'approved-pill' : 'pending-pill'}>{index === 0 || (released && index === 1) ? 'Approved' : 'Pending'}</span></div><dl><div><dt>QORECHAIN ADDRESS</dt><dd>{guardian.address}</dd></div><div><dt>ROLE</dt><dd>{guardian.role}</dd></div></dl></article>)}</div></section>}
      {active === 'activity' && <section className="activity-page"><div className="activity-filter"><span>ALL ACTIVITY</span><button className="filter-active">Everything</button><button>Capsule</button><button>Guardian</button></div><div className="activity-list"><div className="activity-day">TODAY · NOV 18, 2026</div><div className="activity-row"><span className="event-icon">✧</span><div><strong>Capsule sealed on QoreChain</strong><p>The encrypted envelope commitment is ready for registration.</p></div><time>10:42</time></div><div className="activity-row"><span className="event-icon dim">✓</span><div><strong>Mira accepted guardianship</strong><p>Authenticated with a hybrid QoreChain signature.</p></div><time>10:47</time></div><div className="activity-row"><span className="event-icon dim">◌</span><div><strong>Release condition configured</strong><p>{capsule.threshold} of 3 guardian approvals required to release this capsule.</p></div><time>10:48</time></div>{released && <div className="activity-row release"><span className="event-icon">✓</span><div><strong>Capsule released</strong><p>The guardian threshold has been met. Recipients may decrypt locally.</p></div><time>Now</time></div>}</div></section>}
      <footer>AFTERIMAGE PROTOCOL <span>·</span> Built for the post-quantum future on QoreChain testnet</footer>
    </section>
    {composerOpen && <div className="composer-backdrop" role="dialog" aria-modal="true" aria-labelledby="composer-title">
      <section className="composer">
        <div className="composer-heading"><div><p className="eyebrow">NEW CAPSULE</p><h2 id="composer-title">Set its release terms.</h2></div><button className="dismiss" onClick={() => setComposerOpen(false)} aria-label="Close composer">×</button></div>
        <p className="composer-intro">Create the public release rule here. The capsule message is prepared for client-side encryption before anything reaches QoreChain.</p>
        <label className="field"><span>CAPSULE NAME</span><input value={draft.title} maxLength="60" onChange={event => updateDraft('title', event.target.value)} /></label>
        <label className="field"><span>MESSAGE FOR RECIPIENTS</span><textarea value={draft.message} maxLength="500" onChange={event => updateDraft('message', event.target.value)} /></label>
        <div className="composer-guardians"><span>RECIPIENT GUARDIANS</span>{guardians.map(guardian => <div key={guardian.name}><span className="avatar guardian-avatar">{guardian.initials}</span><p><strong>{guardian.name}</strong><small>{guardian.address}</small></p><b>Included</b></div>)}</div>
        <div className="threshold"><div><span>RELEASE QUORUM</span><strong>{draft.threshold} of 3 guardians</strong></div><div className="threshold-options">{[1, 2, 3].map(value => <button key={value} className={draft.threshold === value ? 'selected' : ''} onClick={() => updateDraft('threshold', value)}>{value}</button>)}</div></div>
        <div className="composer-note"><span>✦</span> QoreSeal encryption happens in the recipient flow. This draft stores no secret material.</div>
        <button className="save-draft" onClick={saveDraft}>Save capsule draft <span>→</span></button>
      </section>
    </div>}
  </main>
}

createRoot(document.getElementById('root')).render(<App />);
