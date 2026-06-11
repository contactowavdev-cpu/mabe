export const GROWTH_PAGES = [
  {
    slug: 'sistema-pos-guatemala',
    section: 'soluciones',
    shortTitle: 'Sistema POS',
    title: 'Sistema POS y punto de venta en Guatemala',
    description: 'Desarrollamos sistemas POS para controlar ventas, caja, productos, inventario y sucursales desde una operación centralizada.',
    keyword: 'sistema POS Guatemala',
    eyebrow: 'Punto de venta para comercios',
    intro: [
      'Un sistema POS debe permitir cobrar con rapidez sin perder el control de productos, existencias, turnos y movimientos de caja. Cuando la venta funciona en una herramienta y el inventario en otra, aparecen diferencias que consumen tiempo y afectan las decisiones de compra.',
      'WavDev diseña soluciones de punto de venta según el tipo de comercio, cantidad de sucursales, conexión disponible, hardware y sistemas existentes. El alcance puede comenzar con caja e inventario y crecer hacia compras, clientes, reportes, comercio electrónico o facturación.',
    ],
    sections: [
      {
        heading: 'Ventas y caja con trazabilidad',
        paragraphs: [
          'El flujo puede incluir apertura y cierre de turno, medios de pago, descuentos autorizados, devoluciones, anulaciones y comprobantes. Los permisos determinan quién puede cambiar precios, aplicar promociones o corregir una operación.',
          'Los cortes muestran ventas, movimientos y diferencias por caja o responsable. La información queda disponible para supervisión sin depender de consolidar archivos al final del día.',
        ],
      },
      {
        heading: 'Inventario conectado con cada venta',
        paragraphs: [
          'Cada transacción descuenta existencias y conserva el movimiento asociado. El sistema puede manejar productos, variantes, códigos de barras, mínimos, máximos, traslados y bodegas según el alcance acordado.',
          'Las alertas ayudan a identificar productos con poca existencia, diferencias frecuentes o rotación lenta. Para evitar datos engañosos, también se definen reglas de recepción, ajuste y conteo físico.',
        ],
      },
      {
        heading: 'Sucursales, hardware e integraciones',
        paragraphs: [
          'Una implementación puede contemplar varias sucursales, usuarios, listas de precios y reportes consolidados. Antes de prometer compatibilidad revisamos impresoras, lectores, cajones, terminales y dispositivos disponibles.',
          'El POS puede integrarse con e-commerce, CRM, pagos, contabilidad o facturación mediante APIs. Cada conexión incluye manejo de errores, duplicados y continuidad cuando un proveedor externo no responde.',
        ],
      },
    ],
    benefits: ['Ventas, caja e inventario conectados', 'Permisos y auditoría de movimientos', 'Control por sucursal y bodega', 'Reportes operativos en una sola fuente'],
    useCases: ['Tiendas y comercios minoristas', 'Restaurantes y atención rápida', 'Negocios con varias sucursales', 'Venta física conectada con e-commerce'],
    integrations: ['Lectores e impresoras compatibles', 'Pagos y bancos', 'Inventario y compras', 'E-commerce', 'Facturación y contabilidad'],
    process: [
      ['Diagnóstico operativo', 'Mapeamos venta, caja, productos, turnos, devoluciones y hardware.'],
      ['Prototipo de caja', 'Validamos velocidad, permisos y excepciones con escenarios reales.'],
      ['Implementación', 'Conectamos inventario, reportes e integraciones priorizadas.'],
      ['Piloto y despliegue', 'Probamos en una operación controlada antes de ampliar sucursales.'],
    ],
    faqs: [
      ['¿El POS puede trabajar con varias sucursales?', 'Sí. Se diseñan catálogos, permisos, existencias y reportes para separar y consolidar la operación.'],
      ['¿Funciona sin internet?', 'Algunos flujos pueden diseñarse con operación temporal sin conexión, pero deben definirse sincronización, conflictos y límites.'],
      ['¿Se integra con facturación electrónica?', 'Es posible cuando existe un proveedor y una API autorizada. La viabilidad se confirma durante el diagnóstico.'],
      ['¿Pueden migrar productos y existencias?', 'Sí, después de limpiar códigos, unidades, precios, duplicados y saldos iniciales.'],
    ],
    related: ['/soluciones/software-inventarios-guatemala/', '/servicios/desarrollo-ecommerce-guatemala/', '/recursos/como-elegir-sistema-pos-guatemala/'],
  },
  {
    slug: 'software-inventarios-guatemala',
    section: 'soluciones',
    shortTitle: 'Software de inventarios',
    title: 'Software de inventarios en Guatemala',
    description: 'Centralizamos productos, bodegas, compras, movimientos y existencias para empresas que necesitan información confiable de inventario.',
    keyword: 'software inventarios Guatemala',
    eyebrow: 'Control de inventario y bodegas',
    intro: [
      'Controlar inventario no consiste solamente en conocer una cantidad. La empresa necesita saber dónde está el producto, por qué cambió, quién realizó el movimiento y qué debe comprarse o trasladarse.',
      'Diseñamos sistemas de inventarios para reemplazar hojas aisladas, reducir capturas repetidas y conectar ventas, compras y bodegas. El modelo se adapta a productos, variantes, lotes o series únicamente cuando el negocio realmente los necesita.',
    ],
    sections: [
      {
        heading: 'Existencias por bodega y movimiento',
        paragraphs: [
          'Cada entrada, salida, traslado, devolución o ajuste conserva fecha, responsable, referencia y motivo. Esto permite reconstruir diferencias y evita modificar saldos sin explicación.',
          'Los permisos separan recepción, despacho, ajuste y aprobación. Los reportes muestran existencias actuales, movimientos y productos que requieren revisión.',
        ],
      },
      {
        heading: 'Compras, mínimos y reposición',
        paragraphs: [
          'El sistema puede registrar proveedores, solicitudes, órdenes, recepciones y costos. Los mínimos y máximos funcionan mejor cuando se complementan con rotación, tiempos de entrega y demanda real.',
          'Las alertas no sustituyen la decisión de compra, pero ayudan a priorizar productos críticos y detectar exceso de inventario.',
        ],
      },
      {
        heading: 'Conteos físicos y calidad de datos',
        paragraphs: [
          'Los conteos pueden organizarse por bodega, categoría o ciclo. Las diferencias se revisan antes de ajustar y quedan asociadas al evento que las originó.',
          'La migración comienza limpiando códigos, unidades, descripciones y duplicados. Un sistema nuevo no corrige automáticamente información inconsistente.',
        ],
      },
    ],
    benefits: ['Existencias visibles por bodega', 'Historial completo de movimientos', 'Alertas de mínimos y reposición', 'Compras y ventas conectadas'],
    useCases: ['Distribuidoras', 'Comercios con varias bodegas', 'Inventario para e-commerce', 'Productos con lotes o números de serie'],
    integrations: ['POS y ventas', 'Compras y proveedores', 'E-commerce', 'Código de barras', 'ERP y contabilidad'],
    process: [
      ['Modelo de inventario', 'Definimos productos, unidades, bodegas, costos y movimientos.'],
      ['Limpieza de datos', 'Normalizamos catálogos y preparamos saldos verificables.'],
      ['Construcción', 'Implementamos permisos, transacciones, alertas y reportes.'],
      ['Conteo inicial', 'Validamos existencias y acompañamos la transición operativa.'],
    ],
    faqs: [
      ['¿Puede manejar varias bodegas?', 'Sí. Cada movimiento identifica origen, destino y responsable, con reportes separados o consolidados.'],
      ['¿Maneja lotes y vencimientos?', 'Puede incluirlos si el proceso lo requiere y existen reglas claras de recepción y despacho.'],
      ['¿Se conecta con una tienda en línea?', 'Sí, mediante APIs y reglas para sincronizar catálogo, disponibilidad y pedidos.'],
      ['¿Cómo se corrigen diferencias?', 'Mediante conteos y ajustes autorizados que conservan el motivo y el historial.'],
    ],
    related: ['/soluciones/sistema-pos-guatemala/', '/soluciones/erp-para-pymes-guatemala/', '/recursos/como-controlar-inventario-varias-bodegas/'],
  },
  {
    slug: 'erp-para-pymes-guatemala',
    section: 'soluciones',
    shortTitle: 'ERP para PYMES',
    title: 'ERP para PYMES en Guatemala',
    description: 'Integramos ventas, compras, inventario, operación y reportes en una solución ERP adaptada al crecimiento de la empresa.',
    keyword: 'ERP para PYMES Guatemala',
    eyebrow: 'Gestión empresarial integrada',
    intro: [
      'Un ERP conecta áreas que normalmente trabajan con archivos y sistemas separados. Su valor aparece cuando una venta puede relacionarse con inventario, compra, entrega, cobro y reporte sin volver a capturar la misma información.',
      'WavDev evalúa si conviene implementar una plataforma existente, desarrollar módulos propios o utilizar un enfoque híbrido. No presentamos un ERP como respuesta automática: primero revisamos procesos, licencias, integraciones y capacidad de adopción.',
    ],
    sections: [
      {
        heading: 'Módulos alineados con el proceso',
        paragraphs: [
          'La primera fase puede incluir ventas, compras, inventario, clientes, proveedores y reportes. Contabilidad, producción, recursos humanos u otros módulos se incorporan cuando existe una necesidad y responsables para validarlos.',
          'Cada módulo comparte catálogos y reglas para reducir diferencias. Los permisos y aprobaciones se diseñan según roles, montos y riesgos.',
        ],
      },
      {
        heading: 'ERP comercial, sistema propio o solución híbrida',
        paragraphs: [
          'Un producto comercial ofrece funciones maduras y actualizaciones, pero puede exigir licencias y adaptación. El desarrollo propio ofrece control, aunque requiere inversión y mantenimiento continuo.',
          'La alternativa híbrida conserva herramientas estándar para contabilidad o facturación y construye procesos diferenciadores alrededor de ellas mediante APIs.',
        ],
      },
      {
        heading: 'Implementación y adopción gradual',
        paragraphs: [
          'La migración se realiza por etapas, con datos depurados, escenarios de prueba y responsables de cada área. Un lanzamiento simultáneo de demasiados módulos aumenta riesgo y dificulta identificar problemas.',
          'Después del despliegue medimos uso, pendientes, errores y tiempos. La evolución se prioriza con evidencia operativa.',
        ],
      },
    ],
    benefits: ['Información compartida entre áreas', 'Menos captura y conciliación manual', 'Permisos y aprobaciones', 'Reportes operativos y gerenciales'],
    useCases: ['PYMES en crecimiento', 'Distribución y comercio', 'Servicios con operación compleja', 'Empresas con sistemas desconectados'],
    integrations: ['POS e inventarios', 'CRM y ventas', 'Facturación y contabilidad', 'E-commerce', 'Bancos y pagos'],
    process: [
      ['Diagnóstico', 'Mapeamos módulos, datos, integraciones, responsables y prioridades.'],
      ['Decisión tecnológica', 'Comparamos producto existente, desarrollo propio y enfoque híbrido.'],
      ['Implementación por fases', 'Migramos y validamos un alcance controlado antes de ampliar.'],
      ['Adopción y soporte', 'Capacitamos, medimos y ajustamos según operación real.'],
    ],
    faqs: [
      ['¿WavDev vende un ERP estándar?', 'Diseñamos e integramos soluciones según el caso; podemos recomendar producto, desarrollo o arquitectura híbrida.'],
      ['¿Cuánto tarda una implementación?', 'Depende de módulos, datos, integraciones y disponibilidad de responsables. Se define por fases con criterios de aceptación.'],
      ['¿Se puede conservar el sistema contable?', 'Sí. Una integración puede mantener contabilidad y conectar procesos comerciales u operativos.'],
      ['¿Conviene para una empresa pequeña?', 'Conviene cuando la integración produce más valor que el costo y la complejidad de adopción.'],
    ],
    related: ['/servicios/software-para-pymes/', '/soluciones/software-inventarios-guatemala/', '/recursos/sistema-a-la-medida-vs-erp/'],
  },
  {
    slug: 'crm-ventas-guatemala',
    section: 'soluciones',
    shortTitle: 'CRM de ventas',
    title: 'CRM de ventas en Guatemala',
    description: 'Implementamos CRM para controlar prospectos, cotizaciones, seguimiento, metas y actividad comercial con información accionable.',
    keyword: 'CRM ventas Guatemala',
    eyebrow: 'Pipeline y seguimiento comercial',
    intro: [
      'Un CRM de ventas debe ayudar al equipo a decidir qué oportunidad atender y cuál es el siguiente paso. Si solo almacena contactos o exige demasiada captura, se convierte en una obligación que nadie mantiene.',
      'Configuramos etapas, responsables, tareas, cotizaciones y reportes alrededor del proceso real. La solución puede partir de una plataforma existente o construirse a la medida cuando las reglas e integraciones lo justifican.',
    ],
    sections: [
      {
        heading: 'Pipeline, cotizaciones y actividad',
        paragraphs: [
          'Cada oportunidad conserva origen, valor, etapa, responsable y próxima acción. Las cotizaciones y documentos pueden relacionarse con el historial para evitar búsquedas en correos y carpetas.',
          'Los responsables revisan negocios sin actividad, seguimientos vencidos y razones de pérdida. El objetivo es mejorar consistencia, no vigilar acciones sin contexto.',
        ],
      },
      {
        heading: 'Prospectos desde web y WhatsApp',
        paragraphs: [
          'Los formularios, campañas y conversaciones pueden crear o actualizar contactos y asignarlos según reglas. La integración debe controlar duplicados, consentimiento y transferencia hacia atención humana.',
          'Las automatizaciones generan tareas o recordatorios cuando aportan valor. Evitamos secuencias que saturen al prospecto o dificulten la personalización.',
        ],
      },
      {
        heading: 'Indicadores para dirigir ventas',
        paragraphs: [
          'Los reportes pueden mostrar conversión por etapa y fuente, duración del ciclo, actividad y pronóstico. Cada indicador debe estar ligado a una decisión y utilizar datos suficientemente completos.',
          'La adopción se revisa con oportunidades reales. Los campos y etapas se ajustan cuando producen fricción o información que nadie utiliza.',
        ],
      },
    ],
    benefits: ['Pipeline visible y actualizado', 'Seguimiento y tareas por oportunidad', 'Cotizaciones e historial centralizados', 'Conversión y pronóstico comercial'],
    useCases: ['Ventas B2B', 'Equipos con varios vendedores', 'Seguimiento de cotizaciones', 'Prospectos desde campañas y WhatsApp'],
    integrations: ['WhatsApp Business', 'Correo y calendarios', 'Formularios', 'ERP y facturación', 'Telefonía y documentos'],
    process: [
      ['Proceso comercial', 'Definimos fuentes, etapas, actividades y criterios de avance.'],
      ['Configuración', 'Creamos campos, permisos, pipeline, cotizaciones y reportes.'],
      ['Integraciones', 'Conectamos canales y sistemas con manejo de duplicados.'],
      ['Adopción', 'Capacitamos y mejoramos el CRM con datos de uso.'],
    ],
    faqs: [
      ['¿Es diferente de la página CRM para equipos de ventas?', 'Esta landing prioriza la búsqueda local CRM ventas y amplía cotizaciones, metas e integraciones comerciales.'],
      ['¿Pueden migrar contactos de Excel?', 'Sí, después de normalizar propietarios, teléfonos, correos, estados y duplicados.'],
      ['¿Incluye WhatsApp?', 'Puede incluir una integración oficial según el proveedor y el alcance.'],
      ['¿Se puede conectar con facturación?', 'Sí, si el sistema ofrece APIs o un mecanismo seguro de intercambio.'],
    ],
    related: ['/soluciones/crm-para-equipos-de-ventas/', '/servicios/integracion-whatsapp-crm/', '/recursos/como-elegir-crm-empresa-guatemala/'],
  },
  {
    slug: 'desarrollo-ecommerce-guatemala',
    section: 'servicios',
    shortTitle: 'E-commerce',
    title: 'Desarrollo de e-commerce y tiendas en línea en Guatemala',
    description: 'Creamos tiendas en línea rápidas y conectadas con pagos, inventario, pedidos y seguimiento comercial.',
    keyword: 'desarrollo e-commerce Guatemala',
    eyebrow: 'Comercio electrónico conectado',
    intro: [
      'Una tienda en línea no termina en el catálogo. Debe mantener precios y disponibilidad, recibir pagos, organizar pedidos, informar al cliente y entregar datos útiles al equipo que opera el negocio.',
      'Diseñamos e-commerce para empresas que necesitan una experiencia propia o integraciones que una plantilla básica no resuelve. Cuando una plataforma existente cubre el alcance, también podemos implementarla y conectarla en lugar de reconstruir funciones estándar.',
    ],
    sections: [
      {
        heading: 'Catálogo, búsqueda y conversión móvil',
        paragraphs: [
          'La arquitectura organiza categorías, productos, variantes y contenido para personas y buscadores. Las fichas incluyen información útil, imágenes optimizadas, disponibilidad y llamados a la acción claros.',
          'La experiencia móvil reduce pasos y mantiene controles táctiles cómodos. Medimos vista de producto, carrito, inicio de pago y compra para detectar abandono.',
        ],
      },
      {
        heading: 'Pagos, pedidos y operación',
        paragraphs: [
          'Integramos proveedores de pago disponibles para el negocio después de validar requisitos, comisiones y documentación. El pedido conserva estado, pago, cliente y detalle para facilitar preparación y soporte.',
          'Los correos y notificaciones se diseñan para informar sin exponer datos sensibles. También se contemplan cancelaciones, devoluciones y pagos pendientes.',
        ],
      },
      {
        heading: 'Inventario, ERP y crecimiento orgánico',
        paragraphs: [
          'La tienda puede sincronizar catálogo, existencias y pedidos con inventario o ERP. Definimos qué sistema controla cada dato y cómo se recuperan fallos.',
          'Para SEO se implementan categorías rastreables, canonicales, datos estructurados y manejo de productos agotados. La autoridad se construye con contenido y enlaces, no con miles de páginas duplicadas.',
        ],
      },
    ],
    benefits: ['Catálogo preparado para SEO', 'Pagos y pedidos centralizados', 'Inventario sincronizado', 'Analítica completa del embudo'],
    useCases: ['Tiendas especializadas', 'Catálogos B2B', 'Venta física y digital', 'Negocios con integración de inventario'],
    integrations: ['Pasarelas de pago', 'POS e inventario', 'ERP y facturación', 'CRM y WhatsApp', 'Envíos y notificaciones'],
    process: [
      ['Modelo comercial', 'Definimos catálogo, precios, pagos, entrega y responsables.'],
      ['Arquitectura y diseño', 'Construimos categorías, fichas y recorrido de compra.'],
      ['Integración', 'Conectamos pagos, inventario, pedidos y analítica.'],
      ['Lanzamiento', 'Probamos transacciones, errores, rendimiento y operación.'],
    ],
    faqs: [
      ['¿Utilizan una plataforma o desarrollan desde cero?', 'Comparamos alternativas según catálogo, integraciones, presupuesto y propiedad tecnológica.'],
      ['¿Pueden conectar inventario de tiendas físicas?', 'Sí, cuando existe una fuente confiable y mecanismos de integración.'],
      ['¿Incluye pagos con tarjeta?', 'Podemos integrar proveedores disponibles para el cliente; la aprobación y condiciones dependen del proveedor.'],
      ['¿La tienda estará optimizada para Google?', 'Incluye fundamentos técnicos; posicionar categorías y productos también requiere contenido, demanda y autoridad.'],
    ],
    related: ['/soluciones/sistema-pos-guatemala/', '/soluciones/software-inventarios-guatemala/', '/recursos/como-conectar-tienda-inventario/'],
  },
  {
    slug: 'integracion-fel-guatemala',
    section: 'servicios',
    shortTitle: 'Integración FEL',
    title: 'Integración FEL con sistemas en Guatemala',
    description: 'Evaluamos e implementamos integraciones entre sistemas empresariales y proveedores autorizados de Factura Electrónica en Línea.',
    keyword: 'integración FEL Guatemala',
    eyebrow: 'Facturación electrónica conectada',
    intro: [
      'La integración FEL permite que una venta u operación genere documentos electrónicos sin volver a capturar la información en otra plataforma. El desarrollo debe utilizar un certificador o proveedor autorizado y respetar sus contratos, ambientes y reglas.',
      'WavDev puede evaluar la arquitectura e implementar la conexión técnica cuando el cliente cuenta con proveedor, credenciales y documentación adecuadas. No actuamos como certificador ni garantizamos disponibilidad o aprobación de terceros.',
    ],
    sections: [
      {
        heading: 'Datos fiscales y reglas antes de emitir',
        paragraphs: [
          'El sistema valida emisor, receptor, productos, impuestos, totales y tipo de documento antes de enviar la solicitud. Las reglas deben coincidir con la operación y con la documentación vigente del proveedor.',
          'Los catálogos y formatos se centralizan para evitar diferencias entre ventas, inventario y facturación.',
        ],
      },
      {
        heading: 'Estados, errores y contingencia',
        paragraphs: [
          'Una emisión puede ser aceptada, rechazada o quedar pendiente. La integración registra respuesta, identificadores y mensajes para que el equipo pueda corregir sin duplicar documentos.',
          'También se define qué ocurre durante una interrupción, cómo se reintenta y quién revisa pendientes. Estas reglas se validan con el proveedor y los responsables contables.',
        ],
      },
      {
        heading: 'Conexión con POS, ERP y e-commerce',
        paragraphs: [
          'La facturación puede originarse desde caja, pedidos, cuentas por cobrar o comercio electrónico. Cada canal debe enviar datos consistentes y conservar la relación entre operación y documento.',
          'Los permisos, registros y respaldos ayudan a auditar cambios. La implementación incluye ambientes de prueba antes de utilizar credenciales productivas.',
        ],
      },
    ],
    benefits: ['Menos captura duplicada', 'Documentos relacionados con ventas', 'Errores y pendientes visibles', 'Integración con operación existente'],
    useCases: ['POS y tiendas', 'ERP y cuentas por cobrar', 'E-commerce', 'Servicios y facturación recurrente'],
    integrations: ['Proveedor FEL autorizado', 'POS', 'ERP y contabilidad', 'E-commerce', 'Correo y almacenamiento'],
    process: [
      ['Validación de proveedor', 'Revisamos contrato, API, ambientes, credenciales y responsabilidades.'],
      ['Mapeo fiscal', 'Relacionamos documentos, impuestos, productos, clientes y estados.'],
      ['Integración', 'Implementamos validación, emisión, respuesta y trazabilidad.'],
      ['Pruebas y salida', 'Probamos rechazos, reintentos y conciliación antes de producción.'],
    ],
    faqs: [
      ['¿WavDev es certificador FEL?', 'No. Integramos sistemas con un proveedor autorizado seleccionado y contratado por el cliente.'],
      ['¿Pueden integrar cualquier proveedor?', 'La viabilidad depende de su API, documentación, permisos y condiciones técnicas.'],
      ['¿Qué pasa si el proveedor no responde?', 'Se diseña manejo de pendientes y reintentos según las reglas acordadas y permitidas.'],
      ['¿Incluye asesoría tributaria?', 'No. Las decisiones fiscales deben validarse con el contador y el proveedor correspondiente.'],
    ],
    related: ['/soluciones/sistema-pos-guatemala/', '/soluciones/erp-para-pymes-guatemala/', '/servicios/integraciones-api/'],
  },
] as const

export type GrowthPage = (typeof GROWTH_PAGES)[number]

export const getGrowthPage = (section: GrowthPage['section'], slug: string) =>
  GROWTH_PAGES.find((page) => page.section === section && page.slug === slug)
