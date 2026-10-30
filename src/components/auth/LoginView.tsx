import React, { useState } from 'react';
import { 
  ArrowDown,
  ArrowRight,
  Banknote,
  BarChart3,
  Boxes,
  Check,
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  CreditCard,
  Store, 
  ShieldCheck, 
  WifiOff, 
  Sparkles, 
  DollarSign, 
  Smartphone, 
  Layers, 
  HelpCircle,
  Download,
  LockKeyhole,
  MessageCircle,
  PackageCheck,
  ScanBarcode,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { openWhatsAppLink } from '../../services/whatsapp';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { InstallAppModal } from '../common/InstallAppModal';

const LoginPortal: React.FC = () => {
  const { loginWithGoogle, loginAsDemo } = useAuth();
  const {
    isInstalled,
    triggerInstall,
    isInstallModalOpen,
    setIsInstallModalOpen,
    deferredPrompt,
  } = usePWAInstall();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleLogin = async () => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err?.message?.includes('operation-not-allowed')
          ? 'El proveedor de Google aún no está activado en la consola de Firebase. Actívalo en Authentication > Sign-in method.'
          : 'No se pudo iniciar sesión. Por favor intenta de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactWhatsApp = () => {
    const text = encodeURIComponent(
      'Hola, me comunico desde ComercioPro para solicitar información y activación de acceso para mi comercio.'
    );
    openWhatsAppLink('584124169949', text);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-brand-emerald-500 selection:text-slate-950">
      
      {/* Top Bar */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-white p-1.5 flex items-center justify-center shadow-lg shadow-slate-950/20 shrink-0">
            <img src="/logo.png" alt="ComercioPro" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-white">ComercioPro</span>
            <span className="text-[10px] ml-2 font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              v1.0
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          {!isInstalled && (
            <button
              onClick={triggerInstall}
              className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3 py-1.5 rounded-xl text-xs shadow-md shadow-amber-500/20 transition"
              title="Instalar ComercioPro en PC o Teléfono"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalar App</span>
            </button>
          )}

          <button
            onClick={handleContactWhatsApp}
            className="text-xs text-slate-400 hover:text-amber-400 font-semibold flex items-center space-x-1 transition"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Contacto y Soporte</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full space-y-8 my-auto">
          
          {/* Hero text */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Gestión Comercial para Negocios y Emprendimientos</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Tu negocio bajo control, <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">
                sin enredos en caja.
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
              Control de inventario con doble anclaje USD/Bs, punto de venta ágil, categorías a tu medida y reportes diarios.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 gap-2.5 text-left">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                <DollarSign className="w-4 h-4" />
                <span>Doble Anclaje</span>
              </div>
              <p className="text-[11px] text-slate-400">Precios base en USD o Bs con tasa DolarAPI y override.</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs">
                <WifiOff className="w-4 h-4" />
                <span>Modo Offline</span>
              </div>
              <p className="text-[11px] text-slate-400">Vende sin internet y sincroniza todo al reconectar.</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs">
                <Smartphone className="w-4 h-4" />
                <span>Fiados en USD</span>
              </div>
              <p className="text-[11px] text-slate-400">Deuda congelada en USD protegida de la devaluación.</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                <Layers className="w-4 h-4" />
                <span>Cierre Diario</span>
              </div>
              <p className="text-[11px] text-slate-400">Arqueo por efectivo $, Bs, Pago Móvil y ganancia neta.</p>
            </div>
          </div>

          {/* Login Card */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4 text-center">
            <div className="space-y-1.5">
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 border border-slate-700">
                Acceso Exclusivo / Por Invitación
              </div>
              <h3 className="text-base font-bold text-white">Ingreso al Sistema</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Inicia sesión con tu cuenta autorizada de Google para ingresar a tu comercio.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-left">
                {errorMsg}
              </div>
            )}

            {/* Google Sign-in Button */}
            <button
              onClick={handleLogin}
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm flex items-center justify-center space-x-3 shadow-xl transition active:scale-[0.98] disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isSubmitting ? 'Conectando...' : 'Iniciar Sesión con Google'}</span>
            </button>

            {/* Demo / Google Play Reviewer Access */}
            <div className="pt-1">
              <button
                type="button"
                onClick={loginAsDemo}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center space-x-2 border border-slate-700 transition active:scale-[0.98]"
                title="Acceso directo a mostrador y caja con datos de prueba preconfigurados"
              >
                <span>🧪 Modo Demostración (Acceso de Prueba / Evaluadores)</span>
              </button>
            </div>

            <div className="pt-2 flex flex-col items-center space-y-2.5">
              <button
                type="button"
                onClick={handleContactWhatsApp}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4 transition"
              >
                ¿No tienes acceso aún? Solicita tu registro comercial aquí
              </button>
              
              <div className="text-[11px] text-slate-500 flex items-center justify-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>Acceso seguro mediante Google Authentication</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer with Google Play Compliance links */}
      <footer className="px-6 py-4 text-center border-t border-slate-900 text-xs text-slate-500 space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <a href="/privacidad.html" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition">
            Política de Privacidad
          </a>
          <span className="text-slate-700">•</span>
          <a href="/terminos.html" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition">
            Términos y Condiciones
          </a>
          <span className="text-slate-700">•</span>
          <a href="/eliminar-cuenta.html" target="_blank" rel="noopener noreferrer" className="hover:text-rose-400 transition">
            Eliminación de Datos
          </a>
        </div>
        <p>
          ComercioPro • Desarrollado por <a href="https://oman-vasquez.web.app/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:underline">Oman Vásquez</a>
        </p>
      </footer>

      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onDirectInstall={triggerInstall}
        hasPrompt={!!deferredPrompt}
      />
    </div>
  );
};

export const LoginView: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);

  const handleContactWhatsApp = () => {
    const text = encodeURIComponent(
      'Hola, conocí ComercioPro en su página web y quiero información para empezar a usarlo en mi comercio.'
    );
    openWhatsAppLink('584124169949', text);
  };

  const modules = [
    {
      number: '01',
      icon: ScanBarcode,
      title: 'Caja lista para atender',
      description: 'Busca por nombre o código de barras, agrega productos al carrito y registra pagos completos o combinados sin perder de vista el total.',
      details: ['Efectivo en dólares y bolívares', 'Pago móvil, punto de venta y BioPago', 'Fiado y tickets por WhatsApp'],
      tone: 'bg-amber-100 text-amber-800',
    },
    {
      number: '02',
      icon: Boxes,
      title: 'Inventario que refleja tu negocio',
      description: 'Organiza productos por categorías, controla existencias y adapta la venta a cómo se mueve cada rubro, desde unidades hasta cantidades fraccionadas.',
      details: ['Precios base en USD o Bs', 'Venta a granel y fracciones', 'Despiece de bultos y registro de mermas'],
      tone: 'bg-emerald-100 text-emerald-800',
    },
    {
      number: '03',
      icon: Users,
      title: 'Clientes y cuentas claras',
      description: 'Consulta el historial de cada cliente y registra cargos y abonos con una referencia estable en dólares, además del equivalente en bolívares.',
      details: ['Historial de movimientos', 'Topes de crédito configurables', 'Estado de cuenta para WhatsApp'],
      tone: 'bg-sky-100 text-sky-800',
    },
    {
      number: '04',
      icon: ClipboardCheck,
      title: 'Cierre de caja con contexto',
      description: 'Revisa lo que entró por cada método de pago, los abonos y los fiados para entregar el turno con un arqueo más ordenado.',
      details: ['Desglose en USD y Bs', 'Registro de gastos', 'Ventas, costos y reportes por período'],
      tone: 'bg-rose-100 text-rose-800',
    },
  ];

  const faqs = [
    {
      question: '¿Para qué tipo de comercios sirve?',
      answer: 'Está pensado para comercios de mostrador en Venezuela: bodegas, abastos, ferreterías, repuesteras, papelerías y negocios que necesitan caja, inventario y control de fiados.',
    },
    {
      question: '¿Tengo que cobrar siempre en una sola moneda?',
      answer: 'No. Puedes registrar pagos combinados en efectivo USD, efectivo Bs, Pago Móvil, punto de venta, BioPago y fiado, según la operación de tu comercio.',
    },
    {
      question: '¿Qué pasa si se va el internet?',
      answer: 'ComercioPro está diseñado para trabajar offline: mantiene datos en el dispositivo y sincroniza los cambios con Firebase cuando vuelve la conexión. La primera carga y la sincronización sí requieren internet.',
    },
    {
      question: '¿Cualquier persona puede crear una cuenta?',
      answer: 'El acceso es por invitación. El dueño autoriza a los cajeros y los permisos limitan qué información y acciones puede usar cada rol.',
    },
  ];

  return (
    <div className="min-h-screen bg-brand-pearl text-slate-900 selection:bg-amber-300 selection:text-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#inicio" className="flex shrink-0 items-center gap-3" aria-label="ComercioPro, ir al inicio">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 p-1.5">
              <img src="/logo.png" alt="" className="h-full w-full object-contain" />
            </span>
            <span className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">ComercioPro</span>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 lg:flex" aria-label="Navegación principal">
            <a href="#funciones" className="transition hover:text-slate-950">Funciones</a>
            <a href="#como-funciona" className="transition hover:text-slate-950">Cómo funciona</a>
            <a href="#preguntas" className="transition hover:text-slate-950">Preguntas</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsLoginOpen(true)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-800 transition hover:border-slate-950 hover:bg-slate-50 sm:px-4 sm:text-sm"
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={handleContactWhatsApp}
              className="hidden items-center gap-2 rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-black text-slate-950 transition hover:bg-amber-300 sm:inline-flex"
            >
              Solicitar acceso <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main>
        <section id="inicio" className="overflow-hidden bg-slate-950 text-white">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:px-8 lg:py-24">
            <div className="relative z-10">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3.5 py-2 text-xs font-bold text-emerald-200 sm:text-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                Hecho para el día a día del comercio venezolano
              </div>
              <h1 className="max-w-2xl text-4xl font-black leading-[1.08] text-white sm:text-5xl lg:text-6xl">
                ComercioPro
                <span className="mt-3 block text-2xl leading-tight text-amber-300 sm:text-3xl lg:text-4xl">
                  Caja, inventario y fiados en un solo lugar.
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                Soy <a href="https://oman-vasquez.web.app/" target="_blank" rel="noopener noreferrer" className="font-bold text-white underline decoration-amber-400 underline-offset-2 transition hover:text-amber-300">Oman Vásquez</a>, desarrollador de ComercioPro. Creé esta herramienta pensando en el día a día de los comercios venezolanos: cobra en USD y bolívares, controla tus productos y termina el día sabiendo cómo quedó la caja.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleContactWhatsApp}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-amber-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-amber-300"
                >
                  Quiero conocer ComercioPro <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href="#funciones"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-600 px-5 py-3 text-sm font-bold text-white transition hover:border-slate-400 hover:bg-white/5"
                >
                  Explorar funciones <ArrowDown className="h-4 w-4" />
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-400 sm:text-sm">
                <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-300" /> Diseñado para USD y Bs</span>
                <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-300" /> Usable en celular y computadora</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[540px] lg:ml-auto">
              <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/30">
                <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400 text-slate-950"><BarChart3 className="h-5 w-5" /></span>
                    <div>
                      <p className="text-sm font-bold text-white">Resumen del negocio</p>
                      <p className="text-xs text-slate-400">Una vista ilustrativa del sistema</p>
                    </div>
                  </div>
                  <span className="rounded-md bg-emerald-400/10 px-2.5 py-1 text-[11px] font-bold text-emerald-300">Caja</span>
                </div>
                <div className="grid grid-cols-2 gap-3 p-4 sm:p-5">
                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="text-xs font-medium text-slate-400">Ventas registradas</p>
                    <p className="mt-2 text-2xl font-black text-white">Punto de venta</p>
                    <p className="mt-1 text-xs text-emerald-300">Cobros completos o combinados</p>
                  </div>
                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="text-xs font-medium text-slate-400">Control de dinero</p>
                    <div className="mt-2 flex items-center gap-2 text-sm font-bold text-white"><Banknote className="h-4 w-4 text-amber-300" /> USD + Bs</div>
                    <p className="mt-2 text-xs text-slate-400">Efectivo, pagos y fiados</p>
                  </div>
                </div>
                <div className="px-4 pb-2 sm:px-5">
                  <p className="mb-2 text-xs font-bold uppercase text-slate-500">Actividad del comercio</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-lg border border-slate-800 px-3 py-3">
                      <span className="flex items-center gap-2 text-sm text-slate-200"><PackageCheck className="h-4 w-4 text-emerald-300" /> Inventario y productos</span>
                      <Check className="h-4 w-4 text-emerald-300" />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-slate-800 px-3 py-3">
                      <span className="flex items-center gap-2 text-sm text-slate-200"><Users className="h-4 w-4 text-sky-300" /> Clientes y cuentas por cobrar</span>
                      <Check className="h-4 w-4 text-emerald-300" />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-slate-800 px-3 py-3">
                      <span className="flex items-center gap-2 text-sm text-slate-200"><ClipboardCheck className="h-4 w-4 text-rose-300" /> Cierre y reportes</span>
                      <Check className="h-4 w-4 text-emerald-300" />
                    </div>
                  </div>
                </div>
                <div className="m-4 flex items-center gap-2 rounded-lg border border-emerald-300/15 bg-emerald-300/5 px-3 py-3 text-xs leading-5 text-emerald-100 sm:m-5">
                  <WifiOff className="h-4 w-4 shrink-0 text-emerald-300" />
                  Diseñado para continuar trabajando sin conexión y sincronizar al volver internet.
                </div>
              </div>
              <p className="mt-3 text-center text-[11px] text-slate-500">La información mostrada es ilustrativa, no corresponde a datos de un negocio.</p>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-5 px-4 py-6 sm:px-6 md:grid-cols-4 lg:px-8">
            <div className="flex items-center gap-3 md:border-r md:border-slate-200 md:px-5"><Banknote className="h-5 w-5 shrink-0 text-emerald-700" /><span className="text-xs font-bold text-slate-700 sm:text-sm">Operaciones en USD y Bs</span></div>
            <div className="flex items-center gap-3 md:border-r md:border-slate-200 md:px-5"><CreditCard className="h-5 w-5 shrink-0 text-sky-700" /><span className="text-xs font-bold text-slate-700 sm:text-sm">Métodos de pago mixtos</span></div>
            <div className="flex items-center gap-3 md:border-r md:border-slate-200 md:px-5"><WifiOff className="h-5 w-5 shrink-0 text-amber-700" /><span className="text-xs font-bold text-slate-700 sm:text-sm">Trabajo offline-first</span></div>
            <div className="flex items-center gap-3 md:px-5"><Smartphone className="h-5 w-5 shrink-0 text-rose-700" /><span className="text-xs font-bold text-slate-700 sm:text-sm">Celular, tablet o PC</span></div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <p className="text-xs font-black uppercase text-emerald-800">El comercio real, no el ideal</p>
              <h2 className="mt-3 max-w-lg text-3xl font-black leading-tight text-slate-950 sm:text-4xl">Hecho para cómo se vende en Venezuela.</h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
                En un mismo día puedes cobrar en efectivo, recibir un Pago Móvil, anotar un fiado y vender productos por unidad o al peso. ComercioPro ayuda a tener esas operaciones en un mismo registro.
              </p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-[1.1fr_0.9fr] gap-3">
                <figure className="animate-rise-in group relative aspect-[4/3] min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
                  <img
                    src="/portada-productos.webp"
                    alt="Productos frescos organizados en estantes de un comercio"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.025]"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-slate-950/75 px-3 py-2.5 text-xs font-bold text-white sm:px-4 sm:py-3 sm:text-sm">
                    Inventario listo para el mostrador
                  </figcaption>
                </figure>
                <figure className="animate-rise-in group relative mt-5 aspect-[4/3] min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm" style={{ animationDelay: '120ms' }}>
                  <img
                    src="/portada-mostrador.webp"
                    alt="Comerciante atendiendo a una clienta en el mostrador"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.025]"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-slate-950/75 px-3 py-2.5 text-xs font-bold text-white sm:px-4 sm:py-3 sm:text-sm">
                    Cada cobro, claro y registrado
                  </figcaption>
                </figure>
              </div>

              <div className="grid gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-2">
              <article className="bg-white p-5 sm:p-6">
                <Banknote className="h-6 w-6 text-amber-700" />
                <h3 className="mt-4 text-base font-extrabold text-slate-950">La tasa cambia. Tus precios tienen contexto.</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Ancla productos en dólares o bolívares, consulta la tasa disponible y usa el ajuste manual cuando tu operación lo requiera.</p>
              </article>
              <article className="bg-white p-5 sm:p-6">
                <WifiOff className="h-6 w-6 text-emerald-700" />
                <h3 className="mt-4 text-base font-extrabold text-slate-950">Una conexión inestable no debería parar la caja.</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">La aplicación conserva información en el dispositivo y sincroniza con la nube cuando recupera conexión.</p>
              </article>
              <article className="bg-white p-5 sm:p-6">
                <MessageCircle className="h-6 w-6 text-sky-700" />
                <h3 className="mt-4 text-base font-extrabold text-slate-950">WhatsApp ya es parte del mostrador.</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Comparte tickets y estados de cuenta con el cliente usando mensajes preparados para WhatsApp.</p>
              </article>
              <article className="bg-white p-5 sm:p-6">
                <LockKeyhole className="h-6 w-6 text-rose-700" />
                <h3 className="mt-4 text-base font-extrabold text-slate-950">Cada quien ve lo que necesita.</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Configura acceso para cajeros con permisos distintos a los del dueño y revócalo cuando haga falta.</p>
              </article>
              </div>
            </div>
          </div>
        </section>

        <section id="funciones" className="border-y border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase text-emerald-800">Una herramienta para el día completo</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">De la primera venta al cierre de caja.</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">Cada módulo responde a una tarea concreta del mostrador y queda conectado con el resto de la operación.</p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {modules.map(({ number, icon: Icon, title, description, details, tone }) => (
                <article key={number} className="grid gap-4 rounded-lg border border-slate-200 bg-brand-pearl p-5 sm:grid-cols-[auto_1fr] sm:gap-5 sm:p-6">
                  <div className="flex items-start justify-between sm:block">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${tone}`}><Icon className="h-5 w-5" /></span>
                    <span className="font-mono text-xs font-bold text-slate-400 sm:mt-4 sm:block">{number}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-950">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                    <ul className="mt-4 grid gap-2">
                      {details.map((detail) => <li key={detail} className="flex items-start gap-2 text-xs font-semibold text-slate-700 sm:text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />{detail}</li>)}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="como-funciona" className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-8 lg:py-24">
          <div>
            <p className="text-xs font-black uppercase text-emerald-800">Una rutina fácil de seguir</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">El negocio en orden, paso a paso.</h2>
            <p className="mt-5 text-base leading-7 text-slate-600">ComercioPro reúne la información que normalmente termina repartida entre la caja, una libreta y varias cuentas de WhatsApp.</p>
            <button type="button" onClick={handleContactWhatsApp} className="mt-7 inline-flex items-center gap-2 text-sm font-black text-slate-950 underline decoration-amber-500 decoration-2 underline-offset-4 transition hover:text-emerald-800">
              Consultar cómo empezar <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <ol className="divide-y divide-slate-200 border-y border-slate-200">
            <li className="grid grid-cols-[48px_1fr] gap-4 py-5 sm:grid-cols-[60px_1fr] sm:py-6">
              <span className="font-mono text-sm font-black text-amber-700">01</span>
              <div><h3 className="font-extrabold text-slate-950">Prepara tu catálogo</h3><p className="mt-1.5 text-sm leading-6 text-slate-600">Registra productos, categorías, costos y precios según vendas por pieza, peso o fracción.</p></div>
            </li>
            <li className="grid grid-cols-[48px_1fr] gap-4 py-5 sm:grid-cols-[60px_1fr] sm:py-6">
              <span className="font-mono text-sm font-black text-emerald-700">02</span>
              <div><h3 className="font-extrabold text-slate-950">Registra cada venta</h3><p className="mt-1.5 text-sm leading-6 text-slate-600">Busca los productos, elige el cliente si aplica y separa el cobro entre los métodos recibidos.</p></div>
            </li>
            <li className="grid grid-cols-[48px_1fr] gap-4 py-5 sm:grid-cols-[60px_1fr] sm:py-6">
              <span className="font-mono text-sm font-black text-sky-700">03</span>
              <div><h3 className="font-extrabold text-slate-950">Revisa y entrega el turno</h3><p className="mt-1.5 text-sm leading-6 text-slate-600">Consulta cobros, abonos, gastos y fiados para entender el movimiento de la jornada.</p></div>
            </li>
          </ol>
        </section>

        <section className="bg-slate-950 py-16 text-white sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase text-amber-300">También para el equipo</p>
              <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">El dueño administra. El cajero atiende.</h2>
              <p className="mt-4 text-base leading-7 text-slate-300">Autoriza usuarios de caja y asigna permisos para que puedan vender, consultar clientes y hacer el cierre del día sin acceder a las funciones de administración.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:min-w-[330px]">
              <div className="rounded-lg border border-slate-700 bg-slate-900 p-4"><ShieldCheck className="h-5 w-5 text-emerald-300" /><p className="mt-3 text-sm font-bold">Acceso por roles</p><p className="mt-1 text-xs leading-5 text-slate-400">Permisos para cada función.</p></div>
              <div className="rounded-lg border border-slate-700 bg-slate-900 p-4"><BarChart3 className="h-5 w-5 text-amber-300" /><p className="mt-3 text-sm font-bold">Reportes del negocio</p><p className="mt-1 text-xs leading-5 text-slate-400">Métricas para el dueño.</p></div>
            </div>
          </div>
        </section>

        <section id="preguntas" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="text-center">
            <CircleHelp className="mx-auto h-7 w-7 text-emerald-800" />
            <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">Preguntas frecuentes</h2>
          </div>
          <div className="mt-9 divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map(({ question, answer }) => (
              <details key={question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-extrabold text-slate-900 sm:text-base">
                  {question}
                  <ChevronDown className="h-5 w-5 shrink-0 text-slate-500 transition group-open:rotate-180" />
                </summary>
                <p className="max-w-3xl pt-3 pr-7 text-sm leading-6 text-slate-600">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="border-y border-amber-500/30 bg-amber-300">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8 lg:py-14">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase text-slate-700">El siguiente paso es una conversación</p>
              <h2 className="mt-2 text-2xl font-black leading-tight text-slate-950 sm:text-3xl">Cuéntanos qué tipo de comercio tienes.</h2>
              <p className="mt-2 text-sm leading-6 text-slate-800">Te orientamos sobre el acceso y cómo ComercioPro puede encajar en tu operación.</p>
            </div>
            <button type="button" onClick={handleContactWhatsApp} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800">
              <MessageCircle className="h-4 w-4" /> Hablar por WhatsApp <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 px-4 py-8 text-slate-300 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <a href="#inicio" className="flex items-center gap-3" aria-label="ComercioPro, volver al inicio">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white p-1.5"><img src="/logo.png" alt="" className="h-full w-full object-contain" /></span>
            <span><span className="block font-black text-white">ComercioPro</span><span className="text-xs text-slate-400">Herramientas para el comercio venezolano</span></span>
          </a>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium">
            <a href="/privacidad.html" target="_blank" rel="noopener noreferrer" className="transition hover:text-amber-300">Política de Privacidad</a>
            <a href="/terminos.html" target="_blank" rel="noopener noreferrer" className="transition hover:text-amber-300">Términos y Condiciones</a>
            <a href="/eliminar-cuenta.html" target="_blank" rel="noopener noreferrer" className="transition hover:text-amber-300">Eliminación de Datos</a>
            <a href="https://wa.me/584124169949" target="_blank" rel="noopener noreferrer" className="transition hover:text-amber-300">Contacto</a>
          </div>
        </div>
        <div className="mx-auto mt-6 max-w-7xl border-t border-slate-800 pt-5 text-xs text-slate-500">
          ComercioPro · Desarrollado por <a href="https://oman-vasquez.web.app/" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:underline">Oman Vásquez</a>
        </div>
      </footer>

      {isLoginOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 p-0 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-label="Iniciar sesión en ComercioPro">
          <button type="button" onClick={() => setIsLoginOpen(false)} className="fixed right-4 top-4 z-[60] inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-600 bg-slate-900 text-white transition hover:bg-slate-800 sm:right-6 sm:top-6" aria-label="Cerrar inicio de sesión">
            <X className="h-5 w-5" />
          </button>
          <LoginPortal />
        </div>
      )}
    </div>
  );
};
