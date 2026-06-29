function Footer() {
  return (
    <footer style={{ backgroundColor: '#0f172a', borderTop: '1px solid #1e293b', padding: '2rem 1.5rem', fontSize: '0.875rem', color: '#64748b' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
        <div>
          <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '1.1rem' }}>UnaHur Anti-Social Net</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', borderTop: '1px solid #1e293b', paddingTop: '1rem' }}>
          <a href="#about" style={{ color: '#64748b', textDecoration: 'none' }}>Sobre Nosotros</a>
          <a href="" style={{ color: '#64748b', textDecoration: 'none' }}>Términos y condiciones</a>
          <a href="https://github.com/toralessantiago/antisocial-net-frontend.git" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'none' }}>GitHub Repo</a>
        </div>
      </div>
      <span>© 2026. Todos los derechos reservados.</span>
    </footer>
  );
}

export default Footer;