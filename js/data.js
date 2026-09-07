const DEVICES = [
  {id:"poly", name:"Poly Edge E450", kind:"Desk", did:"(212) 555-0140", on:true},
  {id:"mobile", name:"iPhone 16 Pro", kind:"Cellular", did:"(917) 555-0166", on:true},
  {id:"bt", name:"AirPods Pro", kind:"Bluetooth", did:"via iPhone", on:true},
  {id:"web", name:"Forge desktop", kind:"PC / WebRTC", did:"(212) 555-0140", on:true},
  {id:"backup", name:"Backup DID", kind:"Twilio", did:"(646) 555-0199", on:false}
];
const LEADS = [
  {id:"ns", company:"Northstar Catering Co.", dba:"Northstar", contact:"Elena Voss", title:"Owner / CEO", industry:"Catering · 2 units", city:"Manhattan, NY",
    avg:250000, ask:150000, offer:125000, pos:"2nd", rep:"Cole Brennan", source:"ISO · Harbor Point FG-NS-1844", started:"March 2019", tib:"7 years 6 months",
    entity:"New York S-Corporation", ein:"11-2234419", ssn:"078-05-1120", dob:"March 14, 1984",
    address:"412 W 37th St, New York, NY 10018", appAddress:"88 Gold St, Long Island City, NY 11101", website:"northstarcatering.com",
    lastAgo:"30m ago",
    mobiles:[{l:"Mobile",n:"(917) 555-0142"},{l:"Mobile 2",n:"(917) 555-8831"},{l:"WhatsApp",n:"(347) 555-0142"}],
    landlines:[{l:"Office",n:"(212) 555-0188"},{l:"Kitchen",n:"(212) 555-0160"}],
    emails:[{l:"Work",n:"elena@northstarcatering.com"},{l:"Ops",n:"ops@northstarcatering.com"},{l:"Personal",n:"elena.voss@gmail.com"}],
    nsf:[0,0,1,0,0,0,1,0,2,1,1,0],
    bank:{name:"Chase Business Complete", acct:"4482014419", routing:"021000021", type:"Checking", adb:28400, bal:41220},
    stmts:[{m:"August 2026", dep:250000, end:41220},{m:"July 2026", dep:258000, end:38640}],
    mtd:{m:"September 2026", dep:41800, bal:41220},
    mca:[{who:"RapidCap", funded:85000, factor:1.38, daily:612, rem:41200, pos:"1st", started:"May 2026", cad:"Daily ACH"}],
    expenses:[["COGS / food",62000,"monthly","Largest cash-flow pressure — food vendors draft 3–4x a week and leave little slack after RapidCap."],["Payroll",48000,"biweekly"],["Rent (2 sites)",14200,"monthly"],["RapidCap ACH",13464,"daily"]],
    files:[{n:"Application",t:"PDF",p:"4p"},{n:"August statement",t:"PDF",p:"8p"},{n:"July statement",t:"PDF",p:"8p"},{n:"June statement",t:"PDF",p:"2p"}],
    notes:[{who:"Cole Brennan",when:"Today 6:14 AM",txt:"Elena walked the LIC buildout on FaceTime. Hood and fire-suppression already in. Wants funds before Oct 1 so she can order equipment without stacking a third advance."}],
    sms:[
      {dir:"in",ch:"wa",n:"(347) 555-0142",t:"Thu 7:21 PM",txt:"Cole — Priya uploaded August last night. Sysco double-draft reversed same day. ✅"},
      {dir:"out",ch:"wa",n:"(347) 555-0142",t:"Thu 7:36 PM",txt:"Got it. Numbers look clean. I’ll have a term sheet tomorrow."},
      {dir:"in",ch:"sms",n:"(917) 555-0142",t:"Yesterday 5:02 PM",txt:"Any word? Landlord wants the remaining deposit Monday 😬"},
      {dir:"out",ch:"sms",n:"(917) 555-0142",t:"Yesterday 5:11 PM",txt:"Term sheet is in your inbox. $125k second position. Call you at 2 tomorrow to walk it."},
      {dir:"in",ch:"sms",n:"(917) 555-8831",t:"Tue 11:02 AM",txt:"This is Elena’s other line — use 0142 for daytime."}
    ],
    mails:[
      {sub:"Northstar Catering — $125k second position term sheet",from:"Cole Brennan",to:"elena@northstarcatering.com",when:"Yesterday 5:09 PM",preview:"Elena — attached is the term sheet we discussed. $125,000, factor 1.32, 10 months, ACH $548/day. RapidCap stays first."},
      {sub:"Stips outstanding · 2025 return",from:"Maya Chen",to:"elena@northstarcatering.com",when:"Wed 4:12 PM",preview:"Need the 2025 1120-S to lock the file. Everything else is in."}
    ],
    calls:[
      {who:"Elena Voss",dir:"out",dur:"12:04",when:"Yesterday 2:16 PM",dev:"Poly Edge E450",n:"(917) 555-0142",note:"Walked term sheet. She’s comparing a 1.41 first-position offer from SwiftFund."},
      {who:"Elena Voss",dir:"in",dur:"03:22",when:"Thu 9:41 AM",dev:"iPhone 16 Pro",n:"(917) 555-0142",note:"Asked if we can fund next week."}
    ],
    activity:[
      {when:"30m ago",what:"SMS to Elena Voss · term sheet follow-up"},
      {when:"Yesterday 5:09 PM",what:"Email sent · $125k term sheet"},
      {when:"Yesterday 2:16 PM",what:"Call · Elena Voss · 12m 04s · Poly desk"}
    ],
    analysis:"$250k average monthly deposits. RapidCap first at $612/day (~$13.4k/mo). Combined with a $125k 2nd at 1.32 / 10 mo ($548/day) holdback stays under 19% of daily deposits.",
    pitch:"Elena, you clear $250k a month across both kitchens. RapidCap is a comfortable first. A $125k second at 1.32 keeps combined daily under 19% of deposits — and that’s before Aramark starts in October. Don’t refinance RapidCap into a 1.41 first; stack cheaper money behind it and buy the LIC equipment on time.",
    use:"LIC kitchen equipment + opening float", fav:true, follow:"2026-09-05"
  },
  {id:"hl", company:"Harborline Logistics", dba:"Harborline", contact:"Marcus Chen", title:"President", industry:"Trucking · 18 cabs", city:"Newark, NJ",
    avg:300000, ask:200000, offer:175000, pos:"1st", rep:"Cole Brennan", source:"Inbound web FG-HL-2091", started:"June 2016", tib:"10 years 3 months",
    entity:"New Jersey LLC", ein:"22-1188821", ssn:"142-22-8831", dob:"August 2, 1979",
    address:"88 Doremus Ave, Newark, NJ 07105", appAddress:"88 Doremus Ave, Newark, NJ 07105", website:"harborlinelog.com",
    lastAgo:"1h ago",
    mobiles:[{l:"Mobile",n:"(973) 555-0144"},{l:"Mobile 2",n:"(973) 555-2290"},{l:"WhatsApp",n:"(973) 555-0144"}],
    landlines:[{l:"Dispatch",n:"(973) 555-0170"},{l:"Office",n:"(973) 555-0171"}],
    emails:[{l:"Work",n:"marcus@harborlinelog.com"},{l:"Controller",n:"alba@harborlinelog.com"},{l:"Personal",n:"mchen.haul@gmail.com"}],
    nsf:[0,1,0,0,0,0,0,1,0,0,0,0],
    bank:{name:"TD Bank Business", acct:"3319088821", routing:"031201360", type:"Checking", adb:41200, bal:66740},
    stmts:[{m:"August 2026", dep:300000, end:66740},{m:"July 2026", dep:312000, end:58110}],
    mtd:{m:"September 2026", dep:48200, bal:66740},
    mca:[],
    expenses:[["Driver payroll",110000,"weekly","Largest pressure — payroll hits every Friday and fuel floats mid-week."],["Fuel",48000,"weekly"],["Insurance",19000,"monthly"],["Lease trucks",22000,"monthly"]],
    files:[{n:"Application",t:"PDF",p:"3p"},{n:"August statement",t:"PDF",p:"10p"},{n:"July statement",t:"PDF",p:"9p"},{n:"June statement",t:"PDF",p:"2p"}],
    notes:[{who:"Cole Brennan",when:"1h ago",txt:"Clean 1st position. Wants $200k for 4 additional daycabs. $175k is the box unless loss-runs land."}],
    sms:[{dir:"out",ch:"sms",t:"1h ago",txt:"Marcus — send the loss-runs and I can push $200k to credit."},{dir:"in",ch:"sms",t:"52m ago",txt:"Alba will email them Monday."}],
    mails:[{sub:"Harborline — file opening",from:"Cole Brennan",to:"marcus@harborlinelog.com",when:"Wed 9:14 AM",preview:"Opened a 1st-position file. Target $175–200k pending insurance."}],
    calls:[{who:"Marcus Chen",dir:"out",dur:"08:41",when:"1h ago",dev:"Poly Edge E450",n:"(973) 555-0144",note:"Discovery. Clean books. Fuel spike in Feb explained."}],
    activity:[{when:"1h ago",what:"Call · 8m 41s"},{when:"52m ago",what:"SMS · loss-runs"}],
    analysis:"True 1st. $300k average. Insurance loss-runs are the only open stip.",
    pitch:"Marcus, you’re a clean first. Deposits support $200k but credit wants loss-runs before we stretch past $175k. Nine-month 1.28 on $175k sits well inside 10% of daily deposits.",
    use:"Four additional daycabs", fav:false, follow:"2026-09-08"
  }
];
