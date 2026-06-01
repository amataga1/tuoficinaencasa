#!/usr/bin/env node
/**
 * Standalone article generator — runs in GitHub Actions (no Vercel timeout).
 * Usage: node scripts/generate-article.mjs
 * Env vars required: ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY, AMAZON_TAG (optional)
 */

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import slugify from 'slugify'

const AMAZON_TAG = process.env.AMAZON_TAG || 'setupoficina-21'

// ─── Keyword bank (same list as route.ts) ───────────────────────────────────
const KEYWORD_BANK = [
  ['mejor silla de oficina para teletrabajar todo el día', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['silla ergonómica con reposacabezas para oficina', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['diferencia entre silla ergonómica y silla normal', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['silla de oficina con ruedas para suelo de madera', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['silla de oficina sin reposabrazos pros contras', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['Herman Miller Aeron vale la pena el precio', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['silla de oficina para embarazadas trabajar desde casa', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['silla ergonómica segunda mano vale la pena', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['cuánto tiempo puede durar una silla de oficina', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['silla de oficina para personas con ciática', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['reposabrazos para silla de oficina ergonómico', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['silla de oficina con soporte lumbar ajustable', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['silla de oficina para personas con sobrepeso reforzada', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['Secretlab Titan como silla de oficina diaria', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['silla de pelota para trabajar desde casa beneficios', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['escritorio con almacenamiento integrado home office', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['escritorio de madera maciza para home office', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['IKEA Bekant escritorio elevable opinión 2026', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['escritorio plegable para habitación pequeña', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['altura ideal del escritorio para trabajar sentado', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['escritorio con soporte para monitor integrado', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['montar escritorio gaming en casa para trabajar', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['escritorio blanco minimalista home office ideas', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['escritorio doble para dos personas en casa', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['sujeción de cables bajo escritorio soluciones', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['escritorio de pie beneficios y riesgos reales', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['FlexiSpot E7 escritorio elevable análisis completo', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['escritorio esquinero ikea para oficina en casa', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['tapete protector suelo escritorio cuál elegir', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['escritorio industrial estilo loft home office', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['monitor 1440p vs 4K para trabajar cuál elegir', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['mejor monitor económico para home office menos de 300 euros', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['monitor IPS vs VA para trabajar diferencias', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['monitor sin marco para setup minimalista', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['Dell UltraSharp análisis home office 2026', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['monitor con USB-C para cargar portátil trabajando', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['LG 27UK850 monitor home office análisis', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['soporte de monitor para escritorio elevado', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['calibrar monitor para trabajar con colores correctos', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['monitor para trabajar con Excel y documentos grande', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['frecuencia de actualización monitor para trabajar 60hz suficiente', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['monitor con altavoces integrados para home office', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['brazo articulado monitor escritorio instalar', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['monitor gaming como monitor de trabajo sirve', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['Samsung monitor curvo 34 vs 27 pulgadas flat', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['pantalla azul cómo reducir fatiga visual trabajando', '385453c6-8fe7-40ea-80c9-97d5034a511a', 'Iluminación'],
  ['iluminación indirecta escritorio sin reflejos pantalla', '385453c6-8fe7-40ea-80c9-97d5034a511a', 'Iluminación'],
  ['Elgato Key Light Air análisis home office', '385453c6-8fe7-40ea-80c9-97d5034a511a', 'Iluminación'],
  ['tira LED escritorio detrás monitor bias lighting', '385453c6-8fe7-40ea-80c9-97d5034a511a', 'Iluminación'],
  ['mejor posición de la lámpara para trabajar con ordenador', '385453c6-8fe7-40ea-80c9-97d5034a511a', 'Iluminación'],
  ['lámpara escritorio con clip para portátil', '385453c6-8fe7-40ea-80c9-97d5034a511a', 'Iluminación'],
  ['luz cálida o fría para trabajar cuál es mejor', '385453c6-8fe7-40ea-80c9-97d5034a511a', 'Iluminación'],
  ['iluminación home office con Philips Hue', '385453c6-8fe7-40ea-80c9-97d5034a511a', 'Iluminación'],
  ['cómo iluminar fondo videollamadas profesional sin gastar', '385453c6-8fe7-40ea-80c9-97d5034a511a', 'Iluminación'],
  ['BenQ ScreenBar lámpara monitor análisis', '385453c6-8fe7-40ea-80c9-97d5034a511a', 'Iluminación'],
  ['cómo montar setup trabajo remoto profesional desde cero', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['herramientas esenciales para trabajar desde casa', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['mejores soportes de portátil para escritorio 2026', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['Logitech MX Keys análisis teclado trabajo remoto', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['Logitech MX Master 3 ratón home office análisis', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['Apple Magic Keyboard vs Logitech para Mac trabajo', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['Sony WH-1000XM5 para trabajar desde casa vale la pena', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['Jabra Evolve2 auriculares trabajo análisis', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['Blue Yeti micrófono para reuniones online análisis', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['Logitech C920 webcam trabajo remoto análisis 2026', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['cómo mejorar calidad videollamadas zoom teams', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['escritorio de pie cuántas horas al día es sano', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['método Pomodoro para trabajar desde casa funciona', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['organizar mesa trabajo minimalismo productividad', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['cable management escritorio DIY soluciones baratas', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['mejores extensiones regletas para home office', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['SAI para ordenador de sobremesa home office necesito uno', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['segunda pantalla iPhone iPad como monitor Mac', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['dock CalDigit Thunderbolt análisis para MacBook', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['Anker hub USB-C para home office análisis', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['papel pintado detrás escritorio videollamadas ideas', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['mejorar WiFi en casa para teletrabajar sin cortes', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['powerline adaptador ethernet para home office', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['cómo pedir a la empresa equipamiento para teletrabajo', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['ergonomía postura correcta trabajar ordenador casa', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['síndrome del túnel carpiano prevenir trabajando ordenador', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['ejercicios para hacer en el escritorio sin levantarse', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['home office en el dormitorio cómo separar espacios', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['home office en el salón ideas para esconder el escritorio', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['setup home office completo menos de 300 euros', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['setup home office para programadores desarrolladores', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['setup home office para diseñadores gráficos', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['setup home office para abogados profesionales', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['gadgets home office que merece la pena comprar 2026', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['gadgets home office que NO merece la pena comprar', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['cómo deducir gastos home office como autónomo España', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['regulación teletrabajo España derechos trabajador', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['mejor silla de oficina para adolescentes estudiar', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['silla de oficina tapizada en tela vs cuero cual mejor', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['cómo limpiar y mantener silla de oficina', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['ruedas silla de oficina cuáles cambiar para parquet', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['Markus IKEA silla oficina análisis vale la pena', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['Noblechairs Hero análisis silla oficina', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['monitor ultrawide 49 pulgadas para trabajar vale la pena', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['qué resolución de monitor necesito para home office', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['HDMI vs DisplayPort para conectar monitor diferencias', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['Asus ProArt monitor para diseño y trabajo análisis', '6936d412-dfc4-439a-aead-68390705cbfe', 'Monitores'],
  ['mejor teclado mecánico para programadores 2026', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Periféricos'],
  ['ratón vertical ergonómico análisis vale la pena', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Periféricos'],
  ['Logitech MX Master 3S vs MX Master 3 diferencias', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Periféricos'],
  ['teclado compacto 65% para escritorio pequeño', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Periféricos'],
  ['mejores auriculares inalámbricos para trabajar 2026', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Periféricos'],
  ['Jabra Evolve2 75 análisis auriculares trabajo', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Periféricos'],
  ['Apple AirPods Pro para trabajar desde casa vale la pena', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Periféricos'],
  ['webcam 4K para home office merece la pena', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Periféricos'],
  ['Logitech Brio 500 vs C920 webcam comparativa', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Periféricos'],
  ['micrófono Blue Yeti vs Rode NT-USB para podcast trabajo', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Periféricos'],
  ['pad de carga inalámbrico escritorio home office', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Periféricos'],
  ['reposapies escritorio ergonomía trabajo desde casa', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Periféricos'],
  ['soporte tablet escritorio trabajo para iPad', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Periféricos'],
  ['cámara Sony ZV-E10 como webcam home office', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Periféricos'],
  ['Elgato Wave 3 micrófono análisis home office', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Periféricos'],
  ['postura correcta trabajar ordenador guía completa', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Ergonomía'],
  ['dolor de cuello trabajando ordenador causas soluciones', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Ergonomía'],
  ['altura monitor correcta para evitar cervicales', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Ergonomía'],
  ['síndrome del túnel carpiano prevención teletrabajadores', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Ergonomía'],
  ['cuánto tiempo sentado es sano trabajando', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Ergonomía'],
  ['ejercicios estiramiento obligatorios trabajar ordenador', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Ergonomía'],
  ['distancia correcta monitor ojos trabajando', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Ergonomía'],
  ['regla 20-20-20 fatiga visual pantalla ordenador', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Ergonomía'],
  ['mesa de pie beneficios reales para la salud', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Ergonomía'],
  ['cojín lumbar silla oficina cuál comprar', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Ergonomía'],
  ['reposamuñecas teclado cuándo es necesario', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Ergonomía'],
  ['fatiga visual digital síntomas y soluciones', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Ergonomía'],
  ['gafas con filtro luz azul para trabajar ordenador', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Ergonomía'],
  ['gadgets productividad imprescindibles home office 2026', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Gadgets'],
  ['cargador GaN 100W escritorio análisis', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Gadgets'],
  ['regleta con USB para escritorio cuál elegir', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Gadgets'],
  ['medidor CO2 para home office mejora concentración', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Gadgets'],
  ['termómetro inteligente oficina en casa confort', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Gadgets'],
  ['purificador aire escritorio home office vale la pena', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Gadgets'],
  ['reloj de escritorio con alarma para técnica Pomodoro', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Gadgets'],
  ['altavoz Bluetooth escritorio home office', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Gadgets'],
  ['dispensador cable gestión escritorio soluciones', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Gadgets'],
  ['mini nevera escritorio para home office tiene sentido', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Gadgets'],
  ['cafetera compacta escritorio para teletrabajar', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Gadgets'],
  ['luz nocturna escritorio para trabajar tarde noche', '385453c6-8fe7-40ea-80c9-97d5034a511a', 'Gadgets'],
  ['smartwatch para productividad home office', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Gadgets'],
  ['escritorio con ruedas para mover fácilmente', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['escritorio de cristal home office pros y contras', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['escritorio industrial tubería home office DIY', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['escritorio doble pantalla cómo organizar', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Escritorios'],
  ['silla ergonómica con soporte lumbar dinámico', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['silla de oficina transpirable para verano', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['silla de oficina con reposapiés ajustable', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['Autonomous ErgoChair Pro análisis 2026', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['Haworth Fern silla oficina análisis vale la pena', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['silla ergonómica niños adolescentes estudiar casa', 'b830b59d-98f2-4fe5-a757-6d32442790f7', 'Sillas de Oficina'],
  ['música para concentrarse trabajando desde casa', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['temperatura ideal habitación para trabajar productivo', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['colores pared despacho en casa que aumentan productividad', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['cómo evitar distracciones trabajando desde casa', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['rutina matutina ideal para teletrabajar', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['teletrabajo con niños en casa consejos prácticos', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['ventajas y desventajas del teletrabajo en 2026', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['cómo pedir equipo teletrabajo a tu empresa', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['fondo videollamadas profesional sin gastar dinero', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['fondos virtuales Teams y Zoom cómo configurar', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['cómo mejorar audio reuniones online sin gastar', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['escritorio nórdico minimalista home office decoración', 'b7bc3033-56af-4891-b9ff-7ac276bebf0c', 'Productividad'],
  ['home office pequeño ideas maximizar espacio', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['separar zona trabajo y descanso piso pequeño', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
  ['mejores fondos de pantalla productividad home office', 'e6e57509-16fd-4c8a-93dd-15aec60dd932', 'Productividad'],
]

// ─── Image helpers ───────────────────────────────────────────────────────────
const TOPIC_IMAGES = {
  silla: ['photo-1589884629038-b631346a23c4','photo-1598300042247-d088f8ab3a91','photo-1555041469-a586c61ea9bc','photo-1567538096630-e0c55bd6374c'],
  escritorio: ['photo-1593640408182-31c228b42d1b','photo-1611269154421-4e27233ac5c7','photo-1593642632559-0c6d3fc62b89','photo-1518455027359-f3f8164ba6bd'],
  monitor: ['photo-1527443224154-c4a3942d3acf','photo-1547082299-de196ea013d6','photo-1587202372634-32705e3bf49c','photo-1593642702821-c8da6771f0c6'],
  iluminacion: ['photo-1513506003901-1e6a35fb5977','photo-1507003211169-0a1dd7228f2d','photo-1555680202-c86f0e12f086','photo-1616628188859-7a11abb6fcc9'],
  teclado: ['photo-1587829741301-dc798b83add3','photo-1618384887929-16ec33fab9ef','photo-1541140532154-b024d705b90a','photo-1614680376573-df3480f0c6b8'],
  raton: ['photo-1527864550417-7fd91fc51a46','photo-1613141412572-8b8d1b5e1c53','photo-1587829741301-dc798b83add3','photo-1616400619175-5beda3a17896'],
  auricular: ['photo-1505740420928-5e560c06d30e','photo-1484704849700-f032a568e944','photo-1546435770-a3e426bf472b','photo-1583394838336-acd977736f90'],
  webcam: ['photo-1587825140708-dfaf72ae4b04','photo-1593642632559-0c6d3fc62b89','photo-1611532736597-de2d4265fba3','photo-1516387938699-a927048f1897'],
  microfono: ['photo-1478737270239-2f02b77fc618','photo-1593642632559-0c6d3fc62b89','photo-1598550476439-6847785fcea6','photo-1525201548942-d8732f6617a0'],
  default: ['photo-1497366216548-37526070297c','photo-1497366811353-6870744d04b2','photo-1486312338219-ce68d2c6f44d','photo-1611532736597-de2d4265fba3','photo-1593079831268-3381b0db4a77','photo-1524758631624-e2822e304c36'],
}

const KEYWORD_MAP = {
  silla:'silla',sillas:'silla',lumbar:'silla',ergon:'silla',asiento:'silla',
  escritorio:'escritorio',desk:'escritorio',mesa:'escritorio',elevable:'escritorio',
  monitor:'monitor',pantalla:'monitor',ultrawide:'monitor',curvo:'monitor',
  iluminaci:'iluminacion',luz:'iluminacion',lampara:'iluminacion',led:'iluminacion',
  teclado:'teclado',mec:'teclado',
  rat:'raton',mouse:'raton',
  auricul:'auricular',cascos:'auricular',
  webcam:'webcam',camara:'webcam',
  micro:'microfono',podcast:'microfono',
}

async function getImageForKeyword(keyword) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY
  if (accessKey) {
    try {
      const kwEn = keyword
        .replace(/silla|sillas/gi, 'ergonomic chair')
        .replace(/escritorio/gi, 'desk')
        .replace(/monitor/gi, 'computer monitor')
        .replace(/teclado/gi, 'keyboard')
        .replace(/ratón|raton/gi, 'mouse')
        .replace(/auricular|auriculares/gi, 'headphones')
        .replace(/micrófono|microfono/gi, 'microphone')
        .replace(/webcam|cámara/gi, 'webcam')
        .replace(/iluminación|lampara/gi, 'desk lamp')
        .replace(/home office|oficina en casa/gi, 'home office')
      const q = encodeURIComponent(kwEn.substring(0, 50))
      const res = await fetch(`https://api.unsplash.com/photos/random?query=${q}&orientation=landscape&client_id=${accessKey}`)
      if (res.ok) {
        const data = await res.json()
        if (data.urls?.regular) return data.urls.regular
      }
    } catch {}
  }
  // Fallback to curated pool
  const kw = keyword.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  let topic = 'default'
  for (const [fragment, mapped] of Object.entries(KEYWORD_MAP)) {
    if (kw.includes(fragment)) { topic = mapped; break }
  }
  const pool = TOPIC_IMAGES[topic] ?? TOPIC_IMAGES.default
  const photoId = pool[Math.floor(Math.random() * pool.length)]
  return `https://images.unsplash.com/${photoId}?w=1200&q=80`
}

function buildPrompt(keyword, categoryName, related = []) {
  const amazonBase = `https://www.amazon.es/s?tag=${AMAZON_TAG}&k=`
  return `Eres un experto redactor de contenido especializado en home office y equipamiento para trabajar desde casa en España.

KEYWORD PRINCIPAL: "${keyword}"
CATEGORÍA: ${categoryName}
AMAZON AFFILIATE TAG: ${AMAZON_TAG}

INSTRUCCIONES:
- Artículo completo de 1800-2400 palabras en español
- Tono cercano pero profesional
- Incluye datos reales, consejos prácticos
- NO uses frases genéricas como "en el mundo actual"
- Estructura con H2 y H3 semánticos
- Incluye tabla comparativa si es relevante
- Precios en euros (2026), usa SIEMPRE 2026, nunca 2025
- Entre 4 y 8 links de Amazon integrados naturalmente: <a href="${amazonBase}TÉRMINO" target="_blank" rel="nofollow sponsored" class="amazon-link">texto</a>
- Enlaza naturalmente a 2-3 de estos artículos relacionados del sitio cuando sea relevante (usa el HTML exacto):
${related.length > 0 ? related.join('\n') : '(sin artículos relacionados aún)'}

ESTRUCTURA JSON (devuelve ÚNICAMENTE el JSON):
{
  "title": "Título H1 SEO (50-65 chars)",
  "slug": "slug-kebab-case",
  "excerpt": "Descripción 150-160 chars",
  "meta_title": "Meta title (50-60 chars)",
  "meta_description": "Meta description (145-160 chars)",
  "content": "HTML completo con H2, H3, párrafos, listas, tablas y links Amazon. Sin H1.",
  "faqs": [
    {"question": "Pregunta 1?", "answer": "Respuesta 2-3 frases."},
    {"question": "Pregunta 2?", "answer": "Respuesta."},
    {"question": "Pregunta 3?", "answer": "Respuesta."}
  ]
}`
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const { ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env
  if (!ANTHROPIC_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing env vars: ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY')
    process.exit(1)
  }

  const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY })
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  // SLOT 0 = morning (08:00), SLOT 1 = afternoon (13:00)
  // Each slot works only on its own parity index → no race condition
  const slot = parseInt(process.env.ARTICLE_SLOT ?? '0', 10)
  const slotBank = KEYWORD_BANK.filter((_, i) => i % 2 === slot)

  const { data: existing } = await supabase.from('articles').select('focus_keyword, title, slug')
  const usedKeywords = new Set((existing || []).map(a => a.focus_keyword?.toLowerCase().trim()))

  const next = slotBank.find(([kw]) => !usedKeywords.has(kw.toLowerCase().trim()))
  if (!next) {
    console.log('All keywords used — add more to KEYWORD_BANK')
    process.exit(0)
  }

  const [keyword, categoryId, categoryName] = next
  console.log(`Generating article for: "${keyword}" (${categoryName})`)

  // Pick up to 6 related articles for internal linking
  const siteUrl = process.env.SITE_URL || 'https://setupoficina.es'
  const published = (existing || []).filter(a => a.slug && a.title)
  const related = published
    .sort(() => Math.random() - 0.5)
    .slice(0, 6)
    .map(a => `- <a href="${siteUrl}/articulo/${a.slug}">${a.title}</a>`)

  // Call Anthropic with automatic retry on JSON parse failure
  let parsed
  for (let attempt = 1; attempt <= 3; attempt++) {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      messages: [{ role: 'user', content: buildPrompt(keyword, categoryName, related) }],
    })
    const raw = message.content[0].type === 'text' ? message.content[0].text : ''
    try {
      parsed = JSON.parse(raw)
      break
    } catch {
      const match = raw.match(/\{[\s\S]*\}/)
      if (match) {
        try { parsed = JSON.parse(match[0]); break } catch {}
      }
      if (attempt === 3) { console.error('Could not parse AI response after 3 attempts'); process.exit(1) }
      console.log(`JSON parse failed (attempt ${attempt}), retrying...`)
    }
  }

  const imageUrl = await getImageForKeyword(keyword)
  const wordCount = String(parsed.content).split(/\s+/).filter(Boolean).length
  const baseSlug = slugify(String(parsed.slug || parsed.title), { lower: true, strict: true, locale: 'es' })

  // Unique slug
  let slug = baseSlug
  let attempt = 0
  while (true) {
    const { data } = await supabase.from('articles').select('id').eq('slug', slug).single()
    if (!data) break
    slug = `${baseSlug}-${++attempt}`
  }

  const { data: article, error } = await supabase
    .from('articles')
    .insert({
      title: parsed.title,
      slug,
      excerpt: parsed.excerpt,
      content: parsed.content,
      meta_title: parsed.meta_title,
      meta_description: parsed.meta_description,
      focus_keyword: keyword,
      category_id: categoryId,
      image_url: imageUrl,
      faqs: parsed.faqs,
      word_count: wordCount,
      reading_time: Math.ceil(wordCount / 200),
      status: 'published',
      published_at: new Date().toISOString(),
    })
    .select('id, title, slug')
    .single()

  if (error) { console.error('Supabase error:', error); process.exit(1) }

  console.log(`✓ Published: "${article.title}"`)
  console.log(`  Slug: ${article.slug}`)
  console.log(`  Words: ${wordCount}`)
}

main().catch(err => { console.error(err); process.exit(1) })
