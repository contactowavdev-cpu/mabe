# Operación SEO de WavDev

## Configuración inicial

1. Verificar `wavdev.lat` como propiedad de dominio en Google Search Console mediante DNS.
2. Enviar `https://wavdev.lat/sitemap-index.xml`.
3. Solicitar indexación de la portada, índices, servicios, soluciones, recursos y casos.
4. Importar la propiedad en Bing Webmaster Tools.
5. Configurar en Railway:
   - `PUBLIC_GA_MEASUREMENT_ID`
   - `PUBLIC_GOOGLE_SITE_VERIFICATION` si se utiliza verificación HTML.
   - `PUBLIC_BING_SITE_VERIFICATION` si se utiliza verificación HTML.
6. Confirmar en GA4 DebugView los eventos `generate_lead`, `form_submit`, `quote_click`, `whatsapp_click`, `phone_click` y `email_click`.

## Google Business Profile

- Mantener nombre, teléfono, dominio y categoría consistentes.
- Enlazar servicios con sus URLs y parámetros UTM.
- Publicar una actualización semanal.
- Solicitar reseñas únicamente a clientes reales.
- No presentar áreas de servicio como oficinas.

Ejemplo:

```text
https://wavdev.lat/servicios/sistemas-a-la-medida/?utm_source=google_business_profile&utm_medium=organic&utm_campaign=servicios
```

## Tablero mensual

| Métrica | Fuente |
|---|---|
| URLs indexadas | Search Console |
| Impresiones y clics sin marca | Search Console |
| CTR y posición por página | Search Console |
| Consultas Top 20, Top 10 y Top 3 | Search Console |
| Leads y conversión orgánica | GA4 |
| LCP, INP y CLS | Search Console / PageSpeed |

Excluir de las consultas sin marca las variaciones `wavdev`, `wav dev` y el dominio.

## Cadencia editorial

- Publicar dos recursos originales al mes.
- Revisar autoría, fuentes, ejemplos y enlaces antes de publicar.
- Actualizar piezas con impresiones y CTR bajo.
- No generar páginas por ciudad sin contenido realmente diferenciado.
- No publicar métricas, clientes o testimonios sin autorización verificable.
