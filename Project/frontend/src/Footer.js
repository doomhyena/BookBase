export default function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(90deg, #ff6f61 0%, #ffb347 100%)",
        padding: "36px 0 12px 0",
        color: "#fff",
        marginTop: "40px",
        boxShadow: "0 -2px 24px rgba(0,0,0,0.10)",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "10px", display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18 }}>
        <a
          href="#"
          style={{
            color: "#fff",
            fontFamily: "inherit",
            fontSize: "1.13rem",
            padding: "6px 18px",
            borderRadius: 16,
            textDecoration: "none",
            fontWeight: 600,
            background: "rgba(255,255,255,0.08)",
            transition: "background 0.2s, color 0.2s",
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
          }}
          onMouseOver={e => e.currentTarget.style.background = '#fff4'}
          onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
        >
          Kezdőlap
        </a>
        <span style={{ color: "#fff", fontSize: 22, opacity: 0.7 }}>•</span>
        <a
          href="https://doomhyena.hu/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#fff",
            fontFamily: "inherit",
            fontSize: "1.13rem",
            padding: "6px 18px",
            borderRadius: 16,
            textDecoration: "none",
            fontWeight: 600,
            background: "rgba(255,255,255,0.08)",
            transition: "background 0.2s, color 0.2s",
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
          }}
          onMouseOver={e => e.currentTarget.style.background = '#fff4'}
          onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
        >
          Kapcsolat
        </a>
        <span style={{ color: "#fff", fontSize: 22, opacity: 0.7 }}>•</span>
        <a
          href="#"
          style={{
            color: "#fff",
            fontFamily: "inherit",
            fontSize: "1.13rem",
            padding: "6px 18px",
            borderRadius: 16,
            textDecoration: "none",
            fontWeight: 600,
            background: "rgba(255,255,255,0.08)",
            transition: "background 0.2s, color 0.2s",
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
          }}
          onMouseOver={e => e.currentTarget.style.background = '#fff4'}
          onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
        >
          Info
        </a>
      </div>
      <p
        style={{
          textAlign: "center",
          color: "#fff",
          fontFamily: "inherit",
          fontSize: "1.05rem",
          fontWeight: 600,
          fontStyle: "italic",
          margin: 0,
          opacity: 0.88,
          letterSpacing: 0.5,
          textShadow: '0 1px 4px #ffb34744'
        }}
      >
        Copyright © 2025 BookBase
      </p>
    </footer>
  );
}
