/**
 * SCRIPT DE SEED - GENERADOR DE DATOS FAKE
 *
 * Genera datos realistas usando @faker-js/faker
 * Usa axios para hacer requests al servidor (opcional, también escribe directo)
 */

import { faker } from '@faker-js/faker';
import { writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración regional para nombres en español
faker.locale = 'es';

console.log('\n🌱 Iniciando seed de base de datos...\n');

// ============================================
// CARGAR ESTRUCTURA BASE
// ============================================

const dbPath = join(__dirname, 'db.json');
let db;

try {
  const dbContent = readFileSync(dbPath, 'utf8');
  db = JSON.parse(dbContent);
  console.log('✅ Estructura base cargada desde db.json');
} catch (error) {
  console.error('❌ Error cargando db.json:', error.message);
  process.exit(1);
}

// ============================================
// FUNCIONES GENERADORAS
// ============================================

/**
 * Generar usuarios de prueba
 */
function generateUsuarios(cantidad = 20) {
  console.log(`\n👥 Generando ${cantidad} usuarios...`);
  const usuarios = [];

  // Usuarios predefinidos para testing
  const usuariosPredefinidos = [
    {
      id: 1,
      nombre: 'Admin Principal',
      email: 'admin@barberia.com',
      password: 'admin123',
      rolId: 1, // super_admin
      sucursalId: null,
      activo: true
    },
    {
      id: 2,
      nombre: 'Admin Sede Lima',
      email: 'admin.lima@barberia.com',
      password: 'admin123',
      rolId: 2, // branch_admin
      sucursalId: 1,
      activo: true
    },
    {
      id: 3,
      nombre: 'Sofia Recepcionista',
      email: 'recepcion@barberia.com',
      password: 'recepcion123',
      rolId: 3, // reception
      sucursalId: 1,
      activo: true
    },
    {
      id: 4,
      nombre: 'Miguel Barbero',
      email: 'barbero@barberia.com',
      password: 'barbero123',
      rolId: 4, // barber
      sucursalId: 1,
      activo: true
    },
    {
      id: 5,
      nombre: 'Juan Cliente',
      email: 'cliente@barberia.com',
      password: 'cliente123',
      rolId: 5, // client
      sucursalId: null,
      activo: true
    }
  ];

  usuarios.push(...usuariosPredefinidos);

  // Generar usuarios random
  for (let i = usuarios.length + 1; i <= cantidad; i++) {
    const rolId = faker.helpers.arrayElement([2, 3, 4, 5]); // No generar más super_admins
    const sucursalId = [2, 3, 4].includes(rolId) ? faker.number.int({ min: 1, max: 5 }) : null;

    usuarios.push({
      id: i,
      nombre: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: 'password123',
      rolId,
      sucursalId,
      activo: faker.datatype.boolean(0.95), // 95% activos
      createdAt: faker.date.past({ years: 2 }).toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  console.log(`   ✅ ${usuarios.length} usuarios generados`);
  return usuarios;
}

/**
 * Generar sucursales
 */
function generateSucursales() {
  console.log('\n🏢 Generando sucursales...');

  const sucursales = [
    {
      id: 1,
      nombre: 'Lima Central',
      direccion: 'Av. Abancay 123, Cercado de Lima',
      ciudad: 'Lima',
      pais: 'PE',
      telefono: '+51 01 234 5678',
      email: 'lima@barberia.com',
      manager: 'Admin Sede Lima',
      horaApertura: '08:00',
      horaCierre: '22:00',
      capacidad: 4,
      activa: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      nombre: 'Callao Premium',
      direccion: 'Av. Colonial 456, Callao',
      ciudad: 'Callao',
      pais: 'PE',
      telefono: '+51 01 345 6789',
      email: 'callao@barberia.com',
      manager: 'Luis Manager',
      horaApertura: '09:00',
      horaCierre: '21:00',
      capacidad: 3,
      activa: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      nombre: 'Miraflores Express',
      direccion: 'Av. Larco 789, Miraflores',
      ciudad: 'Lima',
      pais: 'PE',
      telefono: '+51 01 456 7890',
      email: 'miraflores@barberia.com',
      manager: 'Rosa Manager',
      horaApertura: '08:30',
      horaCierre: '21:30',
      capacidad: 2,
      activa: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 4,
      nombre: 'San Isidro Classic',
      direccion: 'Av. Javier Prado 321, San Isidro',
      ciudad: 'Lima',
      pais: 'PE',
      telefono: '+51 01 567 8901',
      email: 'sanisidro@barberia.com',
      manager: 'Pedro Manager',
      horaApertura: '08:00',
      horaCierre: '20:00',
      capacidad: 2,
      activa: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 5,
      nombre: 'Surco Modern',
      direccion: 'Av. Primavera 654, Surco',
      ciudad: 'Lima',
      pais: 'PE',
      telefono: '+51 01 678 9012',
      email: 'surco@barberia.com',
      manager: 'Carmen Manager',
      horaApertura: '08:30',
      horaCierre: '21:00',
      capacidad: 3,
      activa: true,
      createdAt: new Date().toISOString()
    }
  ];

  console.log(`   ✅ ${sucursales.length} sucursales generadas`);
  return sucursales;
}

/**
 * Generar clientes
 */
function generateClientes(cantidad = 50) {
  console.log(`\n👨‍👩‍👧‍👦 Generando ${cantidad} clientes...`);
  const clientes = [];

  for (let i = 1; i <= cantidad; i++) {
    clientes.push({
      id: i,
      nombre: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      telefono: faker.phone.number('+51 9## ### ###'),
      fechaNacimiento: faker.date.birthdate({ min: 18, max: 70, mode: 'age' }).toISOString().split('T')[0],
      direccion: faker.location.streetAddress(true),
      sucursalPreferida: faker.number.int({ min: 1, max: 5 }),
      barberoPreferido: faker.number.int({ min: 1, max: 15 }),
      puntosLealtad: faker.number.int({ min: 0, max: 5000 }),
      totalVisitas: faker.number.int({ min: 0, max: 100 }),
      totalGastado: faker.number.float({ min: 0, max: 10000, precision: 0.01 }),
      serviciosPreferidos: faker.helpers.arrayElements(['Corte Clásico', 'Fade', 'Barba', 'Tinte'], faker.number.int({ min: 1, max: 3 })),
      notas: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
      estado: faker.helpers.arrayElement(['active', 'active', 'active', 'inactive']),
      ultimaVisita: faker.date.recent({ days: 90 }).toISOString(),
      createdAt: faker.date.past({ years: 2 }).toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  console.log(`   ✅ ${clientes.length} clientes generados`);
  return clientes;
}

/**
 * Generar barberos
 */
function generateBarberos(cantidad = 15) {
  console.log(`\n💈 Generando ${cantidad} barberos...`);
  const barberos = [];

  const especialidades = [
    'Corte Clásico', 'Fade', 'Barba', 'Diseño', 'Tinte',
    'Cejas', 'Afeitado', 'Degradado', 'Undercut', 'Pompadour'
  ];

  for (let i = 1; i <= cantidad; i++) {
    barberos.push({
      id: i,
      nombre: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      telefono: faker.phone.number('+51 9## ### ###'),
      sucursalId: faker.number.int({ min: 1, max: 5 }),
      especialidades: faker.helpers.arrayElements(especialidades, faker.number.int({ min: 2, max: 5 })),
      rating: faker.number.float({ min: 3.5, max: 5.0, precision: 0.1 }),
      totalServicios: faker.number.int({ min: 50, max: 2000 }),
      totalGanancias: faker.number.float({ min: 5000, max: 100000, precision: 0.01 }),
      estaPresente: faker.datatype.boolean(0.8),
      pais: 'PE',
      estado: 'active',
      experiencia: `${faker.number.int({ min: 1, max: 15 })} años de experiencia`,
      descripcion: faker.lorem.paragraph(),
      createdAt: faker.date.past({ years: 3 }).toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  console.log(`   ✅ ${barberos.length} barberos generados`);
  return barberos;
}

/**
 * Generar servicios
 */
function generateServicios() {
  console.log('\n✂️ Generando servicios...');

  const servicios = [
    {
      id: 1,
      nombre: 'Corte Clásico',
      duracion: 30,
      precio: 25,
      categoria: 'Cortes',
      descripcion: 'El corte tradicional que nunca pasa de moda',
      popular: true
    },
    {
      id: 2,
      nombre: 'Fade Moderno',
      duracion: 45,
      precio: 35,
      categoria: 'Cortes',
      descripcion: 'Corte degradado moderno con transiciones suaves',
      popular: true
    },
    {
      id: 3,
      nombre: 'Barba',
      duracion: 20,
      precio: 15,
      categoria: 'Barba',
      descripcion: 'Perfilado y arreglo profesional de barba',
      popular: false
    },
    {
      id: 4,
      nombre: 'Corte + Barba',
      duracion: 50,
      precio: 40,
      categoria: 'Combos',
      descripcion: 'Combo completo de corte y barba',
      popular: true,
      descuento: 10
    },
    {
      id: 5,
      nombre: 'Diseño Especial',
      duracion: 60,
      precio: 50,
      categoria: 'Diseños',
      descripcion: 'Diseños creativos y personalizados',
      popular: false
    },
    {
      id: 6,
      nombre: 'Tinte',
      duracion: 90,
      precio: 70,
      categoria: 'Coloración',
      descripcion: 'Coloración profesional con productos de alta calidad',
      popular: false
    },
    {
      id: 7,
      nombre: 'Cejas',
      duracion: 15,
      precio: 10,
      categoria: 'Detalles',
      descripcion: 'Perfilado y arreglo de cejas masculinas',
      popular: false
    },
    {
      id: 8,
      nombre: 'Tratamiento Capilar',
      duracion: 45,
      precio: 60,
      categoria: 'Tratamientos',
      descripcion: 'Tratamiento nutritivo para el cabello',
      popular: false
    }
  ];

  console.log(`   ✅ ${servicios.length} servicios generados`);
  return servicios;
}

/**
 * Generar citas
 */
function generateCitas(cantidad = 100, clientes, barberos, servicios) {
  console.log(`\n📅 Generando ${cantidad} citas...`);
  const citas = [];

  const estados = ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'];

  for (let i = 1; i <= cantidad; i++) {
    const cliente = faker.helpers.arrayElement(clientes);
    const barbero = faker.helpers.arrayElement(barberos);
    const serviciosSeleccionados = faker.helpers.arrayElements(
      servicios,
      faker.number.int({ min: 1, max: 3 })
    );

    const duracionTotal = serviciosSeleccionados.reduce((sum, s) => sum + s.duracion, 0);
    const precioTotal = serviciosSeleccionados.reduce((sum, s) => sum + s.precio, 0);

    const fecha = faker.date.between({
      from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 días atrás
      to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)    // 30 días adelante
    });

    citas.push({
      id: i,
      clienteId: cliente.id,
      clienteNombre: cliente.nombre,
      barberoId: barbero.id,
      barberoNombre: barbero.nombre,
      sucursalId: barbero.sucursalId,
      fecha: fecha.toISOString().split('T')[0],
      hora: `${faker.number.int({ min: 9, max: 20 })}:${faker.helpers.arrayElement(['00', '30'])}`,
      servicios: serviciosSeleccionados.map(s => s.id),
      precioTotal,
      duracion: duracionTotal,
      estado: faker.helpers.arrayElement(estados),
      notas: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
      recordatorioEnviado: faker.datatype.boolean(0.7),
      createdAt: faker.date.past({ days: 90 }).toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  console.log(`   ✅ ${citas.length} citas generadas`);
  return citas;
}

/**
 * Generar transacciones financieras
 */
function generateTransacciones(cantidad = 80, clientes, barberos) {
  console.log(`\n💰 Generando ${cantidad} transacciones...`);
  const transacciones = [];

  const categoriasIngreso = ['servicios', 'productos', 'propinas'];
  const categoriasGasto = ['rent', 'salaries', 'supplies', 'utilities', 'marketing', 'maintenance'];
  const metodosPago = ['cash', 'card', 'transfer', 'digital'];

  for (let i = 1; i <= cantidad; i++) {
    const tipo = faker.helpers.arrayElement(['income', 'income', 'income', 'expense']); // 75% ingresos
    const categoria = tipo === 'income'
      ? faker.helpers.arrayElement(categoriasIngreso)
      : faker.helpers.arrayElement(categoriasGasto);

    transacciones.push({
      id: i,
      tipo,
      categoria,
      monto: faker.number.float({ min: tipo === 'income' ? 20 : 100, max: tipo === 'income' ? 500 : 3000, precision: 0.01 }),
      metodoPago: faker.helpers.arrayElement(metodosPago),
      descripcion: faker.lorem.sentence(),
      sucursalId: faker.number.int({ min: 1, max: 5 }),
      clienteId: tipo === 'income' ? faker.helpers.arrayElement(clientes).id : null,
      barberoId: tipo === 'income' ? faker.helpers.arrayElement(barberos).id : null,
      fecha: faker.date.recent({ days: 90 }).toISOString().split('T')[0],
      createdAt: faker.date.recent({ days: 90 }).toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  console.log(`   ✅ ${transacciones.length} transacciones generadas`);
  return transacciones;
}

/**
 * Generar recompensas de loyalty
 */
function generateRecompensas() {
  console.log('\n🎁 Generando recompensas...');

  const recompensas = [
    {
      id: 1,
      nombre: '5% de Descuento',
      descripcion: 'Descuento del 5% en tu próximo servicio',
      costoPuntos: 50,
      tipoDescuento: 'percentage',
      valorDescuento: 5,
      diasValidez: 30,
      categoria: 'discount',
      activa: true
    },
    {
      id: 2,
      nombre: '10% de Descuento',
      descripcion: 'Descuento del 10% en tu próximo servicio',
      costoPuntos: 100,
      tipoDescuento: 'percentage',
      valorDescuento: 10,
      diasValidez: 30,
      categoria: 'discount',
      activa: true
    },
    {
      id: 3,
      nombre: 'Corte Gratis',
      descripcion: 'Un corte clásico completamente gratis',
      costoPuntos: 250,
      tipoDescuento: 'fixed',
      valorDescuento: 25,
      diasValidez: 45,
      categoria: 'service',
      activa: true
    },
    {
      id: 4,
      nombre: 'Barba Gratis',
      descripcion: 'Servicio de barba completamente gratis',
      costoPuntos: 150,
      tipoDescuento: 'fixed',
      valorDescuento: 15,
      diasValidez: 30,
      categoria: 'service',
      activa: true
    }
  ];

  console.log(`   ✅ ${recompensas.length} recompensas generadas`);
  return recompensas;
}

// ============================================
// EJECUTAR SEED
// ============================================

console.log('📊 Generando datos...');

// Generar datos
const usuarios = generateUsuarios(20);
const sucursales = generateSucursales();
const clientes = generateClientes(50);
const barberos = generateBarberos(15);
const servicios = generateServicios();
const citas = generateCitas(100, clientes, barberos, servicios);
const transacciones = generateTransacciones(80, clientes, barberos);
const recompensas = generateRecompensas();

// Actualizar la base de datos
db.usuarios = usuarios;
db.sucursales = sucursales;
db.clientes = clientes;
db.barberos = barberos;
db.servicios = servicios;
db.citas = citas;
db.transacciones = transacciones;
db.recompensas = recompensas;

// Inicializar arrays vacíos para otras colecciones
db.transaccionesPuntos = [];
db.recompensasCliente = [];
db.portfolio = [];
db.reviews = [];
db.asistencias = [];

// Guardar en el archivo
try {
  writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  console.log('\n✅ Base de datos generada exitosamente!');
  console.log(`📁 Ubicación: ${dbPath}`);
  console.log('\n📊 Resumen:');
  console.log(`   - ${usuarios.length} usuarios`);
  console.log(`   - ${sucursales.length} sucursales`);
  console.log(`   - ${clientes.length} clientes`);
  console.log(`   - ${barberos.length} barberos`);
  console.log(`   - ${servicios.length} servicios`);
  console.log(`   - ${citas.length} citas`);
  console.log(`   - ${transacciones.length} transacciones`);
  console.log(`   - ${recompensas.length} recompensas`);
  console.log('\n🎉 Listo! Ahora puedes iniciar el servidor con: npm start\n');
} catch (error) {
  console.error('\n❌ Error guardando base de datos:', error.message);
  process.exit(1);
}
