import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Mail, GraduationCap, BookOpen, X, Users, TrendingUp, Award, ChevronRight, User, Hash, Clock, ArrowRight } from 'lucide-react';
// import * as THREE from 'three';

// Función para generar avatar con iniciales
const getAvatarUrl = (nombre) => {
  // Limpiar el nombre y extraer las partes
  const nombreLimpio = nombre.replace(/,\s*/, ' ');
  const partes = nombreLimpio.split(' ').filter(p => p.length > 0);
  
  // Tomar las iniciales (primeras dos letras significativas)
  let iniciales = '';
  if (partes.length >= 2) {
    // Primera letra del primer apellido y primera letra del nombre
    iniciales = partes[0].charAt(0) + partes[partes.length - 1].charAt(0);
  } else if (partes.length === 1) {
    // Si solo hay una parte, tomar las dos primeras letras
    iniciales = partes[0].substring(0, 2);
  }
  
  // Generar un color basado en el nombre para consistencia
  const colors = ['7c3aed', '3b82f6', '10b981', 'f59e0b', 'ef4444', '8b5cf6', '6366f1', '06b6d4', 'ec4899', '14b8a6'];
  let hash = 0;
  for (let i = 0; i < nombre.length; i++) {
    hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % colors.length;
  const bgColor = colors[colorIndex];
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(iniciales)}&background=${bgColor}&color=fff&size=400&bold=true&font-size=0.4&uppercase=true`;
};

// Datos reales de los 71 profesores con fotos de GitHub
const profesoresDataRaw = [
  {
    "id": 1,
    "nombre": "Acosta Ruiz, Vanessa Mirtha",
    "grado_maximo": "Magíster en Marketing Internacional por ESCP-EAP European School of Management (Madrid)",
    "cursos": ["Fundamentos de las Ciencias Empresariales"],
    "correo": "V.Acosta@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/acosta-ruiz-vanessa-mirtha.jpg"
  },
  {
    "id": 2,
    "nombre": "Acuña Sillo, Elba Lourdes",
    "grado_maximo": "Doctoranda en Administración y Dirección de empresas por la Universidad Pablo de Olavide de Sevilla - España",
    "cursos": ["Diseño Organizacional y Estrategia", "Fundamentos de las Ciencias Empresariales", "Estrategia"],
    "correo": "el.acunas@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/acuna-sillo-elba-lourdes.jpg"
  },
  {
    "id": 3,
    "nombre": "Anticona Suárez, Erick Olson",
    "grado_maximo": "Maestría en Supply Chain Management por la Universidad del Pacífico",
    "cursos": ["Gestión de la Cadena de Suministros", "Gestión de Operaciones en las Organizaciones"],
    "correo": "anticona_eo@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/anticona-suarez-erick-olson.jpg"
  },
  {
    "id": 4,
    "nombre": "Aranda Ipince, Duilio Ángel",
    "grado_maximo": "Doctorando en Ingeniería Industrial (UNMSM)",
    "cursos": ["Sistemas de Información y Análisis de Datos"],
    "correo": "da.arandai@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/aranda-ipince-duilio-angel.jpg"
  },
  {
    "id": 5,
    "nombre": "Barrientos Padilla, Alfredo",
    "grado_maximo": "Máster en Dirección y Administración de Proyectos de la Universidad Peruana de Ciencias Aplicadas",
    "cursos": ["Fundamentos de Inteligencia Artificial para los Negocios"],
    "correo": "a.barrientosp@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/barrientos-padilla-alfredo.jpg"
  },
  {
    "id": 6,
    "nombre": "Barrientos Padilla, Óscar",
    "grado_maximo": "Maestría en Educación Superior y Gestión Educativa por la Universidad Tecnológica del Perú",
    "cursos": ["Fundamentos de Inteligencia Artificial para los Negocios"],
    "correo": "oj.barrient_visitaup@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/Barrientos Padilla, Óscar.jpg"
  },
  {
    "id": 7,
    "nombre": "Beltrán Puerta, Jorge",
    "grado_maximo": "Master en Administración Pública (2024) en Prácticas de Desarrollo en School of International and Public Affairs (SIPA), Universidad de Columbia en Nueva York",
    "cursos": ["Emprendimiento e Innovación"],
    "correo": "j.beltranp@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/Beltrán Puerta, Jorge.jpg"
  },
  {
    "id": 8,
    "nombre": "Benites Sánchez, Luis Enrique",
    "grado_maximo": "Doctor en Estadística por la Universidad de São Paulo (USP) en Brasil",
    "cursos": ["Análisis Multivariado para los Negocios", "Analítica de Datos para los Negocios"],
    "correo": "le.benitess@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/Benites Sánchez, Luis Enrique.jpg"
  },
  {
    "id": 9,
    "nombre": "Bravo Monteverde, Guido",
    "grado_maximo": "MBA en Administración por la Universidad del Pacífico y un máster en Coaching, Diagnóstico y Consultoría Empresarial",
    "cursos": ["Gestión del Cambio y Transformación Cultural", "Liderazgo"],
    "correo": "bravo_gh@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/Bravo Monteverde, Guido.jpg"
  },
  {
    "id": 10,
    "nombre": "Bresciani Chávez, Fernando Manuel",
    "grado_maximo": "Magíster en Administración de Negocios por la Universidad Peruana de Ciencias Aplicadas – UPC",
    "cursos": ["Métodos Cuantitativos para la Gestión en las Organizaciones"],
    "correo": "bresciani_fm@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/bresciani-chavez-fernando-manuel.jpg"
  },
  {
    "id": 11,
    "nombre": "Bustamante Bautista, Beatriz Esther",
    "grado_maximo": "Magíster en Docencia para la Educación Superior por la Universidad Andrés Bello, Chile",
    "cursos": ["Analítica de Datos para los Negocios"],
    "correo": "be.bustamanteb@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/bustamante-bautista-beatriz-esther.jpg"
  },
  {
    "id": 12,
    "nombre": "Caro Vargas, Silvana",
    "grado_maximo": "Master en Liderazgo por EADA",
    "cursos": ["Gestión de la Sostenibilidad Social y Ambiental en las Empresas"],
    "correo": "s.carov@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/caro-vargas-silvana.jpg"
  },
  {
    "id": 13,
    "nombre": "Casafranca Rosas, Juan Carlos",
    "grado_maximo": "Magister en Administración por la Universidad del Pacífico",
    "cursos": ["Toma de Decisiones para los Negocios Sostenibles: Simulador The Triple Connection"],
    "correo": "casafranca_jc@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/casafranca-rosas-juan-carlos.jpg"
  },
  {
    "id": 14,
    "nombre": "Castillo Isisola, Frank Josué",
    "grado_maximo": "MBA con mención en Transformación Digital por la Universidad Rey Juan Carlos y Data Scientist certificado por el MIT",
    "cursos": ["Análisis Multivariado para los Negocios"],
    "correo": "fj.castilloi@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/castillo-isisola-frank-josue.jpg"
  },
  {
    "id": 15,
    "nombre": "Castro Segura, Bárbara",
    "grado_maximo": "Maestría en Administración de Negocios (MBA) por INCAE y la Universidad Adolfo Ibañez de Chile (with High Honors)",
    "cursos": ["Liderazgo"],
    "correo": "b.castros@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/castro-segura-barbara.jpg"
  },
  {
    "id": 16,
    "nombre": "Caycho Huamaní, José Alberto",
    "grado_maximo": "MBA en Alta Dirección con la Universidad Rey de Juan Carlos de España con mención en Marketing Digital",
    "cursos": ["Análisis Multivariado para los Negocios"],
    "correo": "J.CaychoHuamani@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/caycho-huamani-jose-alberto.jpg"
  },
  {
    "id": 17,
    "nombre": "Chaves Cuzzi, Daniela",
    "grado_maximo": "Master en Promoción de la Lectura por la Universidad Castilla La Mancha - España",
    "cursos": ["Liderazgo"],
    "correo": "dm.chavesc@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/chaves-cuzzi-daniela.jpg"
  },
  {
    "id": 18,
    "nombre": "Chávez Carruitero, Jimmy Rosendo",
    "grado_maximo": "International MBA por la SDA Bocconi (Milán-Italia)",
    "cursos": ["Sistemas de Información y Análisis de Datos", "Innovación y Negocios Digitales"],
    "correo": "chavez_jr@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/chavez-carruitero-jimmy-rosendo.jpg"
  },
  {
    "id": 19,
    "nombre": "Chichizola Fajardo, Cristina Elizabeth",
    "grado_maximo": "Magíster en Administración de Negocios por la Universidad San Ignacio de Loyola",
    "cursos": ["Gestión de Operaciones en las Organizaciones", "Métodos Cuantitativos para la Gestión en las Organizaciones"],
    "correo": "chichizola_ce@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/chichizola-fajardo-cristina-elizabeth.jpg"
  },
  {
    "id": 20,
    "nombre": "Cornejo Álvarez, Ana Lourdes",
    "grado_maximo": "Egresada del Doctorado de Administración por la Universidad San Ignacio de Loyola",
    "cursos": ["Fundamentos de las Ciencias Empresariales", "Proyecto Empresarial"],
    "correo": "cornejo_al@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/cornejo-alvarez-ana-lourdes.jpg"
  },
  {
    "id": 21,
    "nombre": "Del Castillo Mory, Elsa Catalina",
    "grado_maximo": "Doctora en Ciencias Económicas y Empresariales por la Universidad de Deusto, España",
    "cursos": ["Fundamentos de las Ciencias Empresariales"],
    "correo": "delcastillo_ec@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/del-castillo-mory-elsa-catalina.jpg"
  },
  {
    "id": 22,
    "nombre": "Díaz Rojas, Carlos Andrés",
    "grado_maximo": "Doctor en Gestión Estratégica con mención en Gestión Empresarial y Sostenibilidad por el Consorcio de Universidades (Perú)",
    "cursos": ["Métodos Cuantitativos para la Gestión en las Organizaciones", "Sistemas de Información y Análisis de Datos"],
    "correo": "c.diazrojas@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/diaz-rojas-carlos-andres.jpg"
  },
  {
    "id": 23,
    "nombre": "Dongo Román, Andie Bryan",
    "grado_maximo": "Maestro en Estadística por la PUCP",
    "cursos": ["Análisis Multivariado para los Negocios"],
    "correo": "ab.dongor@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/dongo-roman-andie-bryan.jpg"
  },
  {
    "id": 24,
    "nombre": "Escribens Olaechea, Mario Eduardo",
    "grado_maximo": "Master in Science of Management y Master in Business Administration en la Escuela de Negocios de la Universidad de Maryland, EE.UU",
    "cursos": ["Gestión del Capital Humano"],
    "correo": "escribens_me@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/escribens-olaechea-mario-eduardo.jpg"
  },
  {
    "id": 25,
    "nombre": "Espinel Huertas del Pino, María Pía",
    "grado_maximo": "Máster en prosperidad global por University College London (UCL)",
    "cursos": ["Business Strategy for Digital Transformation"],
    "correo": "P.EspinelHuertas@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/espinel-huertas-del-pino-maria-pia.jpg"
  },
  {
    "id": 26,
    "nombre": "Espinoza Matos, José Francisco",
    "grado_maximo": "MBA, Candidato a Ph.D.",
    "cursos": ["Data Analytics for Business Decision Making"],
    "correo": "jf.espinozam@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/espinoza-matos-jose-francisco.jpg"
  },
  {
    "id": 27,
    "nombre": "Esquives Guerra, Marcial Rubén",
    "grado_maximo": "Magíster en Administración por la Universidad Esan",
    "cursos": ["Gestión del Cambio y Transformación Cultural", "Gestión de Personas", "Liderazgo"],
    "correo": "esquives_mr@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/esquives-guerra-marcial-ruben.jpg"
  },
  {
    "id": 28,
    "nombre": "Flores Castro, Juan Alejandro",
    "grado_maximo": "Doctor en Ciencias Empresariales y Económicas por la Universidad de Deusto - España",
    "cursos": ["Creación de Valor y Toma de Decisiones", "Diseño Organizacional y Estrategia", "Gestión de la Innovación"],
    "correo": "flores_ja@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/flores-castro-juan-alejandro.jpg"
  },
  {
    "id": 29,
    "nombre": "Fuchs Angeles, Rosa María",
    "grado_maximo": "Doctora en Ciencias de la Administración por la Universidad ESAN",
    "cursos": ["Gestión de Personas"],
    "correo": "fuchs_rm@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/fuchs-angeles-rosa-maria.jpg"
  },
  {
    "id": 30,
    "nombre": "Gálvez Paiba, Blanca Eliana",
    "grado_maximo": "Magíster en Administración Estratégica de Empresas por Pontificia Universidad Católica del Perú",
    "cursos": ["Diseño Organizacional y Estrategia", "Emprendimiento e Innovación", "Proyecto Empresarial"],
    "correo": "galvez_be@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/galvez-paiba-blanca-eliana.jpg"
  },
  {
    "id": 31,
    "nombre": "García Céspedes, Carlos Jeffer",
    "grado_maximo": "Magíster en Estadística por la Pontificia Universidad Católica del Perú",
    "cursos": ["Análisis Multivariado para los Negocios"],
    "correo": "cj.garciace@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/garcia-cespedes-carlos-jeffer.jpg"
  },
  {
    "id": 32,
    "nombre": "Gómez Changa, Sarita",
    "grado_maximo": "MBA por CENTRUM de la Pontificia Universidad Católica del Perú",
    "cursos": ["Gestión de Eventos Deportivos", "Liderazgo"],
    "correo": "gomez_sj@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/gomez-changa-sarita.jpg"
  },
  {
    "id": 33,
    "nombre": "Granthon Uriarte, Ronald Jefrie",
    "grado_maximo": "Master en Dirección de Marketing por la Universidad del Pacífico",
    "cursos": ["Fundamentos de las Ciencias Empresariales", "Liderazgo", "Habilidades Directivas"],
    "correo": "granthon_rj@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/granthon-uriarte-ronald-jefrie.jpg"
  },
  {
    "id": 34,
    "nombre": "Heraud Goicochea, Sylvia",
    "grado_maximo": "MBA Internacional en la Universidad Latina de Costa Rica",
    "cursos": ["Liderazgo"],
    "correo": "sc.heraudg@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/heraud-goicochea-sylvia.jpg"
  },
  {
    "id": 35,
    "nombre": "Hurtado Zimmermann, Gustavo Alberto",
    "grado_maximo": "Diploma de Estudios Avanzados (DEA) en Economía y Dirección de Empresas con especialización en Estadística e Investigación Operativa",
    "cursos": ["Métodos Cuantitativos para la Gestión en las Organizaciones"],
    "correo": "hurtado_ga@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/hurtado-zimmermann-gustavo-alberto.jpg"
  },
  {
    "id": 36,
    "nombre": "Infante Chávez, Jorge Ricardo",
    "grado_maximo": "Magíster en Docencia para la Educación Superior por la Universidad Andrés Bello (Chile)",
    "cursos": ["Sistemas de Información y Análisis de Datos"],
    "correo": "infante_jr@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/infante-chavez-jorge-ricardo.jpg"
  },
  {
    "id": 37,
    "nombre": "Jayme Mosquera, Guadalupe Desirée",
    "grado_maximo": "Magíster en Gestión Empresarial por ESAN Graduated School of Business",
    "cursos": ["Fundamentos de las Ciencias Empresariales"],
    "correo": "gd.jaymem@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/jayme-mosquera-guadalupe-desiree.jpg"
  },
  {
    "id": 38,
    "nombre": "Lafosse Quintana, Wilfredo Jesús",
    "grado_maximo": "Ph.D. en Administración de Negocios, Newport International University",
    "cursos": ["Dirección Estratégica", "Creación de Valor y Toma de Decisiones"],
    "correo": "lafosse_wj@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/lafosse-quintana-wilfredo-jesus.jpg"
  },
  {
    "id": 39,
    "nombre": "Larios Francia, Rosa Patricia",
    "grado_maximo": "Doctora en Gestión Estratégica con mención en Gestión Empresarial y Sostenibilidad por el Consorcio de Universidades (Perú)",
    "cursos": ["Gestión de Operaciones en las Organizaciones", "Investigación Aplicada a los Negocios"],
    "correo": "rp.lariosf@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/larios-francia-rosa-patricia.jpg"
  },
  {
    "id": 40,
    "nombre": "Linares Torres, Freddy",
    "grado_maximo": "Magíster en Neuropsicología por la Universidad Peruana Cayetano Heredia, Magíster en Neurociencias por la UNMSM",
    "cursos": ["Innovación y Gestión en Negocios Digitales"],
    "correo": "linares_f@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/linares-torres-freddy.jpg"
  },
  {
    "id": 41,
    "nombre": "Maehara Aliaga, Yoshitomi Eduardo",
    "grado_maximo": "Magíster en Ingeniería Eléctrica con mención en Ingeniería de la Computación en la Facultad de Ingeniería Eléctrica y de la Computación de la Universidad de Estadual de Campinas (FEEC-UNICAMP, Brasil)",
    "cursos": ["Analítica de Datos para los Negocios"],
    "correo": "ye.maeharaa@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/maehara-aliaga-yoshitomi-eduardo.jpg"
  },
  {
    "id": 42,
    "nombre": "Manosalva Mendoza, Maritza Elva Juana",
    "grado_maximo": "Maestría en Gestión de Recursos Humanos y Comportamiento Organizacional de la Universidad Ricardo Palma",
    "cursos": ["Fundamentos de las Ciencias Empresariales", "Gestión del Cambio y Transformación Cultural"],
    "correo": "manosalva_mej@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/manosalva-mendoza-maritza-elva-juana.jpg"
  },
  {
    "id": 43,
    "nombre": "Medina Wong, Gwendolyne",
    "grado_maximo": "MBA EGADE Business School (Tecnológico de Monterrey) con mención en Innovación",
    "cursos": ["Fundamentos de las Ciencias Empresariales"],
    "correo": "g.medinaw@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/medina-wong-gwendolyne.jpg"
  },
  {
    "id": 44,
    "nombre": "Moscoso Zambrano, Renzo Mauricio",
    "grado_maximo": "Master en Dirección de Marketing y Gestión Comercial por la Escuela ESIC Business & School (Barcelona - España)",
    "cursos": ["Gestión Estratégica de Organizaciones Deportivas"],
    "correo": "rm.moscosoz@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/moscoso-zambrano-renzo-mauricio.jpg"
  },
  {
    "id": 45,
    "nombre": "Oliveira Cambiaso, Daniel Alessandro",
    "grado_maximo": "Magíster en Administración por la Universidad del Pacífico",
    "cursos": ["Gestión de la Cadena de Suministros"],
    "correo": "da.oliveirac@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/oliveira-cambiaso-daniel-alessandro.jpg"
  },
  {
    "id": 46,
    "nombre": "Ortigueira Sánchez, Luis Camilo",
    "grado_maximo": "Doctor en Dirección de Empresas y Marketing por la Universidad de Sevilla",
    "cursos": ["Diseño Organizacional y Estrategia"],
    "correo": "lc.ortigueiras@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/ortigueira-sanchez-luis-camilo.jpg"
  },
  {
    "id": 47,
    "nombre": "Otiniano Carbonell, Martín Carlos",
    "grado_maximo": "Magíster en Administración por la Universidad del Pacífico",
    "cursos": ["Gestión del Cambio y Transformación de Cultural", "Gestión de Personas"],
    "correo": "otiniano_mc@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/otiniano-carbonell-martin-carlos.jpg"
  },
  {
    "id": 48,
    "nombre": "Paiva Zarzar, Roberto Alcides",
    "grado_maximo": "Magíster en Administración por la Universidad del Pacífico",
    "cursos": ["Dirección Estratégica"],
    "correo": "paiva_ra@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/paiva-zarzar-roberto-alcides.jpg"
  },
  {
    "id": 49,
    "nombre": "Palacios Matos, María del Pilar Amelia",
    "grado_maximo": "Ph.D. (c) en Strategic Management por el Consorcio de Universidades",
    "cursos": ["Dirección Estratégica", "Gestión del Capital Humano", "Liderazgo"],
    "correo": "palacios_mdp@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/palacios-matos-maria-del-pilar-amelia.jpg"
  },
  {
    "id": 50,
    "nombre": "Peralta Mansilla, Norma Gisela",
    "grado_maximo": "International MBA por el Instituto de Empresa (Madrid-España)",
    "cursos": ["Emprendimiento e Innovación"],
    "correo": "ng.peraltam@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/peralta-mansilla-norma-gisela.jpg"
  },
  {
    "id": 51,
    "nombre": "Pécastaing, Nicolas",
    "grado_maximo": "Doctor en Ciencias Económicas y máster en Economía del Desarrollo, ambos por la Universidad de Bordeaux (Francia)",
    "cursos": ["Gestión de la Sostenibilidad Social y Ambiental en las Empresas"],
    "correo": "n.pecastaing@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/pecastaing-nicolas.jpg"
  },
  {
    "id": 52,
    "nombre": "Porras Cerrón, Jaime Carlos",
    "grado_maximo": "Doctor en Administración por la Universidad Nacional Federico Villareal",
    "cursos": ["Análisis Multivariado para los Negocios"],
    "correo": "jc.porrasc@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/porras-cerron-jaime-carlos.jpg"
  },
  {
    "id": 53,
    "nombre": "Quispe Ayala, Martha Roxana",
    "grado_maximo": "Magíster en Control y Automatización Industrial por la Universidad estatal de Río de Janeiro",
    "cursos": ["Analítica de Datos para los Negocios"],
    "correo": "mr.quispea@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/quispe-ayala-martha-roxana.jpg"
  },
  {
    "id": 54,
    "nombre": "Ramos Peralta, Karim Mabel",
    "grado_maximo": "Maestría y Bachillerato en Ingeniería de Sistemas por la Universidad Privada de Ciencias Aplicadas",
    "cursos": ["Analítica de Datos para los Negocios"],
    "correo": "km.ramosp@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/ramos-peralta-karim-mabel.jpg"
  },
  {
    "id": 55,
    "nombre": "Rebaza Caro, Nancy",
    "grado_maximo": "Maestría en Comportamiento Organizacional y Recursos Humanos por la Universidad Ricardo Palma",
    "cursos": ["Liderazgo", "Diseño Organizacional y Estrategia", "Fundamentos de las Ciencias Empresariales", "Gestión del Cambio y Transformación Cultural"],
    "correo": "n.rebazac@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/rebaza-caro-nancy.jpg"
  },
  {
    "id": 56,
    "nombre": "Rivas Velarde, Andrea Carolina",
    "grado_maximo": "Magíster en Marketing y Gestión comercial y Licenciada en Administración por la Universidad del Pacífico",
    "cursos": ["Emprendimiento e Innovación"],
    "correo": "ac.rivasv@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/rivas-velarde-andrea-carolina.jpg"
  },
  {
    "id": 57,
    "nombre": "Rodríguez Cornejo, Juan Carlos",
    "grado_maximo": "Maestría en RRHH y Comportamiento Organizacional por la Universidad Ricardo Palma y un Talent MBA por IE Business School",
    "cursos": ["Formación y Desarrollo del Talento"],
    "correo": "rodriguez_jc@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/rodriguez-cornejo-juan-carlos.jpg"
  },
  {
    "id": 58,
    "nombre": "Ruíz Palomino, César",
    "grado_maximo": "Magíster en Finanzas por la Universidad del Pacífico",
    "cursos": ["Proyecto Empresarial"],
    "correo": "ruiz_c@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/ruiz-palomino-cesar.jpg"
  },
  {
    "id": 59,
    "nombre": "San Martín Piaggio, Alfredo",
    "grado_maximo": "MBA por la Universidad de Texas en Austin (UT) con especialidad en Tecnologías de Información",
    "cursos": ["IA Generativa y & Prompt Engineering para los Negocios"],
    "correo": "a.sanmartin_visitaup@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/san-martin-piaggio-alfredo.jpg"
  },
  {
    "id": 60,
    "nombre": "Saravia Vergara, Enrique Andrés",
    "grado_maximo": "Doctor y máster en Sociedad de la Información y del Conocimiento por la Universidad Oberta de Cataluña (España)",
    "cursos": ["Gestión de Operaciones en las Organizaciones", "Métodos Cuantitativos para la Gestión en las Organizaciones"],
    "correo": "saravia_ea@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/saravia-vergara-enrique-andres.jpg"
  },
  {
    "id": 61,
    "nombre": "Tejada Matos, Susana Rocío",
    "grado_maximo": "Candidata a Doctora (Ph.D.) en Gestión Estratégica (Centrum/U. Maastricht-Holanda)",
    "cursos": ["Gestión de la Sostenibilidad Social y Ambiental en las Empresas"],
    "correo": "sr.tejadam@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/tejada-matos-susana-rocio.jpg"
  },
  {
    "id": 62,
    "nombre": "Trujillo Sosa, Jorge Enrique",
    "grado_maximo": "Magíster en Desarrollo Organizacional y Dirección de Personas por la Universidad del Pacífico y la Universidad del Desarrollo (Chile)",
    "cursos": ["Fundamentos de las Ciencias Empresariales", "Proyecto Empresarial", "Emprendimiento e Innovación"],
    "correo": "trujillo_je@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/trujillo-sosa-jorge-enrique.jpg"
  },
  {
    "id": 63,
    "nombre": "Ueyonahara Matzumoto, Jorge Antonio",
    "grado_maximo": "Magíster en Desarrollo Sostenible por la Uppsala University (Suecia)",
    "cursos": ["Gestión de la Sostenibilidad Social y Ambiental en las Empresas", "Diseño de Negocios Circulares y Desafío Climático", "Liderazgo"],
    "correo": "ja.ueyonaharam@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/ueyonahara-matzumoto-jorge-antonio.jpg"
  },
  {
    "id": 64,
    "nombre": "Vásquez Oré, Marco Antonio",
    "grado_maximo": "Master en Innovación Pedagógica y Gestión de Centros Educativos por EUCIM Business School, España",
    "cursos": ["Analítica de Datos para los Negocios", "Macros en Excel para No Programadores"],
    "correo": "vasquez_ma@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/vasquez-ore-marco-antonio.jpg"
  },
  {
    "id": 65,
    "nombre": "Vargas Soto, Verónica",
    "grado_maximo": "Master en población y desarrollo por London School of Economics and Political Science",
    "cursos": ["Liderazgo"],
    "correo": "vargas_v@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/vargas-soto-veronica.jpg"
  },
  {
    "id": 66,
    "nombre": "Villacorta Holguín, Katherine Lilia",
    "grado_maximo": "Master en Customer Experience and Innovation por IE University, España",
    "cursos": ["Innovación y Gestión en Negocios Digitales", "Business Agility"],
    "correo": "kl.villacortah@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/villacorta-holguin-katherine-lilia.jpg"
  },
  {
    "id": 67,
    "nombre": "Villanueva Pérez, Humberto Jesús",
    "grado_maximo": "Magíster en Emprendimiento y Nuevos Negocios por la Pontificia Universidad Católica del Perú (PUCP)",
    "cursos": ["Emprendimiento e Innovación"],
    "correo": "hj.villanuevap@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/villanueva-perez-humberto-jesus.jpg"
  },
  {
    "id": 68,
    "nombre": "Villegas Valladares, Shirley Rubí",
    "grado_maximo": "MBA Internacional por la Universidad de Pekín",
    "cursos": ["Emprendimiento e Innovación", "Proyecto Empresarial"],
    "correo": "villegas_sr@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/villegas-valladares-shirley-rubi.jpg"
  },
  {
    "id": 69,
    "nombre": "Weinberger Villarán, Karen Edith",
    "grado_maximo": "Doctora en Gestión Estratégica, con mención en Estrategia y Sostenibilidad, por el Consorcio de Universidades del Perú",
    "cursos": ["Fundamentos de las Ciencias Empresariales"],
    "correo": "weinberger_ke@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/weinberger-villaran-karen-edith.jpg"
  },
  {
    "id": 70,
    "nombre": "Zapata Huamaní, Guillermo Andrés",
    "grado_maximo": "Doctor en Economía y Empresa por la Universidad de Santiago de Compostela (España)",
    "cursos": ["Investigación Aplicada a los Negocios"],
    "correo": "ga.zapatah@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/zapata-huamani-guillermo-andres.jpg"
  },
  {
    "id": 71,
    "nombre": "Zúñiga Bravo, Martha Eliana",
    "grado_maximo": "Maestría en Administración de Empresas - Global MBA, Escuela Europea de Estudios Universitarios y Empresariales, España",
    "cursos": ["Emprendimiento e Innovación"],
    "correo": "M.ZunigaBravo@up.edu.pe",
    "foto": "https://raw.githubusercontent.com/lbenitesanchez/directorio/main/assets/zuniga-bravo-martha-eliana.jpg"
  }
];

// Procesar las URLs con avatares generados
// Usar directamente las URLs de GitHub sin modificar
const profesoresData = profesoresDataRaw;

// Componente de fondo 3D
// Componente de fondo 3D
const ThreeBackground = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Verificar que Three.js esté disponible globalmente
    if (!window.THREE) {
      console.error('Three.js no está cargado');
      return;
    }

    if (!mountRef.current) return;

    const THREE = window.THREE; // Usar THREE del window

    // Configurar escena
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Configurar cámara
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    // Configurar renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Crear partículas flotantes
    const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.6
    });

    const particles = [];
    for (let i = 0; i < 50; i++) {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
      particle.position.x = (Math.random() - 0.5) * 50;
      particle.position.y = (Math.random() - 0.5) * 50;
      particle.position.z = (Math.random() - 0.5) * 50;
      particle.userData = {
        velocity: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02
        },
        originalPosition: particle.position.clone()
      };
      particles.push(particle);
      scene.add(particle);
    }
    particlesRef.current = particles;

    // Luz ambiental
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Manejo del mouse
    const handleMouseMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animación
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      // Animar partículas
      particles.forEach((particle, index) => {
        particle.position.x += particle.userData.velocity.x;
        particle.position.y += particle.userData.velocity.y;
        particle.position.z += particle.userData.velocity.z;

        // Efecto de atracción del mouse
        const mouseForce = 0.1;
        particle.position.x += mouseRef.current.x * mouseForce * 0.1;
        particle.position.y += mouseRef.current.y * mouseForce * 0.1;

        // Rebote en los límites
        if (Math.abs(particle.position.x) > 25) particle.userData.velocity.x *= -1;
        if (Math.abs(particle.position.y) > 25) particle.userData.velocity.y *= -1;
        if (Math.abs(particle.position.z) > 25) particle.userData.velocity.z *= -1;

        // Pulso de opacidad
        particle.material.opacity = 0.3 + Math.sin(Date.now() * 0.001 + index) * 0.3;
      });

      // Rotar la cámara suavemente
      camera.position.x = Math.sin(Date.now() * 0.0001) * 5;
      camera.position.y = Math.cos(Date.now() * 0.0001) * 5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Manejo de redimensionamiento
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      const currentMount = mountRef.current;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 -z-10" />;
};

export default function DashboardProfesores() {
  const [busqueda, setBusqueda] = useState('');
  const [profesorSeleccionado, setProfesorSeleccionado] = useState(null);
  const [vistaActual, setVistaActual] = useState('inicio');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [letraSeleccionada, setLetraSeleccionada] = useState(null);
  const [profesoresRecientes, setProfesoresRecientes] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const profesoresPorPagina = 12;

  // Cargar profesores visitados recientemente
  useEffect(() => {
    const recientes = profesoresData.slice(0, 4);
    setProfesoresRecientes(recientes);
  }, []);

  // Estadísticas con datos reales
  const estadisticas = useMemo(() => {
    const totalProfesores = profesoresData.length;
    const doctores = profesoresData.filter(p => 
      p.grado_maximo.toLowerCase().includes('doctor') || 
      p.grado_maximo.toLowerCase().includes('ph.d.')
    ).length;
    const magisters = profesoresData.filter(p => 
      p.grado_maximo.toLowerCase().includes('magíster') || 
      p.grado_maximo.toLowerCase().includes('maestría') || 
      p.grado_maximo.toLowerCase().includes('master')
    ).length;
    const mbas = profesoresData.filter(p => 
      p.grado_maximo.toLowerCase().includes('mba')
    ).length;
    const totalCursos = [...new Set(profesoresData.flatMap(p => p.cursos))].length;
    
    return { totalProfesores, doctores, magisters, mbas, totalCursos };
  }, []);

  // Categorías de cursos basadas en los datos reales
  const categoriasCursos = useMemo(() => {
    const categorias = {
      'Estrategia y Dirección': ['Diseño Organizacional y Estrategia', 'Dirección Estratégica', 'Gestión Estratégica de Organizaciones Deportivas', 'Creación de Valor y Toma de Decisiones', 'Business Strategy for Digital Transformation', 'Estrategia'],
      'Liderazgo y Gestión de Personas': ['Liderazgo', 'Gestión del Cambio y Transformación Cultural', 'Gestión de Personas', 'Gestión del Capital Humano', 'Formación y Desarrollo del Talento', 'Habilidades Directivas'],
      'Innovación y Emprendimiento': ['Emprendimiento e Innovación', 'Gestión de la Innovación', 'Innovación y Gestión en Negocios Digitales', 'Proyecto Empresarial', 'Business Agility'],
      'Analítica de Datos e IA': ['Analítica de Datos para los Negocios', 'Análisis Multivariado para los Negocios', 'Fundamentos de Inteligencia Artificial para los Negocios', 'IA Generativa y & Prompt Engineering para los Negocios', 'Data Analytics for Business Decision Making', 'Macros en Excel para No Programadores'],
      'Operaciones y Supply Chain': ['Gestión de Operaciones en las Organizaciones', 'Gestión de la Cadena de Suministros', 'Métodos Cuantitativos para la Gestión en las Organizaciones', 'Sistemas de Información y Análisis de Datos'],
      'Sostenibilidad': ['Gestión de la Sostenibilidad Social y Ambiental en las Empresas', 'Diseño de Negocios Circulares y Desafío Climático', 'Toma de Decisiones para los Negocios Sostenibles: Simulador The Triple Connection'],
      'Fundamentos y Metodología': ['Fundamentos de las Ciencias Empresariales', 'Investigación Aplicada a los Negocios', 'Gestión de Eventos Deportivos']
    };
    return categorias;
  }, []);

  // Índice alfabético
  const indiceAlfabetico = useMemo(() => {
    const indice = {};
    profesoresData.forEach(profesor => {
      const primeraLetra = profesor.nombre[0].toUpperCase();
      if (!indice[primeraLetra]) {
        indice[primeraLetra] = [];
      }
      indice[primeraLetra].push(profesor);
    });
    return indice;
  }, []);

  // Resultados de búsqueda con paginación
  const resultadosBusqueda = useMemo(() => {
    if (!busqueda) return [];
    
    const filtrados = profesoresData.filter(profesor => 
      profesor.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      profesor.cursos.some(curso => curso.toLowerCase().includes(busqueda.toLowerCase())) ||
      profesor.grado_maximo.toLowerCase().includes(busqueda.toLowerCase())
    );

    const inicio = (paginaActual - 1) * profesoresPorPagina;
    const fin = inicio + profesoresPorPagina;
    
    return {
      profesores: filtrados.slice(inicio, fin),
      total: filtrados.length,
      totalPaginas: Math.ceil(filtrados.length / profesoresPorPagina)
    };
  }, [busqueda, paginaActual]);

  // Profesores por categoría
  const profesoresPorCategoria = useMemo(() => {
    if (!categoriaSeleccionada) return [];
    
    const cursosCategoria = categoriasCursos[categoriaSeleccionada] || [];
    const filtrados = profesoresData.filter(profesor =>
      profesor.cursos.some(curso => cursosCategoria.includes(curso))
    );
    
    const inicio = (paginaActual - 1) * profesoresPorPagina;
    const fin = inicio + profesoresPorPagina;
    
    return {
      profesores: filtrados.slice(inicio, fin),
      total: filtrados.length,
      totalPaginas: Math.ceil(filtrados.length / profesoresPorPagina)
    };
  }, [categoriaSeleccionada, categoriasCursos, paginaActual]);

  const handleBusqueda = (valor) => {
    setBusqueda(valor);
    setPaginaActual(1);
    if (valor) {
      setVistaActual('busqueda');
    }
  };

  const ProfesorCard = ({ profesor, size = 'normal' }) => {
    // Determinar el badge del grado
    const getBadge = (grado) => {
      if (grado.toLowerCase().includes('doctor') || grado.toLowerCase().includes('ph.d.')) {
        return { text: 'Dr.', color: 'bg-purple-600' };
      } else if (grado.toLowerCase().includes('mba')) {
        return { text: 'MBA', color: 'bg-blue-600' };
      } else if (grado.toLowerCase().includes('magíster') || grado.toLowerCase().includes('maestría') || grado.toLowerCase().includes('master')) {
        return { text: 'Mg.', color: 'bg-green-600' };
      }
      return null;
    };

    const badge = getBadge(profesor.grado_maximo);

    return (
      <div
        className={`profesor-card bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group ${
          size === 'small' ? 'scale-90' : ''
        }`}
        onClick={() => setProfesorSeleccionado(profesor)}
      >
        <div className={`relative ${size === 'small' ? 'h-60' : 'h-80'} overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100`}>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-400/20"></div>
          <img
            src={profesor.foto}
            alt={profesor.nombre}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {badge && (
            <div className={`absolute top-3 right-3 ${badge.color} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm`}>
              {badge.text}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className={`${size === 'small' ? 'p-4' : 'p-6'}`}>
          <h3 className={`font-bold ${size === 'small' ? 'text-base' : 'text-lg'} text-gray-800 mb-2 line-clamp-1`}>
            {profesor.nombre}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{profesor.grado_maximo}</p>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <BookOpen className="w-4 h-4 mr-2 text-purple-600" />
              <span className="line-clamp-1">{profesor.cursos[0]}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Paginacion = ({ totalPaginas, paginaActual, onChange }) => (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => onChange(Math.max(1, paginaActual - 1))}
        disabled={paginaActual === 1}
        className="px-4 py-2 rounded-lg bg-white/80 backdrop-blur-sm shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        Anterior
      </button>
      <span className="px-4 py-2 text-gray-700 bg-white/60 backdrop-blur-sm rounded-lg">
        Página {paginaActual} de {totalPaginas}
      </span>
      <button
        onClick={() => onChange(Math.min(totalPaginas, paginaActual + 1))}
        disabled={paginaActual === totalPaginas}
        className="px-4 py-2 rounded-lg bg-white/80 backdrop-blur-sm shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        Siguiente
      </button>
    </div>
  );

  const VistaInicio = () => (
    <div className="space-y-8">
      {/* Barra de búsqueda principal */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center border border-white/20">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Encuentra a tu profesor
        </h2>
        <p className="text-gray-600 mb-6">
          Busca por nombre, curso o grado académico
        </p>
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
          <input
            type="text"
            placeholder="Ej: Marketing Digital, Dr. García, MBA..."
            className="w-full pl-12 pr-4 py-4 text-lg border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm"
            value={busqueda}
            onChange={(e) => handleBusqueda(e.target.value)}
            onFocus={() => setVistaActual('busqueda')}
          />
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform duration-300">
          <Users className="w-10 h-10 mb-3 opacity-80" />
          <div className="text-3xl font-bold mb-1">{estadisticas.totalProfesores}</div>
          <div className="text-purple-100">Profesores</div>
        </div>
        <div className="stat-card bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform duration-300">
          <GraduationCap className="w-10 h-10 mb-3 opacity-80" />
          <div className="text-3xl font-bold mb-1">{estadisticas.doctores}</div>
          <div className="text-blue-100">Doctores</div>
        </div>
        <div className="stat-card bg-gradient-to-br from-green-500 to-green-700 rounded-xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform duration-300">
          <Award className="w-10 h-10 mb-3 opacity-80" />
          <div className="text-3xl font-bold mb-1">{estadisticas.magisters + estadisticas.mbas}</div>
          <div className="text-green-100">Magíster/MBA</div>
        </div>
        <div className="stat-card bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform duration-300">
          <BookOpen className="w-10 h-10 mb-3 opacity-80" />
          <div className="text-3xl font-bold mb-1">{estadisticas.totalCursos}</div>
          <div className="text-orange-100">Cursos únicos</div>
        </div>
      </div>

      {/* Opciones de navegación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Por categoría */}
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/20">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-purple-600" />
            Explorar por Área
          </h3>
          <div className="space-y-3">
            {Object.keys(categoriasCursos).map((categoria, index) => (
              <button
                key={categoria}
                onClick={() => {
                  setCategoriaSeleccionada(categoria);
                  setVistaActual('categoria');
                  setPaginaActual(1);
                }}
                className="nav-button w-full text-left px-4 py-3 rounded-lg bg-gradient-to-r from-purple-50 to-transparent hover:from-purple-100 hover:to-purple-50 hover:text-purple-700 transition-all flex items-center justify-between group border border-purple-100"
              >
                <span>{categoria}</span>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors transform group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        </div>

        {/* Índice alfabético */}
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/20">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Hash className="w-6 h-6 mr-2 text-purple-600" />
            Índice Alfabético
          </h3>
          <div className="grid grid-cols-6 gap-2">
            {Object.keys(indiceAlfabetico).sort().map(letra => (
              <button
                key={letra}
                onClick={() => {
                  setLetraSeleccionada(letra);
                  setVistaActual('alfabetico');
                }}
                className="px-3 py-2 rounded-lg bg-gradient-to-br from-purple-100 to-purple-50 hover:from-purple-500 hover:to-purple-600 hover:text-white transition-all font-semibold transform hover:scale-110"
              >
                {letra}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Profesores recientes */}
      {profesoresRecientes.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Clock className="w-6 h-6 mr-2 text-purple-600" />
            Visitados recientemente
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {profesoresRecientes.map(profesor => (
              <ProfesorCard key={profesor.id} profesor={profesor} size="small" />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const VistaBusqueda = () => (
    <div>
      <button
        onClick={() => {
          setVistaActual('inicio');
          setBusqueda('');
          setPaginaActual(1);
        }}
        className="mb-6 text-purple-600 hover:text-purple-700 flex items-center transition-colors bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg"
      >
        ← Volver al inicio
      </button>
      
      {busqueda && resultadosBusqueda.total > 0 ? (
        <>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Resultados de búsqueda
          </h2>
          <p className="text-gray-600 mb-6">
            Se encontraron {resultadosBusqueda.total} profesores para "{busqueda}"
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resultadosBusqueda.profesores.map(profesor => (
              <ProfesorCard key={profesor.id} profesor={profesor} />
            ))}
          </div>
          {resultadosBusqueda.totalPaginas > 1 && (
            <Paginacion
              totalPaginas={resultadosBusqueda.totalPaginas}
              paginaActual={paginaActual}
              onChange={setPaginaActual}
            />
          )}
        </>
      ) : busqueda ? (
        <div className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-xl">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            No se encontraron profesores para "{busqueda}"
          </p>
          <p className="text-gray-400 mt-2">
            Intenta con otros términos de búsqueda
          </p>
        </div>
      ) : (
        <div className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-xl">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            Ingresa un término de búsqueda
          </p>
        </div>
      )}
    </div>
  );

  const VistaCategoria = () => (
    <div>
      <button
        onClick={() => {
          setVistaActual('inicio');
          setCategoriaSeleccionada(null);
          setPaginaActual(1);
        }}
        className="mb-6 text-purple-600 hover:text-purple-700 flex items-center transition-colors bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg"
      >
        ← Volver al inicio
      </button>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        {categoriaSeleccionada}
      </h2>
      <p className="text-gray-600 mb-6">
        {profesoresPorCategoria.total} profesores en esta área
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {profesoresPorCategoria.profesores.map(profesor => (
          <ProfesorCard key={profesor.id} profesor={profesor} />
        ))}
      </div>
      
      {profesoresPorCategoria.totalPaginas > 1 && (
        <Paginacion
          totalPaginas={profesoresPorCategoria.totalPaginas}
          paginaActual={paginaActual}
          onChange={setPaginaActual}
        />
      )}
    </div>
  );

  const VistaAlfabetica = () => (
    <div>
      <button
        onClick={() => {
          setVistaActual('inicio');
          setLetraSeleccionada(null);
        }}
        className="mb-6 text-purple-600 hover:text-purple-700 flex items-center transition-colors bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg"
      >
        ← Volver al inicio
      </button>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Profesores - Letra {letraSeleccionada}
      </h2>
      
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/20">
        <div className="space-y-4">
          {indiceAlfabetico[letraSeleccionada]?.map(profesor => (
            <div
              key={profesor.id}
              onClick={() => setProfesorSeleccionado(profesor)}
              className="flex items-center p-4 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors group"
            >
              <img
                src={profesor.foto}
                alt={profesor.nombre}
                className="w-12 h-12 rounded-full object-cover mr-4 ring-2 ring-purple-200 group-hover:ring-purple-400 transition-all"
                loading="lazy"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{profesor.nombre}</h4>
                <p className="text-sm text-gray-600">{profesor.cursos.join(', ')}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transform group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative">
      <ThreeBackground />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-40 border-b border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 
              onClick={() => {
                setVistaActual('inicio');
                setBusqueda('');
                setPaginaActual(1);
              }}
              className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform"
            >
              Directorio de Profesores
            </h1>
            {vistaActual !== 'inicio' && (
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar profesor..."
                  className="w-full pl-10 pr-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm"
                  value={busqueda}
                  onChange={(e) => handleBusqueda(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {vistaActual === 'inicio' && <VistaInicio />}
        {vistaActual === 'busqueda' && <VistaBusqueda />}
        {vistaActual === 'categoria' && <VistaCategoria />}
        {vistaActual === 'alfabetico' && <VistaAlfabetica />}
      </main>

      {/* Modal de detalles */}
      {profesorSeleccionado && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setProfesorSeleccionado(null)}
        >
          <div 
            className="bg-white/95 backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button
                onClick={() => setProfesorSeleccionado(null)}
                className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="h-64 bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-300/20 rounded-full blur-3xl"></div>
                <img
                  src={profesorSeleccionado.foto}
                  alt={profesorSeleccionado.nombre}
                  className="w-40 h-40 rounded-full border-4 border-white shadow-xl absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 object-cover"
                />
              </div>
              <div className="pt-24 px-8 pb-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                  {profesorSeleccionado.nombre}
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-50 to-transparent rounded-lg p-4 border border-purple-100">
                    <div className="flex items-start space-x-3">
                      <GraduationCap className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-1">Grado Académico</h3>
                        <p className="text-gray-600">{profesorSeleccionado.grado_maximo}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-transparent rounded-lg p-4 border border-blue-100">
                    <div className="flex items-start space-x-3">
                      <BookOpen className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">Cursos que imparte</h3>
                        <div className="flex flex-wrap gap-2">
                          {profesorSeleccionado.cursos.map((curso, idx) => (
                            <span
                              key={idx}
                              className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {curso}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-transparent rounded-lg p-4 border border-green-100">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-1">Correo electrónico</h3>
                        <a
                          href={`mailto:${profesorSeleccionado.correo}`}
                          className="text-purple-600 hover:text-purple-700 transition-colors"
                        >
                          {profesorSeleccionado.correo}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <a
                    href={`mailto:${profesorSeleccionado.correo}`}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center space-x-2 shadow-lg transform hover:scale-105"
                  >
                    <Mail className="w-5 h-5" />
                    <span>Contactar Profesor</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}