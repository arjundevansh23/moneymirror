import { useInsights } from '../../hooks/useInsights'
import { inr, fmtLakhs, sipFuture } from '../../lib/calculations'
import './Tab.css'

export default function InvestTab({ expenses, goals, income, peer }) {
  const ins = useInsights({ expenses, goals, income, peer })

  return (
    <div className="tab-page">
      <div style={{padding:'24px 20px 0', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <div style={{fontFamily:'DM Serif Display, serif', fontSize:32, color:'var(--ink)'}}>Invest</div>
        <div style={{background:'var(--wheat)', color:'var(--ink2)', fontSize:11, fontWeight:500, padding:'5px 12px', borderRadius:100}}>
          This month
        </div>
      </div>

      {/* Hero */}
      <div style={{margin:'16px 16px 0', background:'var(--ink)', borderRadius:24, padding:22, position:'relative', overflow:'hidden'}}>
        <div style={{position:'absolute', top:-40, right:-40, width:140, height:140, borderRadius:'50%', background:'rgba(196,154,108,0.15)'}} />
        <div style={{position:'absolute', bottom:-30, left:-20, width:90, height:90, borderRadius:'50%', background:'rgba(189,216,240,0.08)'}} />
        <div style={{fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--ink3)', marginBottom:6, position:'relative'}}>
          {ins.totalLeak > 0 ? 'If you fix your leaks this month' : 'Your leaks this month'}
        </div>
        <div style={{fontFamily:'DM Serif Display, serif', fontSize:44, color:'var(--surface)', lineHeight:1, marginBottom:4, position:'relative'}}>
          {inr(ins.totalLeak)}
        </div>
        <div style={{fontSize:12, color:'var(--tan)', fontWeight:300, marginBottom:18, position:'relative'}}>
          {ins.totalLeak > 0 ? 'is sitting on the table, uninvested' : 'within peer spending — great!'}
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, position:'relative'}}>
          <div style={{background:'rgba(250,247,242,0.07)', borderRadius:13, padding:12, textAlign:'center'}}>
            <div style={{fontFamily:'DM Serif Display, serif', fontSize:18, color:'#80d0a0', lineHeight:1, marginBottom:3}}>
              {fmtLakhs(sipFuture(ins.totalLeak, 10))}
            </div>
            <div style={{fontSize:10, color:'var(--ink3)', fontWeight:300}}>in 10 years at 12%</div>
          </div>
          <div style={{background:'rgba(250,247,242,0.07)', borderRadius:13, padding:12, textAlign:'center'}}>
            <div style={{fontFamily:'DM Serif Display, serif', fontSize:18, color:'var(--blush)', lineHeight:1, marginBottom:3}}>
              {inr(ins.ct['Finance'] || 0)}
            </div>
            <div style={{fontSize:10, color:'var(--ink3)', fontWeight:300}}>currently invested</div>
          </div>
        </div>
      </div>

      {/* Based on spending */}
      <div className="sec-head">
        <div className="sec-title">Based on your spending</div>
        <div style={{fontSize:11, color:'var(--ink3)', fontWeight:300}}>things to fix</div>
      </div>

      <div style={{padding:'0 16px', display:'flex', flexDirection:'column', gap:12}}>
        {/* Food leak */}
        {ins.food > peer.Food && (
          <div className="ic">
            <div className="ic-head">
              <div className="ic-ico i-red">🍕</div>
              <div className="ic-meta">
                <div className="ic-tag t-warn">Overspending on food</div>
                <div className="ic-title">Cut delivery by half, invest the rest</div>
              </div>
            </div>
            <div className="ic-body">
              You're spending <span className="r">{inr(ins.foodLeak)} more</span> on food than peers.
              Reducing delivery to every other day saves {inr(Math.round(ins.foodLeak/2))}/mo.
            </div>
            <div className="ibox">
              {[
                ['Monthly overspend', inr(ins.foodLeak),                              '#c04030'],
                ['Easy cut (50%)',    inr(Math.round(ins.foodLeak/2))+' freed',       ''],
                ['SIP in 10 years',  inr(sipFuture(Math.round(ins.foodLeak/2),10)),  '#2a7a48'],
              ].map(([l,v,c]) => (
                <div key={l} className="ibox-row">
                  <div className="ibox-lbl">{l}</div>
                  <div className="ibox-val" style={{color:c||'var(--ink)'}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shopping leak */}
        {ins.shopping > peer.Shopping && (
          <div className="ic">
            <div className="ic-head">
              <div className="ic-ico i-amber">🛍️</div>
              <div className="ic-meta">
                <div className="ic-tag t-warn">Shopping overspend</div>
                <div className="ic-title">Set a monthly shopping cap</div>
              </div>
            </div>
            <div className="ic-body">
              Shopping {Math.round(ins.shopping/peer.Shopping*100-100)}% above peer average.
              Capping at {inr(peer.Shopping)} saves {inr(ins.shopLeak)}/mo.
            </div>
            <div className="ibox">
              {[
                ['Current spend',  inr(ins.shopping),                      '#c04030'],
                ['Suggested cap',  inr(peer.Shopping)+'/mo',               ''],
                ['SIP in 10 years',inr(sipFuture(ins.shopLeak,10)),        '#2a7a48'],
              ].map(([l,v,c]) => (
                <div key={l} className="ibox-row">
                  <div className="ibox-lbl">{l}</div>
                  <div className="ibox-val" style={{color:c||'var(--ink)'}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Within budget */}
        {ins.totalLeak === 0 && (
          <div className="ic">
            <div className="ic-head">
              <div className="ic-ico i-green">✅</div>
              <div className="ic-meta">
                <div className="ic-tag t-win">Within peer spending</div>
                <div className="ic-title">Your spending is in check — now invest</div>
              </div>
            </div>
            <div className="ic-body">
              You're spending within peer benchmarks across all categories.
              Now redirect your savings into a SIP.
            </div>
          </div>
        )}
      </div>

      {/* Simple plan */}
      <div className="sec-head" style={{paddingTop:22}}>
        <div className="sec-title">What to do with it</div>
        <div style={{fontSize:11, color:'var(--ink3)', fontWeight:300}}>simple, not complex</div>
      </div>

      <div style={{background:'var(--ink)', borderRadius:20, padding:18, margin:'0 16px'}}>
        <div style={{fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--ink3)', marginBottom:10}}>The simplest investing plan</div>
        <div className="ic-title-lt" style={{marginBottom:8}}>Start one SIP. That's it.</div>
        <div className="ic-body-lt" style={{marginBottom:14}}>
          Pick any Nifty 50 index fund. Set up a {inr(ins.sipAmt)}/mo SIP. It auto-debits monthly. Just let it run.
        </div>
        <div className="ibox-dk">
          {[
            ['Recommended fund', 'UTI Nifty 50 Index'],
            ['Suggested SIP',    inr(ins.sipAmt)+'/mo'],
            ['In 10 years',      inr(sipFuture(ins.sipAmt,10))],
            ['In 20 years',      inr(sipFuture(ins.sipAmt,20))],
          ].map(([l,v]) => (
            <div key={l} className="ibox-row">
              <div className="ibox-lbl-lt">{l}</div>
              <div className="ibox-val-lt">{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom line */}
      <div style={{paddingTop:12}}>
        <div style={{background:'var(--tan)', borderRadius:20, padding:18, margin:'0 16px'}}>
          <div style={{fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'rgba(254,250,224,0.55)', marginBottom:8}}>The bottom line</div>
          <div style={{fontFamily:'DM Serif Display, serif', fontSize:20, color:'var(--surface)', marginBottom:8, lineHeight:1.2}}>
            {ins.totalLeak > 0
              ? `Fix leaks. Start a ${inr(ins.sipAmt)} SIP. That's the whole plan.`
              : `You're on track. Start a ${inr(ins.sipAmt)} SIP. That's the whole plan.`}
          </div>
          <div style={{fontSize:12, color:'rgba(254,250,224,0.65)', fontWeight:300, lineHeight:1.6}}>
            {inr(ins.sipAmt)}/mo at 12% over 20 years is{' '}
            <span style={{color:'#fefae0', fontWeight:500}}>{fmtLakhs(sipFuture(ins.sipAmt,20))}</span>.
          </div>
        </div>
      </div>

      <div style={{height:8}} />
    </div>
  )
}
