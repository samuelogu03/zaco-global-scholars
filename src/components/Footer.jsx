export default function Footer() {
  return (
    <footer className="border-t border-[rgba(201,168,76,0.08)] py-14">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-crimson flex items-center justify-center font-display font-black text-gold text-xs border border-gold/20">Z</div>
            <div>
              <div className="font-display font-bold text-[11px] tracking-[0.08em] text-warm-white">ZACO GLOBAL SCHOLARS</div>
              <div className="text-[7px] tracking-[0.2em] text-gold/50 uppercase">Dream Beyond Borders</div>
            </div>
          </div>
          <div className="text-warm-gray text-xs font-light">© {new Date().getFullYear()} ZACO Global Scholars. All rights reserved.</div>
          <div className="text-warm-gray text-xs font-light">🇳🇬 Lagos · 🇵🇭 Manila · 🌍 Worldwide</div>
        </div>
      </div>
    </footer>
  )
}
