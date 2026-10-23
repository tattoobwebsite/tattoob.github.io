# Tattoo B — MVP

Sitio estático (5 páginas: Inicio, Portafolio, Servicios, Flash, Contacto) + Cloud Function para el formulario.

## 1. Publicar en GitHub Pages
1. Sube el contenido de esta carpeta (sin `functions/` si quieres) a un repo.
2. Settings → Pages → Deploy from branch → `main` / `(root)`.
3. Las rutas son relativas: funciona en `usuario.github.io/repo/`.

## 2. Formulario (Cloud Function + Gmail)
1. Activa la verificación en 2 pasos en la cuenta Gmail y crea una *contraseña de aplicación*.
2. Guárdala en Secret Manager:
   `printf 'LA_CLAVE' | gcloud secrets create gmail-app-password --data-file=-`
3. Despliega (desde `functions/`):
```
gcloud functions deploy tattoo-b-contact --gen2 --runtime=nodejs20 --region=us-central1 \
  --entry-point=contact --trigger-http --allow-unauthenticated --max-instances=3 \
  --set-env-vars=ALLOWED_ORIGIN=https://USUARIO.github.io,GMAIL_USER=tattoob.dummy@gmail.com,TO_EMAIL=tattoob.dummy@gmail.com \
  --set-secrets=GMAIL_APP_PASSWORD=gmail-app-password:latest
```
   (Dale acceso al secreto a la cuenta de servicio de la función: rol *Secret Manager Secret Accessor*.)
4. Copia la URL resultante en `ENDPOINT` al inicio de `js/main.js`.

## 3. Personalizar
- Correo, dirección, horario y WhatsApp (dummy) están en el pie de cada página y en `contacto.html`.
- Imágenes: las ilustraciones están en `img/flash.svg`. Para fotos reales, usa `<img>` con archivos WebP en `img/`.
- Colores: variables `:root` en `css/styles.css`.
- Nota: las ilustraciones usan `<use>` externo; abre el sitio con un servidor (`python -m http.server`), no con doble clic.
