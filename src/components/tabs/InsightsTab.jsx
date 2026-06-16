import { useState } from 'react'
import { useInsights } from '../../hooks/useInsights'
import { inr, fmtLakhs, sipFuture, dayLabel } from '../../lib/calculations'
import './Tab.css'

const CIRC = 163.4

function BarCard({ ico, icoCls, tag, tagCls, title, body, rows }) {
  const maxVal = Math.max(...rows.map(r => r[1]), 1)
  return (
    <div className="ic">
      <div className="ic-head">
        <div className={`ic-ico ${icoCls}`}>{ico}</div>
        <div className="ic-meta">
          <div className={`ic-tag ${tagCls}`}>{tag}</div>
          <div className="ic-title">{title}</div>
        </div>
      </div>
      <div className="ic-body" dangerouslySetInnerHTML={{__html: body}} />
      <div className="bars">
        {rows.map(([label, val, style, fillCls, display]) => (
          <div key={label} className="bar-row">
            <div className="bar-lbl">{label}</div>
            <div className="bar-track">
              <div className={`bar-fill ${fillCls}`} style={{width: Math.round(val/maxVal*100)+'%'}} />
            </div>
            <div className="bar-val" style={{color: style}}>{display}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function IboxCard({ ico, icoCls, tag, tagCls, title, body, rows }) {
  return (
    <div className="ic">
      <div className="ic-head">
        <div className={`ic-ico ${icoCls}`}>{ico}</div>
        <div className="ic-meta">
          <div className={`ic-tag ${tagCls}`}>{tag}</div>
          <div className="ic-title">{title}</div>
        </div>
      </div>
      <div className="ic-body" dangerouslySetInnerHTML={{__html: body}} />
      <div className="ibox">
        {rows.map(([label, val, color]) => (
          <div key={label} className="ibox-row">
            <div className="ibox-lbl">{label}</div>
            <div className="ibox-val" style={{color: color || 'var(--ink)'}}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function InsightsTab({ expenses, goals, income, peer }) {
  const [sec, setSec] = useState(0)
  const ins = useInsights({ expenses, goals, income, peer })

  // Health ring
  const healthColor = ins.overallScore>=80?'#80d0a0':ins.overallScore>=65?'#c49a6c':ins.overallScore>=45?'#f0c080':'#e08888'
  const healthLabel = ins.overallScore>=80?'Excellent':ins.overallScore>=65?'Good':ins.overallScore>=45?'Fair':'Needs work'
  const arc = (ins.overallScore / 100) * CIRC
  const gap = CIRC - arc

  const SECS = ['Alerts','Benchmarks','Habits','Opportunity','Projections']

  // Helper: alert card per category
  function alertCard(cat, you, peerVal, label, peerLabel) {
    const over  = you - peerVal
    const over0 = over > 0
    const pctOver = Math.round(you / peerVal * 100) - 100
    const ico   = you===0 ? '📊' : over0 ? '🚨' : '✅'
    const icoCls= you===0 ? 'i-sky' : over0 ? 'i-red' : 'i-green'
    const tag   = you===0 ? 'No data' : over0 ? 'Overspending' : 'Under budget'
    const tagCls= over0 ? 't-warn' : 't-win'
    const title = you===0 ? `No ${cat.toLowerCase()} expenses yet`
      : over0 ? `${cat} spend ${Math.abs(pctOver)}% above peers`
      : `${cat} spend ${Math.abs(pctOver)}% below peers — great!`
    const body  = you===0
      ? `Peer avg is ${inr(peerVal)}/mo. Add your first ${cat.toLowerCase()} expense to start tracking.`
      : over0
        ? `You spent <span class="r">${inr(you)}</span> on ${cat.toLowerCase()}. Peers spend ${inr(peerVal)}. That's <span class="r">${inr(Math.abs(over))} extra</span>.`
        : `You spent <span class="g">${inr(you)}</span> on ${cat.toLowerCase()}. <span class="g">${inr(Math.abs(over))} below</span> peer avg of ${inr(peerVal)}.`
    return <BarCard key={cat} ico={ico} icoCls={icoCls} tag={tag} tagCls={tagCls} title={title} body={body} rows={[
      [label,     you,     over0?'#c04030':'#2a7a48', over0?'br':'bgr', inr(you)],
      [peerLabel, peerVal, '',                         'bt',             inr(peerVal)],
    ]} />
  }

  const saved   = ins.saved
  const savePct = income > 0 ? Math.round(saved / income * 100) : 0

  return (
    <div className="tab-page">
      <div style={{padding:'24px 20px 0'}}>
        <div style={{fontFamily:'DM Serif Display, serif', fontSize:32, color:'var(--ink)'}}>Insights</div>
        <div style={{fontSize:12, color:'var(--ink3)', fontWeight:300, marginTop:3}}>Powered by your spending data</div>
      </div>

      {/* Health hero */}
      <div className="health-hero">
        <div className="hh-orb1" /><div className="hh-orb2" />
        <div className="hh-top">
          <div className="hh-ring">
            <svg viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(250,247,242,0.08)" strokeWidth="7" />
              <circle cx="32" cy="32" r="26" fill="none" stroke={healthColor} strokeWidth="7"
                strokeDasharray={`${arc} ${gap}`} strokeDashoffset="41" strokeLinecap="round" />
            </svg>
            <div className="hh-ring-lbl">
              <div className="hh-score">{ins.overallScore}</div>
              <div className="hh-denom">/100</div>
            </div>
          </div>
          <div>
            <div className="hh-title">Financial health: {healthLabel}</div>
            <div className="hh-desc">
              {ins.overallScore>=80?'Managing money really well. Keep it up!'
              :ins.overallScore>=65?'Doing well overall. A few tweaks to hit Excellent.'
              :ins.overallScore>=45?'Some categories need attention.'
              :'Start with food and savings — they move the needle most.'}
            </div>
          </div>
        </div>
        <div className="hh-grid">
          {[
            [ins.budgetScore,'Budgeting'], [ins.saveScore,'Saving'], [25,'Investing'],
            [ins.foodScore,'Food ctrl'],   [ins.goalScore,'Goals'],  [ins.transportScore,'Transport']
          ].map(([val, lbl]) => (
            <div key={lbl} className="hh-box">
              <div className="hh-val">{val}</div>
              <div className="hh-lbl">{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sub tabs */}
      <div className="sub-tabs-wrap">
        <div className="sub-tabs">
          {SECS.map((s, i) => (
            <button key={s} className={`stab ${sec===i?'on':''}`} onClick={() => setSec(i)}>{s}</button>
          ))}
        </div>
      </div>

      {/* ALERTS */}
      {sec === 0 && (
        <div className="card-list">
          {alertCard('Food',      ins.food,      peer.Food,      'You', 'Peer avg')}
          {alertCard('Transport', ins.transport, peer.Transport, 'You', 'City avg')}
          {alertCard('Shopping',  ins.shopping,  peer.Shopping,  'You', 'Peer avg')}
        </div>
      )}

      {/* BENCHMARKS */}
      {sec === 1 && (
        <div className="card-list">
          <BarCard ico="📊" icoCls="i-sky" tag="Benchmark" tagCls="t-bench"
            title="Your spend vs peers your age & city"
            body="How your top categories compare to peers with similar income in your city."
            rows={[
              ['Food',      ins.food,         ins.food>peer.Food?'#c04030':'#2a7a48',           ins.food>peer.Food?'br':'bgr',           inr(ins.food)],
              ['Food avg',  peer.Food,        '',                                                 'bt',                                    inr(peer.Food)],
              ['Transport', ins.transport,    ins.transport>peer.Transport?'#c04030':'#2a7a48', ins.transport>peer.Transport?'br':'bgr', inr(ins.transport)],
              ['Trans avg', peer.Transport,   '',                                                 'bt',                                    inr(peer.Transport)],
            ]}
          />
          <BarCard ico="📉" icoCls="i-red" tag="Savings rate" tagCls="t-bench"
            title="Your savings rate vs peer group"
            body={`You're saving <span class="${savePct>=18?'g':'r'}">${savePct}%</span> of income. Peers save 18% on average.`}
            rows={[
              ['You',     savePct, savePct>=18?'#2a7a48':'#c04030', savePct>=18?'bgr':'br', savePct+'%'],
              ['Peer avg',18,      '',                                'bt',                  '18%'],
              ['Top 10%', 28,      '#2a7a48',                        'bgr',                 '28%+'],
            ]}
          />
        </div>
      )}

      {/* HABITS */}
      {sec === 2 && (
        <div className="card-list">
          {ins.weekendDays > 0 && ins.weekdayDays > 0 && (
            <IboxCard
              ico={ins.weekendOver?'📅':'🗓️'} icoCls={ins.weekendOver?'i-amber':'i-green'}
              tag={ins.weekendOver?'Habit detected':'Good balance'} tagCls={ins.weekendOver?'t-habit2':'t-win'}
              title={ins.weekendOver?`Weekend spending ${ins.wkMultiple}× your weekday average`:'Weekend spending is balanced'}
              body={ins.weekendOver
                ? `You spend <span class="a">${ins.wkMultiple}× more</span> on weekends than weekdays.`
                : `Weekend and weekday spending is <span class="g">well balanced</span> at ${ins.wkMultiple}×.`}
              rows={[
                ['Weekday avg/day', inr(ins.weekdayAvg), ''],
                ['Weekend avg/day', inr(ins.weekendAvg), ins.weekendOver?'#c04030':'#2a7a48'],
              ]}
            />
          )}
          {ins.topDay && (
            <IboxCard ico="🔥" icoCls="i-red" tag="Peak spend day" tagCls="t-habit2"
              title={`Biggest single-day: ${dayLabel(ins.topDay)}`}
              body={`You spent <span class="r">${inr(ins.topDayAmt)}</span> in a single day — ${Math.round(ins.topDayAmt/Math.max(1,ins.total)*100)}% of total spend.`}
              rows={[
                ['Date',      dayLabel(ins.topDay),                                    ''],
                ['Amount',    inr(ins.topDayAmt),                                      '#c04030'],
                ['% of total',Math.round(ins.topDayAmt/Math.max(1,ins.total)*100)+'%', ''],
              ]}
            />
          )}
          {ins.topCat && (
            <IboxCard ico="🔁" icoCls="i-sky" tag="Most frequent" tagCls="t-bench"
              title={`${ins.topCat} is your most frequent spend`}
              body={`You've made <span class="p">${ins.topCatCount} ${ins.topCat} transactions</span> this month.`}
              rows={[
                ['Category',    ins.topCat,                    ''],
                ['Transactions',ins.topCatCount+' times',      ''],
                ['Total spent', inr(ins.ct[ins.topCat]||0),    '#5a3a90'],
              ]}
            />
          )}
          {!ins.topDay && !ins.topCat && (
            <div className="empty-state">Add expenses to detect habits.</div>
          )}
        </div>
      )}

      {/* OPPORTUNITY */}
      {sec === 3 && (
        <div className="card-list">
          <IboxCard ico="💸" icoCls="i-blush" tag="Opportunity cost" tagCls="t-opp2"
            title={`${fmtLakhs(sipFuture(ins.totalLeak,10))} in 10 yrs if overspend was invested`}
            body="Your food & shopping overspend vs peers — if invested at 12% Nifty 50:"
            rows={[
              ['Monthly leak', inr(ins.totalLeak),              '#c04030'],
              ['In 5 years',   inr(sipFuture(ins.totalLeak,5)), '#2a7a48'],
              ['In 10 years',  inr(sipFuture(ins.totalLeak,10)),'#2a7a48'],
              ['In 20 years',  inr(sipFuture(ins.totalLeak,20)),'#2a7a48'],
            ]}
          />
          <IboxCard ico="🌱" icoCls="i-green" tag="SIP opportunity" tagCls="t-opp2"
            title={`${inr(ins.sipAmt)}/mo SIP = ${fmtLakhs(sipFuture(ins.sipAmt,20))} in 20 years`}
            body="Redirect part of your overspend into a Nifty 50 index fund every month."
            rows={[
              ['Suggested SIP', inr(ins.sipAmt)+'/mo',              ''],
              ['In 10 years',   inr(sipFuture(ins.sipAmt,10)),       '#2a7a48'],
              ['In 20 years',   inr(sipFuture(ins.sipAmt,20)),       '#2a7a48'],
            ]}
          />
          {ins.food > peer.Food && (
            <IboxCard ico="✂️" icoCls="i-amber" tag="Quick win" tagCls="t-warn"
              title={`Cut food by 50% → save ${inr(Math.round(ins.foodLeak/2))}/mo`}
              body={`Halving food overspend gives <span class="g">${inr(Math.round(ins.foodLeak/2))}/mo</span> to invest.`}
              rows={[
                ['Potential saving', inr(Math.round(ins.foodLeak/2))+'/mo', '#2a7a48'],
                ['In 10 years',      inr(sipFuture(Math.round(ins.foodLeak/2),10)), '#2a7a48'],
              ]}
            />
          )}
        </div>
      )}

      {/* PROJECTIONS */}
      {sec === 4 && (
        <div className="card-list">
          <IboxCard ico="🔭" icoCls="i-sky" tag="20-year projection" tagCls="t-bench"
            title="What your current savings rate becomes"
            body={`Based on actual savings of <span class="g">${inr(saved)}/mo</span> at 12% index return:`}
            rows={[
              ['Saving/mo',   inr(saved),                              '#2a7a48'],
              ['10 years',    inr(sipFuture(saved,10)),                '#2a7a48'],
              ['20 years',    inr(sipFuture(saved,20)),                '#2a7a48'],
              ['If leaks fixed', fmtLakhs(sipFuture(saved+ins.totalLeak,20)), '#80b060'],
            ]}
          />
          {ins.nearestGoal && (
            <IboxCard ico="🎯" icoCls="i-amber" tag="Nearest goal" tagCls="t-bench"
              title={`${ins.nearestGoal.name} — ${Math.round(ins.nearestGoal.saved/ins.nearestGoal.target*100)}% done`}
              body={`At ${inr(saved)}/mo savings rate:`}
              rows={[
                ['Target',        inr(ins.nearestGoal.target), ''],
                ['Saved',         inr(ins.nearestGoal.saved),  '#2a7a48'],
                ['Still needed',  inr(ins.nearestGoal.target-ins.nearestGoal.saved), '#c04030'],
                ['Months needed', saved>0?Math.ceil((ins.nearestGoal.target-ins.nearestGoal.saved)/saved)+' months':'—', ''],
              ]}
            />
          )}
          <IboxCard ico="🏠" icoCls="i-amber" tag="Life milestone" tagCls="t-bench"
            title="Mumbai down payment at current savings"
            body={`A 10% down payment on ₹80L flat needs ₹8L. At ${inr(saved)}/mo savings:`}
            rows={[
              ['Target',        '₹8,00,000', ''],
              ['Months needed', saved>0?Math.ceil(800000/saved)+' months':'—', ''],
              ['Reach by',      saved>0?new Date(Date.now()+Math.ceil(800000/saved)*30*24*3600*1000).toLocaleDateString('en-IN',{month:'short',year:'numeric'}):'Save more', '#2a7a48'],
            ]}
          />
        </div>
      )}

      <div style={{height:8}} />
    </div>
  )
}
