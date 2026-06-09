window.MARKET_DATA = {
  date: "2026-06-09",
  dateLabel: "9 czerwca 2026 · wtorek",
  generatedLabel: "Migawka rynkowa z 9 czerwca 2026; USA po zamknieciu, czesc Europy/FX/krypto jako dane intraday z dostepnych serwisow",
  today: [
    { icon:"◆", type:"ind", title:"Wall Street mieszana", sub:"S&P 500 +0,30%, Nasdaq +0,86%, Dow -0,16% po rotacji w strone technologii." },
    { icon:"↑", type:"pos", title:"Europa i Azja selektywne", sub:"Nikkei mocno w gore, DAX slabiej, FTSE blisko zera; GPW w poludnie dodatnia." },
    { icon:"↓", type:"neg", title:"Krypto pod presja", sub:"Bitcoin ok. 62,6 tys. USD, slabiej dzien do dnia; Solana rowniez na minusie." },
    { icon:"◆", type:"ind", title:"USD/PLN nizej rano", sub:"Dolar ok. 3,68 PLN, EUR/PLN ok. 4,24; zloty stabilniejszy niz w poprzedniej migawce." }
  ],
  indices: [
    { id:"sp500", label:"S&P 500", sub:"USA · zamkniecie", value:"7 405,73", change:0.30, changePt:"+21,99 pkt", dir:"up" },
    { id:"nasdaq", label:"Nasdaq Composite", sub:"USA · zamkniecie", value:"25 929,66", change:0.86, changePt:"+220,23 pkt", dir:"up" },
    { id:"dow", label:"Dow Jones", sub:"USA · zamkniecie", value:"50 786,01", change:-0.16, changePt:"-80,77 pkt", dir:"dn" },
    { id:"wig20", label:"WIG20", sub:"Polska · intraday 12:36", value:"3 656,97", change:0.78, changePt:"+28,41 pkt", dir:"up" },
    { id:"dax", label:"DAX", sub:"Niemcy · 9 czerwca", value:"24 616", change:-0.58, changePt:"dane dzienne", dir:"dn" },
    { id:"ftse", label:"FTSE 100", sub:"UK · 9 czerwca", value:"10 373", change:0.05, changePt:"dane dzienne", dir:"up" },
    { id:"nikkei", label:"Nikkei 225", sub:"Japonia · 9 czerwca", value:"65 158", change:1.77, changePt:"dane dzienne", dir:"up" },
    { id:"hsi", label:"Hang Seng", sub:"Hong Kong · 9 czerwca", value:"24 657", change:0.10, changePt:"dane dzienne", dir:"up" }
  ],
  indexLegend: [
    { id:"sp500", name:"S&P 500", desc:"500 najwiekszych spolek USA; globalny benchmark apetytu na ryzyko." },
    { id:"nasdaq", name:"Nasdaq Composite", desc:"Szeroki indeks spolek notowanych na NASDAQ, mocno wrazliwy na technologie i AI." },
    { id:"dow", name:"Dow Jones", desc:"30 dojrzalych blue chipow USA, czesto bardziej defensywnych niz Nasdaq." },
    { id:"wig20", name:"WIG20", desc:"20 najwiekszych i najbardziej plynnych spolek warszawskiej GPW." },
    { id:"dax", name:"DAX", desc:"40 najwiekszych niemieckich spolek, wrazliwy na eksport i przemysl." },
    { id:"ftse", name:"FTSE 100", desc:"Brytyjski indeks duzych spolek, z duzym udzialem energii i finansow." },
    { id:"nikkei", name:"Nikkei 225", desc:"Japonski indeks blue chipow, wrazliwy na jena i globalny cykl." },
    { id:"hsi", name:"Hang Seng", desc:"Gielda Hong Kongu; ekspozycja na Chiny, banki i technologie." }
  ],
  sectors: [
    { name:"Polprzewodniki", change:2.40, dir:"up" },
    { name:"Technologia", change:1.80, dir:"up" },
    { name:"Uslugi komunikacyjne", change:1.50, dir:"up" },
    { name:"Energia", change:1.20, dir:"up" },
    { name:"Finanse", change:0.90, dir:"up" },
    { name:"Dobra konsumenckie", change:0.60, dir:"up" },
    { name:"Opieka zdrowotna", change:0.30, dir:"up" },
    { name:"Przemysl", change:-0.10, dir:"nt" },
    { name:"Utilities", change:-0.20, dir:"dn" },
    { name:"Materialy", change:-0.40, dir:"dn" },
    { name:"Nieruchomosci", change:-0.70, dir:"dn" }
  ],
  crypto: [
    { name:"Bitcoin", ticker:"BTC/USD", value:"$62 639,66", change:-1.45, dir:"dn", color:"#b56a00" },
    { name:"Ethereum", ticker:"ETH/USD", value:"$1 688,61", change:1.32, dir:"up", color:"#4a5a9a" },
    { name:"Solana", ticker:"SOL/USD", value:"$65,75", change:-1.51, dir:"dn", color:"#6b3fd1" }
  ],
  forex: [
    { pair:"USD/PLN", value:"3,68", change:-0.14, dir:"dn", note:"Business Insider, godz. 07:03" },
    { pair:"EUR/PLN", value:"4,24", change:-0.04, dir:"dn", note:"Business Insider, godz. 07:03" },
    { pair:"EUR/USD", value:"1,15", change:0.12, dir:"up", note:"Business Insider, godz. 07:03" },
    { pair:"CHF/PLN", value:"4,61", change:-0.03, dir:"dn", note:"Business Insider, godz. 07:03" }
  ],
  commodities: [
    { name:"Ropa Brent", value:"~$95", change:0.0, dir:"nt", note:"okolice 95 USD/bbl, rynek czeka na OPEC+ i Hormuz" },
    { name:"Zloto", value:"~$4 490", change:-0.2, dir:"dn", note:"miesieczna migawka BMO / rynek metali" },
    { name:"Miedz", value:"~$6,27/lb", change:1.57, dir:"up", note:"metal wspierany popytem infrastruktury AI" },
    { name:"Gaz TTF", value:"b/d", change:0.0, dir:"nt", note:"brak jednolitego odczytu w uzytych zrodlach" }
  ],
  topMovers: {
    usa: {
      gainers: [
        { ticker:"INTC", name:"Intel Corp.", exchange:"NASDAQ", change:10.0, barPct:88, reason:"zamowienia AI i odbicie w polprzewodnikach" },
        { ticker:"MRVL", name:"Marvell Technology", exchange:"NASDAQ", change:8.8, barPct:77, reason:"popyt na infrastrukture AI" },
        { ticker:"MU", name:"Micron Technology", exchange:"NASDAQ", change:7.1, barPct:66, reason:"AI memory demand" },
        { ticker:"AVGO", name:"Broadcom", exchange:"NASDAQ", change:5.9, barPct:58, reason:"silny sektor chipow" }
      ],
      losers: [
        { ticker:"ROIV", name:"Roivant Sciences", exchange:"NASDAQ", change:-3.8, barPct:43, reason:"presja po danych klinicznych" },
        { ticker:"GO", name:"Grocery Outlet", exchange:"NYSE", change:-3.3, barPct:37, reason:"slabsza dynamika sprzedazy" },
        { ticker:"PGR", name:"Progressive", exchange:"NYSE", change:-2.0, barPct:25, reason:"obawy o koszty szkod" },
        { ticker:"XOM", name:"ExxonMobil", exchange:"NYSE", change:-1.4, barPct:18, reason:"spadek premii na ropie" }
      ]
    },
    gpw: {
      gainers: [
        { ticker:"PKN", name:"Orlen", exchange:"GPW", change:2.4, barPct:50, reason:"marze rafineryjne i energia" },
        { ticker:"CDR", name:"CD Projekt", exchange:"GPW", change:2.0, barPct:42, reason:"lepszy sentyment do gamingu" },
        { ticker:"DNP", name:"Dino Polska", exchange:"GPW", change:1.6, barPct:34, reason:"defensywny handel detaliczny" }
      ],
      losers: [
        { ticker:"KGH", name:"KGHM", exchange:"GPW", change:-2.2, barPct:44, reason:"realizacja zyskow po miedzi" },
        { ticker:"PKO", name:"PKO BP", exchange:"GPW", change:-1.4, barPct:28, reason:"slabszy sentyment do bankow" },
        { ticker:"LPP", name:"LPP", exchange:"GPW", change:-1.1, barPct:22, reason:"presja na detal" }
      ]
    }
  },
  macro: [
    { icon:"↑", type:"pos", tag:"Pozytywny", title:"Deeskalacja wspiera ryzyko", explain:"Mniejsza premia geopolityczna przesuwa kapital w strone akcji, krypto i sektorow cyklicznych." },
    { icon:"◆", type:"ind", tag:"Branzowy", title:"AI pozostaje glowna narracja", explain:"Najmocniejszy popyt skupia sie wokol polprzewodnikow, pamieci i infrastruktury centr danych." },
    { icon:"↓", type:"neg", tag:"Negatywny", title:"Fed nie musi sie spieszyc", explain:"Silniejsze dane z rynku pracy obnizaja prawdopodobienstwo szybkich cieć stop, co wspiera dolara." },
    { icon:"↑", type:"pos", tag:"Polska", title:"WIG20 dodatni intraday", explain:"Odczyt z poludnia pokazywal WIG20 +0,78%, przy stabilniejszym USD/PLN i lepszym sentymencie lokalnym." }
  ],
  dailyChart: {
    labels:["09:30","10:30","11:30","12:30","13:30","14:30","15:30","16:00"],
    sp500:[0.00,0.05,0.12,0.10,0.18,0.24,0.28,0.30],
    wig20:[0.00,0.14,0.28,0.35,0.48,0.61,0.72,0.78]
  },
  yearlyChart: {
    labels:["cze","lip","sie","wrz","paz","lis","gru","sty","lut","mar","kwi","maj","cze"],
    sp500:[100,103,99,105,108,106,113,116,112,118,121,124,124.4],
    wig20:[100,101,97,99,96,94,98,102,101,104,106,105,105.8],
    nasdaq:[100,104,101,108,112,109,118,122,119,127,131,135,136.2],
    btc:[100,108,103,112,118,115,126,122,130,138,132,143,140.9]
  },
  yearlyEvents: [
    { x:2, type:"neg", label:"Sie 25", title:"Ryzyko geopolityczne", text:"Podwyzszona zmiennosc i ucieczka do bezpiecznych aktywow." },
    { x:4, type:"pos", label:"Paz 25", title:"Fed pauzuje", text:"Rynek wycenia koniec cyklu zaostrzania." },
    { x:5, type:"neg", label:"Lis 25", title:"Europa slabnie", text:"Dane przemyslowe pogarszaja nastroje wobec regionu." },
    { x:6, type:"pos", label:"Gru 25", title:"Euforia AI", text:"Technologia ciagnie indeksy na nowe maksima." },
    { x:11, type:"ind", label:"Maj 26", title:"Mocne payrolls", text:"Dolar zyskuje, obligacje reaguja wzrostem rentownosci." }
  ],
  centralBanks: [
    { bank:"Fed", rate:"4.50-4.75%", stance:"jastrzebio-neutralny", next:"rynek czeka na inflacje i payrolls" },
    { bank:"ECB", rate:"3.75%", stance:"ostrozny", next:"tempo obnizek zalezne od uslug" },
    { bank:"NBP", rate:"5.75%", stance:"wait-and-see", next:"presja plac i inflacja bazowa" },
    { bank:"BoJ", rate:"0.25%", stance:"normalizacja", next:"uwaga na kurs jena" }
  ],
  bonds10y: [
    { country:"USA", yield:"4.42%", change:"+6 pb", dir:"up" },
    { country:"Niemcy", yield:"2.58%", change:"+2 pb", dir:"up" },
    { country:"Polska", yield:"5.62%", change:"+4 pb", dir:"up" },
    { country:"Japonia", yield:"1.05%", change:"−1 pb", dir:"dn" }
  ],
  narrative: [
    "Rynek 9 czerwca 2026 jest mieszany: Nasdaq i S&P 500 rosna, Dow lekko spada, a WIG20 w poludnie jest na plusie.",
    "Glowna os narracji to technologia i polprzewodniki kontra presja rentownosci oraz slabsze krypto.",
    "Dla Polski wazne jest to, ze zloty rano byl stabilniejszy, a WIG20 pokazywal dodatnia zmiane intraday."
  ],
  archive: [
    { date:"2026-06-09", title:"USA mieszane: S&P 500 +0,30%, Nasdaq +0,86%, Dow -0,16%" },
    { date:"2026-06-08", title:"Przygotowanie rynku pod dane i rotacje sektorowe" },
    { date:"2026-06-07", title:"Krypto i surowce podwyzszonej zmiennosci" }
  ]
};


