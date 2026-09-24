import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  Store, 
  Phone, 
  User, 
  Save, 
  RefreshCw, 
  ShieldCheck, 
  Info, 
  Download, 
  Clock,
  Users,
  UserPlus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Mail,
  Lock,
  QrCode,
  Copy,
  Check,
  Share2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { dbInit } from '../../services/localDatabase';

interface SettingsViewProps {
  onOpenAbout: () => void;
  onOpenSuperAdmin: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onOpenAbout, onOpenSuperAdmin }) => {
  const { user, tenant, isSuperAdmin, isOwner, cashiers, addCashier, removeCashier, trialDaysRemaining, updateTenantProfile } = useAuth();
  const { rates, setManualOverride, refreshRates, isLoading } = useCurrency();

  const [storeName, setStoreName] = useState<string>(tenant?.name || '');
  const [ownerName, setOwnerName] = useState<string>(tenant?.ownerName || '');
  const [phone, setPhone] = useState<string>(tenant?.phone || '');
  const [isSavedNotice, setIsSavedNotice] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Cashier management state
  const [cashierNameInput, setCashierNameInput] = useState<string>('');
  const [cashierEmailInput, setCashierEmailInput] = useState<string>('');
  const [isAddingCashier, setIsAddingCashier] = useState<boolean>(false);
  const [cashierNotice, setCashierNotice] = useState<{ text: string; isError: boolean } | null>(null);

  // Sync state if tenant updates from Firebase or local storage
  React.useEffect(() => {
    if (tenant) {
      setStoreName(tenant.name);
      setOwnerName(tenant.ownerName);
      setPhone(tenant.phone);
    }
  }, [tenant?.name, tenant?.ownerName, tenant?.phone]);

  // Share & Copy App URL
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  const handleCopyAppUrl = async () => {
    try {
      await navigator.clipboard.writeText('https://comerciopro-app.web.app');
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    } catch {
      alert('Enlace: https://comerciopro-app.web.app');
    }
  };

  const handleShareApp = async () => {
    const shareData = {
      title: 'ComercioPro',
      text: 'Accede al sistema de ventas ComercioPro:',
      url: 'https://comerciopro-app.web.app',
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Diálogo cancelado por el usuario
      }
    } else {
      handleCopyAppUrl();
    }
  };

  // Rate override
  const [manualRateActive, setManualRateActive] = useState<boolean>(rates.manualOverride.active);
  const [manualRateVal, setManualRateVal] = useState<string>(rates.manualOverride.rate.toString());

  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant) return;
    setIsSaving(true);
    try {
      await updateTenantProfile({
        name: storeName.trim() || tenant.name,
        ownerName: ownerName.trim() || tenant.ownerName,
        phone: phone.trim() || tenant.phone,
      });
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 3000);
    } catch (err) {
      console.error('Error guardando negocio:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveRateOverride = () => {
    const val = parseFloat(manualRateVal);
    if (!isNaN(val) && val > 0) {
      setManualOverride(manualRateActive, val);
      alert('Tasa de cambio configurada exitosamente.');
    }
  };

  const handleAddCashier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cashierNameInput.trim() || !cashierEmailInput.trim()) {
      setCashierNotice({ text: 'Ingresa el nombre y el correo Google del cajero/a.', isError: true });
      return;
    }
    setIsAddingCashier(true);
    setCashierNotice(null);
    try {
      const res = await addCashier(cashierNameInput.trim(), cashierEmailInput.trim());
      setCashierNotice({ text: res.message, isError: !res.success });
      if (res.success) {
        setCashierNameInput('');
        setCashierEmailInput('');
        setTimeout(() => setCashierNotice(null), 5000);
      }
    } catch (err: any) {
      setCashierNotice({ text: err?.message || 'Error al agregar cajero.', isError: true });
    } finally {
      setIsAddingCashier(false);
    }
  };

  const handleRemoveCashier = async (email: string, name: string) => {
    if (window.confirm(`¿Estás seguro de revocar el acceso a "${name}" (${email})? Ya no podrá ingresar al comercio.`)) {
      await removeCashier(email);
    }
  };

  const handleExportBackup = () => {
    const data = {
      tenant: dbInit.getTenant(),
      products: dbInit.getProducts(),
      customers: dbInit.getCustomers(),
      sales: dbInit.getSales(),
      creditTransactions: dbInit.getTransactions(),
      wastes: dbInit.getWastes(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comerciopro_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-50 overflow-hidden pb-16 md:pb-0">
      
      {/* Top Header */}
      <div className="p-4 bg-white border-b border-slate-200 shrink-0">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Configuración Local
        </h2>
        <p className="text-xs text-slate-500">
          Personaliza los datos de tu bodega, tasas y copias de seguridad.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 max-w-2xl mx-auto w-full">
        
        {/* Account Status Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-brand-emerald-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Estado de la Cuenta
              </span>
              <span className="text-sm font-black text-slate-900 capitalize block">
                {tenant.status === 'trial' ? `Acceso Temporal (${trialDaysRemaining} días restantes)` : 'Licencia Comercial Activa'}
              </span>
            </div>
          </div>
          {isSuperAdmin && (
            <button
              onClick={onOpenSuperAdmin}
              className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold hover:bg-amber-200 transition"
            >
              Superadmin
            </button>
          )}
        </div>

        {/* Store Profile Form */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Store className="w-4 h-4 text-brand-emerald-600" />
            <span>Datos de la Bodega</span>
          </h3>

          <form onSubmit={handleSaveBusiness} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Nombre Comercial del Negocio:</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nombre del Encargado / Dueño:</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Teléfono (para WhatsApp):</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-semibold"
                />
              </div>
            </div>

            {/* Correo de Registro (Solo Lectura) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Correo de Registro / Cuenta de Acceso:</span>
                </label>
                <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-md flex items-center space-x-1">
                  <Lock className="w-2.5 h-2.5 text-slate-400" />
                  <span>No modificable</span>
                </span>
              </div>
              <input
                type="email"
                disabled
                readOnly
                value={user?.email || tenant?.ownerEmail || 'No disponible'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100/70 text-slate-600 font-semibold cursor-not-allowed select-all"
              />
              <span className="text-[11px] text-slate-400 block">
                Cuenta oficial con la que inicias sesión y se autoriza la licencia comercial de tu negocio.
              </span>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {isSavedNotice && (
                <span className="text-xs text-brand-emerald-600 font-bold">
                  ✓ Datos actualizados correctamente.
                </span>
              )}
              <div className="ml-auto">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-brand-slate-900 hover:bg-brand-slate-800 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1.5 transition shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Equipo de Trabajo / Cajeros Autorizados (Solo visible para el Dueño) */}
        {isOwner && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Equipo de Trabajo / Cajeros Autorizados</span>
              </h3>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {cashiers.length} {cashiers.length === 1 ? 'cajero' : 'cajeros'}
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Agrega a tus cajeros o ayudantes ingresando su correo de Google. Tendrán acceso exclusivo al <strong>Punto de Venta (Caja)</strong> y al <strong>Cierre del Día</strong> para cuadrar su turno. No podrán modificar precios, ver inventario ni anular ventas.
            </p>

            {/* Formulario para agregar cajero */}
            <form onSubmit={handleAddCashier} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                + Agregar Nuevo Cajero/a
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600">Nombre del Cajero/a:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: María Pérez"
                    value={cashierNameInput}
                    onChange={(e) => setCashierNameInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-blue-500 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-600">Correo de Google (Gmail):</label>
                  <input
                    type="email"
                    required
                    placeholder="ejemplo@gmail.com"
                    value={cashierEmailInput}
                    onChange={(e) => setCashierEmailInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-blue-500 bg-white"
                  />
                </div>
              </div>

              {cashierNotice && (
                <div
                  className={`p-2.5 rounded-xl text-xs flex items-center space-x-1.5 font-bold ${
                    cashierNotice.isError
                      ? 'bg-rose-50 border border-rose-200 text-rose-700'
                      : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  }`}
                >
                  {cashierNotice.isError ? (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  )}
                  <span>{cashierNotice.text}</span>
                </div>
              )}

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={isAddingCashier}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1.5 transition shadow-sm cursor-pointer active:scale-95"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{isAddingCashier ? 'Agregando...' : 'Autorizar Cajero'}</span>
                </button>
              </div>
            </form>

            {/* Lista de cajeros registrados */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Cajeros Registrados en este Negocio:
              </span>

              {cashiers.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-slate-400 text-xs">
                  Aún no has registrado cajeros. Puedes ingresar el correo Google de tu personal arriba para darles acceso directo desde sus teléfonos o computadoras.
                </div>
              ) : (
                <div className="space-y-2">
                  {cashiers.map((c) => (
                    <div
                      key={c.id || c.email}
                      className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between hover:bg-slate-50/60 transition shadow-2xs"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-100">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-xs text-slate-900">{c.name}</span>
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full">
                              Cajero Activo
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium block">{c.email}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveCashier(c.email, c.name)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title={`Revocar acceso a ${c.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Compartir Aplicación y Acceso para el Equipo (Código QR) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span>Compartir Aplicación / Acceso Rápido</span>
            </h3>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              PWA Web
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Muestra o comparte este código QR para que tus cajeros, ayudantes o socios abran ComercioPro directamente en sus teléfonos o computadoras.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
            {/* Contenedor del Código QR */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs shrink-0 flex flex-col items-center">
              <img
                src="/qr-comerciopro.svg"
                alt="Código QR ComercioPro"
                className="w-36 h-36 sm:w-40 sm:h-40 object-contain"
              />
              <span className="text-[10px] text-slate-400 font-bold mt-1 text-center">
                Escanear con la cámara
              </span>
            </div>

            {/* Enlace y Botones de Acción */}
            <div className="flex-1 w-full space-y-2.5">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Enlace directo de la aplicación:
                </span>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-xs text-slate-700 select-all truncate font-semibold">
                  https://comerciopro-app.web.app
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopyAppUrl}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center space-x-1.5 transition shadow-2xs cursor-pointer"
                >
                  {copiedUrl ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copiar Enlace</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleShareApp}
                  className="px-3 py-2 rounded-xl bg-brand-emerald-600 hover:bg-brand-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition shadow-xs cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartir</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400 leading-normal">
                💡 Al escanearlo o abrir el enlace, pueden presionar "Instalar aplicación" o "Agregar a pantalla de inicio" para tenerla como app en su teléfono.
              </p>
            </div>
          </div>
        </div>

        {/* Exchange Rate Override */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
              <span>Tasa de Cambio y Override Manual</span>
            </h3>
            <button
              onClick={refreshRates}
              disabled={isLoading}
              className="text-xs text-brand-emerald-600 hover:underline flex items-center space-x-1"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Sincronizar BCV</span>
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-600">Tasa Oficial DolarAPI (BCV):</span>
              <span className="font-black text-slate-900 text-sm">Bs {rates.bcv.toFixed(2)}</span>
            </div>

            <label className="flex items-center space-x-2 cursor-pointer font-bold text-slate-800">
              <input
                type="checkbox"
                checked={manualRateActive}
                onChange={(e) => setManualRateActive(e.target.checked)}
                className="rounded text-brand-emerald-600"
              />
              <span>Forzar Tasa Manual Personalizada (Override)</span>
            </label>

            {manualRateActive && (
              <div className="space-y-1 pt-1">
                <label className="font-bold text-slate-700">Valor de la Tasa Manual (Bs/$):</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    step="0.01"
                    value={manualRateVal}
                    onChange={(e) => setManualRateVal(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 font-black text-sm"
                  />
                  <button
                    onClick={handleSaveRateOverride}
                    className="px-4 py-2 bg-brand-emerald-600 hover:bg-brand-emerald-700 text-white font-bold rounded-xl"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Data Backup & Info */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Download className="w-4 h-4 text-slate-600" />
            <span>Copia de Respaldo Local</span>
          </h3>
          <p className="text-xs text-slate-500">
            Descarga un archivo JSON con todo tu catálogo, ventas y cuentas de fiados para tener un respaldo offline en tu dispositivo.
          </p>
          <button
            onClick={handleExportBackup}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center space-x-2 transition"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Descargar Respaldo JSON</span>
          </button>
        </div>

        {/* Legal & Account Deletion */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Privacidad y Control de Cuenta</span>
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Tus datos están protegidos y bajo tu control. Puedes consultar nuestra política de privacidad o solicitar la eliminación definitiva de tu cuenta y registros comerciales.
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href="/privacidad.html"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center space-x-1.5 transition text-center"
            >
              <span>Privacidad</span>
            </a>
            <a
              href="/eliminar-cuenta.html"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center space-x-1.5 transition text-center"
            >
              <span>Eliminar Cuenta</span>
            </a>
          </div>
        </div>

        {/* About trigger */}
        <div className="pt-2 text-center">
          <button
            onClick={onOpenAbout}
            className="text-xs text-slate-400 hover:text-slate-700 font-semibold flex items-center justify-center space-x-1 mx-auto"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Acerca de ComercioPro v1.0 • Oman Vásquez</span>
          </button>
        </div>
      </div>
    </div>
  );
};
