import React from 'react';
import { ShoppingCart, Package, Users, BarChart3, Settings, ShieldCheck, Download, Info } from 'lucide-react';
import { TabType } from './BottomNav';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenSuperAdmin: () => void;
  onOpenAbout?: () => void;
  onOpenInstall?: () => void;
  isInstalled?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenSuperAdmin,
  onOpenAbout,
  onOpenInstall,
  isInstalled = false,
}) => {
  const { totalItemsCount } = useCart();
  const { isSuperAdmin, isCashier } = useAuth();

  const navItems = isCashier
    ? [
        { id: 'pos' as TabType, label: 'Punto de Venta (Caja)', icon: ShoppingCart, badge: totalItemsCount },
        { id: 'customers' as TabType, label: 'Clientes & Fiados', icon: Users },
        { id: 'reports' as TabType, label: 'Cierre del Día', icon: BarChart3 },
      ]
    : [
        { id: 'pos' as TabType, label: 'Punto de Venta (Caja)', icon: ShoppingCart, badge: totalItemsCount },
        { id: 'inventory' as TabType, label: 'Inventario & Precios', icon: Package },
        { id: 'customers' as TabType, label: 'Clientes & Fiados', icon: Users },
        { id: 'reports' as TabType, label: 'Informes & Cierre', icon: BarChart3 },
        { id: 'settings' as TabType, label: 'Configuración Local', icon: Settings },
      ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-[calc(100vh-4rem)] sticky top-16 select-none shrink-0">
      <div className="p-4 space-y-1 flex-1">
        <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Navegación Principal
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
                isActive
                  ? 'bg-brand-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && item.badge > 0 ? (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}

        {/* Acerca de ComercioPro debajo de Configuración Local */}
        {onOpenAbout && (
          <button
            type="button"
            onClick={onOpenAbout}
            className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <Info className="w-5 h-5 text-slate-500" />
              <span>Acerca de ComercioPro</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
              v1.0
            </span>
          </button>
        )}
      </div>

      {/* Superadmin shortcut in desktop */}
      {isSuperAdmin && (
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={onOpenSuperAdmin}
            className="w-full flex items-center space-x-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold hover:bg-amber-100 transition"
          >
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Panel Superadmin</span>
          </button>
        </div>
      )}

      {/* Install App Promo in Desktop Sidebar */}
      {!isInstalled && onOpenInstall && (
        <div className="p-3 mx-3 mb-2 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 text-white shadow-sm shrink-0">
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Download className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-white">Instalar en PC</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-tight mb-2.5">
            Abre ComercioPro a pantalla completa como una caja registradora.
          </p>
          <button
            onClick={onOpenInstall}
            className="w-full py-1.5 px-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-1.5 transition shadow shadow-amber-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Instalar Programa</span>
          </button>
        </div>
      )}

      {/* Desktop footer info */}
      <div className="p-4 border-t border-slate-200 text-xs text-slate-400 shrink-0">
        <p className="font-semibold text-slate-600">ComercioPro v1.0</p>
        <p className="text-[11px] text-slate-400">Por Oman Vásquez</p>
      </div>
    </aside>
  );
};
