function Footer() {
  return (
    <footer style={{backgroundColor: '#2e2e2e', padding: '2rem 1.5rem', fontSize: '0.875rem', color: '#64748b'}}>
      <div style={{maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center'}}>
        <div>
          <div style={{fontWeight: 'bold', color: '#ffffff', fontSize: '1.1rem'}}>UnaHur Anti-Social Net</div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', gap: '1.5rem', borderTop: '1px solid #ffffff', paddingTop: '1rem'}}>
          <a href="https://www.argentina.gob.ar/terminos-y-condiciones" style={{color: '#ffffff', textDecoration: 'none'}}>Términos y condiciones</a>
          <a href="https://github.com/toralessantiago/antisocial-net-frontend.git" target="_blank" rel="noreferrer" style={{ color: '#ffffff', textDecoration: 'none'}}>GitHub</a>
        </div>
      </div>
      <span style={{color: '#ffffff'}}>© 2026. Todos los derechos reservados.</span>
    </footer>
  );
}

export default Footer;