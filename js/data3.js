LEADS.push(
  {id:"kp", company:"Keystone Pharmacy", dba:"Keystone", contact:"Rahul Mehta", title:"Pharmacist-Owner", industry:"Independent pharmacy", city:"Jersey City, NJ",
    avg:550000, ask:125000, offer:125000, pos:"1st", rep:"Avery Lang", source:"Partner · RxCapital FG-KP-1142", started:"May 2009", tib:"17 years 4 months",
    entity:"New Jersey Inc", ein:"22-3311142", ssn:"150-09-1142", dob:"February 18, 1972",
    address:"512 Jersey Ave, Jersey City, NJ 07302", appAddress:"512 Jersey Ave, Jersey City, NJ 07302", website:"keystone-rx.com",
    lastAgo:"1w ago",
    mobiles:[{l:"Mobile",n:"(201) 555-0160"},{l:"Mobile 2",n:"(201) 555-0162"},{l:"WhatsApp",n:"(201) 555-0160"}],
    landlines:[{l:"Store",n:"(201) 555-0161"},{l:"Fax",n:"(201) 555-0163"}],
    emails:[{l:"Work",n:"rahul@keystonerx.com"},{l:"Billing",n:"billing@keystonerx.com"},{l:"Personal",n:"rmehta.rph@gmail.com"}],
    nsf:[0,0,0,0,0,0,0,0,0,0,0,0],
    bank:{name:"PNC", acct:"8022111142", routing:"031207607", type:"Checking", adb:44800, bal:50210},
    stmts:[{m:"August 2026", dep:550000, end:50210},{m:"July 2026", dep:556000, end:47800}],
    mtd:{m:"September 2026", dep:61000, bal:50210},
    mca:[{who:"Forge · this file", funded:125000, factor:1.29, daily:672, rem:118400, pos:"1st", started:"Aug 28, 2026", cad:"Daily ACH"}],
    expenses:[["Inventory",90000,"weekly","Wholesaler drafts are the pressure — funded $125k is already covering the next buy-in."],["Pharmacists",38000,"biweekly"],["Rent",7200,"monthly"]],
    files:[{n:"Application",t:"PDF",p:"4p"},{n:"August statement",t:"PDF",p:"7p"},{n:"July statement",t:"PDF",p:"7p"},{n:"June statement",t:"PDF",p:"2p"}],
    notes:[{who:"Avery Lang",when:"1w ago",txt:"Funded $125k. First ACH cleared Aug 29."}],
    sms:[{dir:"in",ch:"sms",t:"1w ago",txt:"Wire landed. Thank you."}],
    mails:[{sub:"Welcome · Keystone funding confirmation",from:"Avery Lang",to:"rahul@keystonerx.com",when:"1w ago",preview:"$125,000 funded. ACH starts next business day."}],
    calls:[],
    activity:[{when:"1w ago",what:"Funded $125,000"},{when:"1w ago",what:"First ACH cleared"}],
    analysis:"Funded. Performing. Independent pharmacy, stable 3rd-party receivables, $550k average.",
    pitch:"Already funded — keep the file warm for a renewal in eight months.",
    use:"Inventory buy-in", fav:false, follow:null
  },
  {id:"ap", company:"Atlas Peak HVAC", dba:"Atlas Peak", contact:"Jonah Hale", title:"Owner", industry:"HVAC residential", city:"Yonkers, NY",
    avg:600000, ask:80000, offer:null, pos:"1st", rep:"Cole Brennan", source:"Cold · list FG-AP-3309", started:"October 2017", tib:"8 years 11 months",
    entity:"New York LLC", ein:"81-2233309", ssn:"084-33-3309", dob:"December 11, 1983",
    address:"220 Saw Mill River Rd, Yonkers, NY 10701", appAddress:"220 Saw Mill River Rd, Yonkers, NY 10701", website:"atlaspeakhvac.com",
    lastAgo:"2w ago",
    mobiles:[{l:"Mobile",n:"(914) 555-0199"},{l:"Mobile 2",n:"(914) 555-2199"},{l:"WhatsApp",n:"(914) 555-0199"}],
    landlines:[{l:"Office",n:"(914) 555-0190"},{l:"Warehouse",n:"(914) 555-0191"}],
    emails:[{l:"Work",n:"jonah@atlaspeakhvac.com"},{l:"Dispatch",n:"jobs@atlaspeakhvac.com"},{l:"Personal",n:"jonah.hale.hvac@gmail.com"}],
    nsf:[0,0,0,0,0,1,0,0,0,0,0,0],
    bank:{name:"M&T", acct:"1104983309", routing:"022000046", type:"Checking", adb:32100, bal:29840},
    stmts:[{m:"August 2026", dep:600000, end:29840},{m:"July 2026", dep:568000, end:27410}],
    mtd:{m:"September 2026", dep:44000, bal:29840},
    mca:[],
    expenses:[["Techs",44000,"weekly","Payroll is the weekly hit. Summer trough is visual — 12-month average still supports $80k."],["Trucks / fuel",12000,"weekly"],["Warehouse",5400,"monthly"]],
    files:[{n:"Application",t:"PDF",p:"2p"},{n:"August statement",t:"PDF",p:"6p"},{n:"July statement",t:"PDF",p:"6p"},{n:"June statement",t:"PDF",p:"1p"}],
    notes:[{who:"Cole Brennan",when:"2w ago",txt:"Seasonal — winter peak. Wants $80k for two more vans before heating season."}],
    sms:[{dir:"out",ch:"sms",t:"2w ago",txt:"Jonah — I’ll need April–August statements to underwrite past the summer dip."}],
    mails:[],
    calls:[{who:"Jonah Hale",dir:"out",dur:"06:40",when:"2w ago",dev:"Poly Edge E450",n:"(914) 555-0199",note:"Discovery. Honest about seasonality."}],
    activity:[{when:"2w ago",what:"Call · 6m 40s"},{when:"2w ago",what:"SMS · statements"}],
    analysis:"Classic HVAC seasonality. File on 12-month $600k average, not last 90. Likely $70–80k 1st at 1.32.",
    pitch:"Jonah, last 90 days would lowball you because summer is the trough. On a 12-month average you’re an $80k first. Send April through August and I can have a number this week.",
    use:"Two vans + tools", fav:false, follow:"2026-09-09"
  }
);

(function seedAccounts() {
  const byId = Object.fromEntries(LEADS.map(l => [l.id, l]));
  byId.ns.accounts = [
    {name:"Chase Business Complete", acct:"4482014419", stmts:[
      {m:"August", dep:250000, end:41220, pages:8},
      {m:"July", dep:258000, end:38640, pages:8},
      {m:"June", dep:244000, end:40110, pages:7},
      {m:"May", dep:261000, end:42840, pages:8}
    ]},
    {name:"Chase Business Select · LIC", acct:"4482099102", stmts:[
      {m:"August", dep:18400, end:6240, pages:4},
      {m:"July", dep:12100, end:4180, pages:3},
      {m:"June", dep:9800, end:3920, pages:3}
    ]}
  ];
  byId.hl.accounts = [
    {name:"TD Bank Business", acct:"3319088821", stmts:[
      {m:"August", dep:300000, end:66740, pages:10},
      {m:"July", dep:312000, end:58110, pages:9},
      {m:"June", dep:298000, end:55200, pages:9},
      {m:"May", dep:310000, end:60410, pages:9}
    ]},
    {name:"TD Fuel card sweep", acct:"3319089104", stmts:[
      {m:"August", dep:48200, end:2100, pages:4},
      {m:"July", dep:51100, end:1860, pages:4}
    ]}
  ];
  byId.mw.accounts = [
    {name:"Chase", acct:"3301199088", stmts:[
      {m:"August", dep:500000, end:32100, pages:8},
      {m:"July", dep:504000, end:28840, pages:8},
      {m:"June", dep:498000, end:30110, pages:8},
      {m:"May", dep:510000, end:33400, pages:8}
    ]},
    {name:"Chase Dining", acct:"3301199921", stmts:[
      {m:"August", dep:22000, end:4100, pages:3},
      {m:"July", dep:19400, end:3880, pages:3}
    ]}
  ];
  byId.bd.accounts = [{name:"Wells Fargo Practice", acct:"2081142204", stmts:[
    {m:"August", dep:350000, end:71800, pages:6},
    {m:"July", dep:351000, end:64010, pages:6},
    {m:"June", dep:339000, end:61240, pages:6},
    {m:"May", dep:348000, end:66800, pages:6}
  ]}];
  byId.kp.accounts = [{name:"PNC", acct:"8022111142", stmts:[
    {m:"August", dep:550000, end:50210, pages:7},
    {m:"July", dep:556000, end:47800, pages:7},
    {m:"June", dep:542000, end:46110, pages:7},
    {m:"May", dep:548000, end:48940, pages:7},
    {m:"April", dep:538000, end:45200, pages:6},
    {m:"March", dep:534000, end:44100, pages:6}
  ]}];
  byId.ro.accounts = [{name:"Bank of America", acct:"9910047730", stmts:[
    {m:"August", dep:400000, end:22120, pages:8},
    {m:"July", dep:408000, end:18400, pages:8},
    {m:"June", dep:388000, end:20110, pages:7}
  ]}];
  byId.lu.accounts = [{name:"Mercury", acct:"2044885501", stmts:[
    {m:"August", dep:450000, end:47450, pages:5},
    {m:"July", dep:438000, end:40110, pages:5},
    {m:"June", dep:422000, end:36840, pages:5}
  ]}];
  byId.ap.accounts = [{name:"M&T", acct:"1104983309", stmts:[
    {m:"August", dep:600000, end:29840, pages:6},
    {m:"July", dep:568000, end:27410, pages:6},
    {m:"June", dep:548000, end:26100, pages:6},
    {m:"May", dep:610000, end:33200, pages:6}
  ]}];
})();
