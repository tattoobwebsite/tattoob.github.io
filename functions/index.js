const nodemailer = require('nodemailer');
const ORIGIN = process.env.ALLOWED_ORIGIN; // ej: https://usuario.github.io
const clean = (v, n) => String(v || '').trim().slice(0, n);
exports.contact = async (req, res) => {
  res.set({ 'Access-Control-Allow-Origin': ORIGIN, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' });
  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (req.method !== 'POST' || req.get('origin') !== ORIGIN) return res.status(403).send('Forbidden');
  const b = req.body || {};
  if (b.website) return res.json({ ok: true }); // honeypot
  const d = { nombre: clean(b.nombre, 80), email: clean(b.email, 120), telefono: clean(b.telefono, 30), servicio: clean(b.servicio, 40),
    diseno: clean(b.diseno, 80), zona: clean(b.zona, 80), mensaje: clean(b.mensaje, 1500) };
  if (!d.nombre || !/^\S+@\S+\.\S+$/.test(d.email) || !d.mensaje) return res.status(400).json({ error: 'Datos incompletos' });
  try {
    const t = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD } });
    const from = `Tattoo B <${process.env.GMAIL_USER}>`;
    await t.sendMail({ from, to: process.env.TO_EMAIL, replyTo: d.email, subject: `Nueva solicitud: ${d.nombre}`,
      text: Object.entries(d).map(([k, v]) => `${k}: ${v}`).join('\n') });
    await t.sendMail({ from, to: d.email, subject: 'Recibimos tu solicitud · Tattoo B',
      text: `Hola ${d.nombre}, recibimos tu solicitud y te responderemos en 24 horas.\n\nTattoo B` });
    res.json({ ok: true });
  } catch (e) { console.error(e); res.status(500).json({ error: 'No se pudo enviar' }); }
};
