import React, { useState, useEffect, useRef } from 'react';
import { X, Zap, ArrowRight, DollarSign } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

interface QuickSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: (data: { amountUSD: number; amountVES: number; concept: string }) => void;
}

export const QuickSaleModal: React.FC<QuickSaleModalProps> = ({
  isOpen,
  onClose,
  onProceed,
}) => {
  const { effectiveRate, toVES, toUSD } = useCurrency();
  const [currencyMode, setCurrencyMode] = useState<'USD' | 'VES'>('USD');
  const [amountInput, setAmountInput] = useState<string>('');
  const [concept, setConcept] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setAmountInput('');
      setConcept('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const rawAmount = parseFloat(amountInput) || 0;
  const amountUSD = currencyMode === 'USD' ? rawAmount : toUSD(rawAmount);
  const amountVES = currencyMode === 'VES' ? rawAmount : toVES(rawAmount);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (rawAmount <= 0) return;

    onProceed({
      amountUSD: Math.round(amountUSD * 100) / 100,
      amountVES: Math.round(amountVES * 100) / 100,
      concept: concept.trim() || 'Cobro Rápido',
    });
  };

  const handleQuickAdd = (value: number) => {
    setAmountInput(value.toString());
    inputRef.current?.focus();
  };

  const usdPresets = [1, 2, 5, 10, 20, 50];
  const vesPresets = [50, 100, 200, 500, 1000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-brand-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-emerald-500/20 border border-brand-emerald-500/40 flex items-center justify-center text-brand-emerald-400">
              <Zap className="w-5 h-5 fill-brand-emerald-400" />
            </div>
            <div>
              <h3 className="font-black text-base tracking-tight text-white">Cobro Rápido</h3>
              <p className="text-[11px] text-slate-400">Venta libre directa sin descontar inventario</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          
          {/* Currency Mode Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Moneda del monto
            </label>
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setCurrencyMode('USD')}
                className={`py-2 rounded-lg transition ${
                  currencyMode === 'USD'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Dólares ($ USD)
              </button>
              <button
                type="button"
                onClick={() => setCurrencyMode('VES')}
                className={`py-2 rounded-lg transition ${
                  currencyMode === 'VES'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Bolívares (Bs)
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Monto a cobrar
            </label>
            <div className="relative">
              <div className="absolute left-4 top-3 text-slate-400 font-bold text-lg select-none">
                {currencyMode === 'USD' ? '$' : 'Bs'}
              </div>
              <input
                ref={inputRef}
                type="number"
                step="any"
                min="0.01"
                placeholder="0.00"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-2xl font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-emerald-500 focus:bg-white transition"
              />
            </div>

            {/* Live conversion info */}
            <div className="mt-2 flex items-center justify-between text-xs px-1 text-slate-500">
              <span>
                {rawAmount > 0 ? (
                  currencyMode === 'USD' ? (
                    <span className="font-semibold text-brand-emerald-700">
                      ≈ Bs {amountVES.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  ) : (
                    <span className="font-semibold text-brand-emerald-700">
                      ≈ ${amountUSD.toFixed(2)} USD
                    </span>
                  )
                ) : (
                  <span>Ingresa el monto a cobrar</span>
                )}
              </span>
              <span className="text-[11px] text-slate-400">
                Tasa: Bs {effectiveRate.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Montos rápidos
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currencyMode === 'USD'
                ? usdPresets.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleQuickAdd(val)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition active:scale-95 ${
                        amountInput === val.toString()
                          ? 'bg-brand-emerald-600 text-white border-brand-emerald-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      ${val}
                    </button>
                  ))
                : vesPresets.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleQuickAdd(val)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition active:scale-95 ${
                        amountInput === val.toString()
                          ? 'bg-brand-emerald-600 text-white border-brand-emerald-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      Bs {val}
                    </button>
                  ))}
            </div>
          </div>

          {/* Concept / Description (Optional) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Concepto / Detalle (Opcional)
            </label>
            <input
              type="text"
              placeholder="Cobro Rápido (ej. Servicio, Fotocopia, Varios)"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-emerald-500 focus:bg-white transition"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={rawAmount <= 0}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-1.5 active:scale-95 ${
                rawAmount > 0
                  ? 'bg-brand-emerald-600 hover:bg-brand-emerald-500 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Ir a Cobrar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
