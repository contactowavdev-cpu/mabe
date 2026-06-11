export const SITE = {
  name: 'WavDev',
  url: 'https://wavdev.lat',
  email: 'contactowavdev@gmail.com',
  phoneDisplay: '+502 3853 6836',
  phone: '+50238536836',
  whatsapp: 'https://wa.me/50238536836',
  linkedin: 'https://www.linkedin.com/in/hector-wavdev/',
  serviceAreas: ['Ciudad de Guatemala', 'Cobán', 'Jutiapa'],
}

export const SERVICES = [
  {
    slug: 'desarrollo-web-guatemala',
    shortTitle: 'Desarrollo web',
    title: 'Desarrollo web profesional en Guatemala',
    description:
      'Creamos sitios web rápidos, accesibles y preparados para SEO que convierten visitas en oportunidades comerciales para empresas de Guatemala.',
    keyword: 'desarrollo web Guatemala',
    image: '/images/svc-web.webp',
    imageAlt: 'Diseño de una página web corporativa rápida y responsive',
    benefits: [
      'Arquitectura enfocada en conversiones y posicionamiento',
      'Diseño responsive para móviles, tabletas y escritorio',
      'Rendimiento, accesibilidad y Core Web Vitals',
      'Integración con formularios, WhatsApp, CRM y analítica',
    ],
    useCases: [
      'Sitios corporativos y páginas de servicios',
      'Landing pages para campañas comerciales',
      'Catálogos, portales y comercio electrónico',
      'Rediseños de sitios lentos o difíciles de administrar',
    ],
    process: [
      ['Diagnóstico', 'Revisamos objetivos, audiencia, competencia, contenido y oportunidades de búsqueda antes de diseñar.'],
      ['Arquitectura', 'Definimos páginas, navegación, jerarquía de encabezados y recorridos de conversión.'],
      ['Diseño y desarrollo', 'Construimos una interfaz propia, accesible y optimizada para dispositivos reales.'],
      ['Lanzamiento y mejora', 'Validamos SEO, analítica, velocidad y conversiones antes de publicar y medir.'],
    ],
    sections: [
      {
        heading: 'Una página web debe generar negocio, no solo verse bien',
        paragraphs: [
          'Un sitio corporativo es con frecuencia el primer punto de contacto entre una empresa y un cliente potencial. Por eso no trabajamos la página como una pieza decorativa aislada. Organizamos el contenido para explicar con claridad qué ofrece la empresa, a quién ayuda, qué la diferencia y cuál es el siguiente paso para solicitar información o una cotización.',
          'Nuestro servicio de desarrollo web en Guatemala combina estrategia de contenidos, diseño de experiencia, implementación técnica y medición. Esto permite construir páginas que funcionan bien en teléfonos, cargan con rapidez y pueden crecer con nuevos servicios, casos de éxito o artículos sin rehacer todo el proyecto.',
        ],
      },
      {
        heading: 'Desarrollo preparado para buscadores y personas',
        paragraphs: [
          'La optimización comienza en la arquitectura. Cada servicio importante necesita una URL propia, un título claro, contenido original y enlaces internos útiles. También cuidamos canonicales, sitemap, robots, datos estructurados, metadatos sociales y semántica HTML para que Google pueda comprender la página sin depender de efectos visuales o JavaScript innecesario.',
          'Para los visitantes, priorizamos lectura sencilla, contraste, controles táctiles cómodos y llamados a la acción visibles. Una página rápida que no explica la propuesta de valor tampoco convierte; una página bonita que tarda demasiado en cargar pierde usuarios. El trabajo consiste en equilibrar ambos aspectos.',
        ],
      },
      {
        heading: 'Tecnología elegida según el proyecto',
        paragraphs: [
          'Podemos desarrollar sitios con Astro, React, Next.js o tecnologías administrables cuando el equipo del cliente necesita editar contenido. La decisión depende del tipo de negocio, frecuencia de actualización, integraciones, presupuesto y necesidades futuras. No forzamos una herramienta por costumbre.',
          'Las integraciones habituales incluyen Google Analytics, Search Console, formularios seguros, WhatsApp, calendarios, plataformas de correo, CRM, pasarelas de pago y APIs empresariales. Documentamos la solución para que pueda mantenerse y ampliarse.',
        ],
      },
      {
        heading: 'Contenido, medición y mejora después del lanzamiento',
        paragraphs: [
          'El lanzamiento no es el final del trabajo. Dejamos configuradas las señales necesarias para saber qué páginas atraen visitas, qué botones generan contactos y dónde abandonan los usuarios. Con Search Console se pueden identificar consultas reales y oportunidades para mejorar títulos, contenido y enlaces internos sin depender de suposiciones.',
          'También entregamos recomendaciones para mantener información, imágenes y componentes. Cuando la empresa necesita crecimiento orgánico continuo, el siguiente paso es ampliar casos de éxito, responder preguntas frecuentes y publicar recursos basados en experiencia real. Esta combinación de base técnica, contenido útil y seguimiento produce una estrategia más sostenible que perseguir atajos o repetir palabras clave.',
        ],
      },
    ],
    faqs: [
      ['¿Cuánto cuesta una página web profesional en Guatemala?', 'El precio depende de la cantidad de páginas, contenido, diseño, integraciones y funciones. Después de una reunión breve entregamos un alcance y una cotización claros.'],
      ['¿La página quedará optimizada para Google?', 'Sí. Incluimos fundamentos de SEO técnico y on-page. El posicionamiento sostenido también requiere contenido, autoridad y seguimiento posterior al lanzamiento.'],
      ['¿Podré actualizar el contenido?', 'Sí. Podemos integrar un CMS cuando el proyecto lo requiere o entregar un plan de mantenimiento administrado.'],
      ['¿Cuánto tarda el desarrollo?', 'Una web corporativa suele tomar entre cuatro y ocho semanas, dependiendo de la disponibilidad del contenido y las revisiones.'],
    ],
  },
  {
    slug: 'sistemas-a-la-medida',
    shortTitle: 'Sistemas a la medida',
    title: 'Desarrollo de sistemas a la medida en Guatemala',
    description:
      'Diseñamos software empresarial adaptado a tus procesos para centralizar información, reducir tareas manuales y mejorar el control operativo.',
    keyword: 'sistemas a la medida Guatemala',
    image: '/images/svc-sistemas.webp',
    imageAlt: 'Panel de un sistema empresarial desarrollado a la medida',
    benefits: [
      'Flujos alineados con la operación real de la empresa',
      'Roles, permisos, auditoría y seguridad por usuario',
      'Reportes y tableros para tomar mejores decisiones',
      'Integración con sistemas, APIs y fuentes existentes',
    ],
    useCases: [
      'Gestión de inventario, compras y proveedores',
      'Operaciones, órdenes de trabajo y seguimiento',
      'Portales de clientes, distribuidores o colaboradores',
      'Reportes centralizados y control documental',
    ],
    process: [
      ['Descubrimiento', 'Mapeamos procesos actuales, responsables, datos, excepciones y problemas operativos.'],
      ['Diseño funcional', 'Convertimos el proceso en módulos, permisos, estados, reglas e interfaces verificables.'],
      ['Entrega incremental', 'Construimos por etapas para validar el sistema con usuarios reales antes de ampliar.'],
      ['Adopción y soporte', 'Acompañamos pruebas, capacitación, migración de datos y evolución del producto.'],
    ],
    sections: [
      {
        heading: 'Software que se adapta a la empresa',
        paragraphs: [
          'Muchas empresas terminan operando con una combinación de hojas de cálculo, mensajes, correos y sistemas desconectados. Esa fragmentación aumenta los errores, duplica trabajo y dificulta saber qué está ocurriendo. Un sistema a la medida concentra la información y traduce las reglas del negocio en un flujo controlado.',
          'Antes de escribir código analizamos cómo se trabaja hoy, qué información necesita cada persona y dónde se producen retrasos. El objetivo no es digitalizar un proceso deficiente tal como está, sino simplificarlo y construir una herramienta que el equipo pueda adoptar.',
        ],
      },
      {
        heading: 'Control, trazabilidad y crecimiento',
        paragraphs: [
          'El sistema puede registrar quién realizó cada acción, aplicar permisos por rol, generar alertas y mostrar indicadores en tiempo real. Esto reduce la dependencia de una sola persona y facilita auditar operaciones, atender clientes o preparar reportes gerenciales.',
          'Diseñamos una arquitectura modular para incorporar nuevas sedes, usuarios, productos o integraciones. La empresa puede comenzar con el proceso de mayor impacto y ampliar la plataforma a medida que valida resultados, en lugar de asumir el riesgo de un proyecto enorme desde el primer día.',
        ],
      },
      {
        heading: 'Integración con el ecosistema actual',
        paragraphs: [
          'Un sistema empresarial rara vez vive aislado. Podemos conectarlo con facturación, comercio electrónico, CRM, proveedores de correo, WhatsApp, almacenamiento, pasarelas de pago y APIs de terceros. Cuando una plataforma no ofrece API, evaluamos alternativas seguras antes de comprometer el alcance.',
          'También planificamos respaldos, control de acceso, ambientes de prueba, monitoreo y documentación. Estas tareas no son extras decorativos: son necesarias para que el software sea confiable cuando se convierte en parte de la operación diaria.',
        ],
      },
      {
        heading: 'Cómo reducimos el riesgo de un proyecto a la medida',
        paragraphs: [
          'Dividimos el proyecto en entregas pequeñas con criterios de aceptación. Las personas responsables revisan prototipos, datos y flujos antes de que una decisión difícil de cambiar llegue a producción. Así podemos descubrir excepciones, permisos faltantes o pasos innecesarios cuando todavía es económico corregirlos.',
          'El alcance inicial incluye únicamente funciones necesarias para operar y aprender. Las ideas adicionales quedan registradas y se priorizan con evidencia de uso. Este enfoque permite controlar inversión y calendario, facilita la capacitación y evita que el sistema nazca con una complejidad que el equipo todavía no puede aprovechar. La documentación funcional y técnica acompaña cada etapa para reducir dependencia y preparar futuras mejoras.',
        ],
      },
    ],
    faqs: [
      ['¿Cuándo conviene desarrollar un sistema a la medida?', 'Conviene cuando los procesos diferencian a la empresa, las herramientas actuales generan trabajo duplicado o las soluciones comerciales exigen demasiadas adaptaciones.'],
      ['¿Se puede comenzar con un módulo?', 'Sí. Recomendamos iniciar con un alcance de alto impacto y ampliar después de validar el uso y los resultados.'],
      ['¿Pueden migrar información existente?', 'Sí. Analizamos la calidad y formato de los datos para definir limpieza, importación y validación.'],
      ['¿El sistema tendrá soporte?', 'Sí. Definimos soporte, monitoreo, correcciones y evolución según la criticidad de la operación.'],
    ],
  },
  {
    slug: 'crm-para-empresas',
    shortTitle: 'CRM para empresas',
    title: 'CRM para empresas y equipos de ventas en Guatemala',
    description:
      'Implementamos CRM personalizados para ordenar prospectos, automatizar seguimientos y convertir la actividad comercial en información accionable.',
    keyword: 'CRM para empresas Guatemala',
    image: '/images/proj-growsales.webp',
    imageAlt: 'CRM personalizado con pipeline de oportunidades de venta',
    benefits: [
      'Pipeline comercial visible y configurable',
      'Seguimientos, tareas y recordatorios automáticos',
      'Historial centralizado de clientes y oportunidades',
      'Reportes de conversión, actividad y pronóstico',
    ],
    useCases: [
      'Equipos comerciales que trabajan en hojas de cálculo',
      'Seguimiento de cotizaciones y oportunidades',
      'Distribución automática de prospectos',
      'Integración de formularios, correo y WhatsApp',
    ],
    process: [
      ['Proceso comercial', 'Definimos etapas, fuentes, responsables, datos obligatorios y criterios de avance.'],
      ['Configuración', 'Construimos pipeline, perfiles, automatizaciones, tableros y plantillas.'],
      ['Integraciones', 'Conectamos formularios, correo, WhatsApp u otras fuentes aprobadas.'],
      ['Adopción', 'Capacitamos al equipo y ajustamos el CRM usando actividad y resultados reales.'],
    ],
    sections: [
      {
        heading: 'Un CRM debe facilitar la venta',
        paragraphs: [
          'Un CRM no resuelve por sí solo un proceso comercial desordenado. Si exige demasiados campos, no refleja las etapas reales o no ayuda al vendedor a decidir qué hacer después, el equipo deja de usarlo. Por eso comenzamos por comprender cómo llegan los prospectos, cómo se califican y qué acciones aumentan la posibilidad de cerrar.',
          'La implementación puede ser una solución personalizada o una integración con herramientas existentes. Elegimos el enfoque según cantidad de usuarios, complejidad del proceso, presupuesto, necesidad de propiedad de datos e integraciones.',
        ],
      },
      {
        heading: 'Seguimiento consistente sin perder el contexto',
        paragraphs: [
          'Centralizamos conversaciones, notas, tareas, archivos, cotizaciones y próximos pasos. Los responsables pueden ver oportunidades atrasadas, actividades pendientes y negocios sin movimiento. Las automatizaciones ayudan a recordar seguimientos, asignar prospectos y notificar cambios importantes.',
          'Los tableros muestran el volumen por etapa, tasas de conversión, fuentes de prospectos y tiempo promedio de cierre. Estas métricas permiten detectar dónde se estanca el proceso y entrenar al equipo con información concreta.',
        ],
      },
      {
        heading: 'CRM conectado con marketing y atención',
        paragraphs: [
          'Podemos registrar prospectos provenientes del sitio web, campañas, correo y WhatsApp, respetando las políticas de cada plataforma. También es posible enviar datos a herramientas de facturación, servicio al cliente o analítica para evitar capturas duplicadas.',
          'La seguridad se configura con roles y permisos. Cada usuario accede únicamente a la información necesaria, mientras gerencia conserva visibilidad consolidada. Además, definimos respaldos, exportación y reglas de conservación de datos.',
        ],
      },
      {
        heading: 'Implementación orientada a adopción y resultados',
        paragraphs: [
          'Antes del lanzamiento probamos el proceso con un grupo pequeño de usuarios y oportunidades reales. Observamos qué campos generan dudas, qué reportes son útiles y dónde el flujo obliga a realizar pasos innecesarios. Los ajustes tempranos ayudan a que el CRM se convierta en una herramienta cotidiana y no en una obligación administrativa paralela.',
          'Después medimos calidad de datos, seguimientos completados, oportunidades sin actividad, tiempo por etapa y conversión. Estas señales permiten mejorar reglas y capacitación. También definimos responsables para catálogos, permisos y limpieza periódica. Un CRM sostenible necesita gobierno de información además de software; por eso dejamos acuerdos simples para mantener consistencia cuando entran nuevos vendedores, productos o canales.',
        ],
      },
    ],
    faqs: [
      ['¿Es mejor un CRM propio o una plataforma existente?', 'Depende del proceso, presupuesto e integraciones. Primero evaluamos si una plataforma existente puede resolver el problema sin personalizaciones costosas.'],
      ['¿Se puede integrar con WhatsApp?', 'Sí, mediante opciones oficiales y proveedores aprobados. El alcance depende de la cuenta, plantillas y políticas de WhatsApp Business.'],
      ['¿Pueden importar mis clientes actuales?', 'Sí. Limpiamos y mapeamos hojas de cálculo o exportaciones antes de cargarlas en el nuevo CRM.'],
      ['¿Cómo se logra que el equipo use el CRM?', 'Simplificando campos, mostrando beneficios inmediatos, capacitando por rol y ajustando el flujo con retroalimentación real.'],
    ],
  },
  {
    slug: 'automatizacion-de-procesos',
    shortTitle: 'Automatización',
    title: 'Automatización de procesos para empresas en Guatemala',
    description:
      'Automatizamos tareas repetitivas, movimientos de información y notificaciones para reducir errores y liberar tiempo operativo.',
    keyword: 'automatización de procesos Guatemala',
    image: '/images/proj-talento360.webp',
    imageAlt: 'Flujo digital para automatizar procesos empresariales',
    benefits: [
      'Menos captura manual y reprocesos',
      'Alertas y aprobaciones en el momento correcto',
      'Información sincronizada entre herramientas',
      'Procesos medibles, documentados y auditables',
    ],
    useCases: [
      'Asignación y seguimiento de prospectos',
      'Aprobaciones internas y generación de documentos',
      'Notificaciones a clientes y colaboradores',
      'Sincronización entre formularios, CRM y reportes',
    ],
    process: [
      ['Identificación', 'Priorizamos tareas repetitivas por frecuencia, tiempo, riesgo y beneficio esperado.'],
      ['Diseño', 'Definimos disparadores, reglas, excepciones, responsables y evidencia de ejecución.'],
      ['Implementación', 'Conectamos APIs o construimos componentes controlados con registros y alertas.'],
      ['Monitoreo', 'Medimos errores, tiempo ahorrado y cambios necesarios para sostener la automatización.'],
    ],
    sections: [
      {
        heading: 'Automatizar el trabajo repetitivo con criterio',
        paragraphs: [
          'La automatización no consiste en conectar herramientas al azar. Primero identificamos tareas frecuentes, reglas claras y puntos donde el trabajo manual provoca retrasos o errores. Después evaluamos el ahorro potencial, las excepciones y el riesgo para decidir qué proceso conviene intervenir.',
          'Algunos resultados aparecen con automatizaciones pequeñas: crear una oportunidad desde un formulario, asignarla según territorio, avisar a un vendedor y registrar el seguimiento. Otros proyectos requieren integrar sistemas y construir un flujo empresarial completo.',
        ],
      },
      {
        heading: 'Procesos visibles y controlados',
        paragraphs: [
          'Cada automatización debe dejar evidencia. Registramos ejecuciones, errores y estados para que el equipo pueda saber qué ocurrió y actuar cuando una integración falla. También establecemos responsables y rutas alternativas para excepciones que no deben resolverse sin intervención humana.',
          'Esto es especialmente importante en aprobaciones, atención al cliente, documentos y movimientos de datos. Una automatización silenciosa y sin monitoreo puede multiplicar errores más rápido que una tarea manual.',
        ],
      },
      {
        heading: 'Integraciones con herramientas empresariales',
        paragraphs: [
          'Trabajamos con APIs, webhooks, bases de datos y plataformas de automatización cuando son adecuadas. Podemos conectar formularios, CRM, correo, WhatsApp Business, calendarios, almacenamiento, facturación y sistemas internos, siempre dentro de los permisos y políticas disponibles.',
          'Entregamos documentación del flujo, variables de configuración y procedimiento de recuperación. Después del lanzamiento medimos tiempo ahorrado, volumen procesado y errores para comprobar que la automatización produce un beneficio real.',
        ],
      },
      {
        heading: 'Seguridad y mantenimiento de las automatizaciones',
        paragraphs: [
          'Las credenciales se almacenan fuera del código y cada conexión recibe únicamente los permisos necesarios. Cuando una plataforma permite ambientes de prueba, validamos allí antes de trabajar con datos reales. También evitamos incluir información sensible en registros o mensajes que puedan terminar en canales no autorizados.',
          'Los proveedores cambian APIs, límites y políticas, así que una automatización necesita propietario y mantenimiento. Definimos alertas para fallos, reintentos controlados y un procedimiento manual de respaldo. Esta preparación reduce interrupciones y evita que una tarea importante quede detenida sin que nadie lo note. Cuando el volumen crece, revisamos costos, tiempos y arquitectura para decidir si el flujo debe migrar a una solución más robusta.',
          'La entrega incluye una explicación comprensible para las personas responsables de la operación. El equipo debe saber qué inicia el flujo, qué decisiones ejecuta, dónde consultar resultados y cómo actuar ante una excepción. Esta transferencia evita que la automatización se convierta en una caja negra y permite que la empresa mantenga control sobre un proceso importante.',
        ],
      },
    ],
    faqs: [
      ['¿Qué proceso debería automatizar primero?', 'El que combine alta frecuencia, reglas claras, tiempo manual significativo y bajo riesgo de excepciones desconocidas.'],
      ['¿Se puede automatizar WhatsApp?', 'Sí, usando WhatsApp Business Platform y plantillas aprobadas cuando corresponda. No recomendamos automatizaciones que incumplan sus políticas.'],
      ['¿Necesito reemplazar mis sistemas actuales?', 'No necesariamente. Muchas automatizaciones conectan herramientas existentes mediante APIs o webhooks.'],
      ['¿Cómo se mide el retorno?', 'Comparamos tiempo, errores, volumen y tiempos de respuesta antes y después de implementar el flujo.'],
    ],
  },
] as const

export type Service = (typeof SERVICES)[number]

export const PROJECTS = [
  {
    name: 'GrowSales',
    category: 'CRM de ventas',
    description: 'Pipeline comercial, automatización de seguimientos y reportes para equipos de ventas.',
    image: '/images/proj-growsales.webp',
    alt: 'Panel del CRM de ventas GrowSales',
  },
  {
    name: 'Casa Alta',
    category: 'Portal inmobiliario',
    description: 'Experiencia digital para presentar propiedades, captar consultas y organizar inventario.',
    image: '/images/proj-casaalta.webp',
    alt: 'Portal inmobiliario Casa Alta',
  },
  {
    name: 'Talento 360',
    category: 'Plataforma de recursos humanos',
    description: 'Gestión de procesos de talento y seguimiento de información para equipos empresariales.',
    image: '/images/proj-talento360.webp',
    alt: 'Plataforma empresarial Talento 360',
  },
] as const
