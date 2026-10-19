import { SaleTicket } from '../types';

export interface PrintTicketOptions {
  storeName: string;
  storePhone?: string;
}

export function printSaleTicket(ticket: SaleTicket, options: PrintTicketOptions): void {
  const { storeName, storePhone } = options;

  const dateStr = new Date(ticket.timestamp).toLocaleString('es-VE', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

  const paymentLabels: Record<string, string> = {
    usd_cash: '💵 Efectivo $',
    ves_cash: '💵 Efectivo Bs',
    pago_movil: '📱 Pago Móvil',
    punto_venta: '💳 Punto de Venta',
    fiado: '📝 Fiado (Crédito)',
  };

  const paymentsHtml = ticket.payments
    .map(
      (p) => `
      <div class="row">
        <span>${escapeHtml(paymentLabels[p.method] || p.method)}:</span>
        <span class="bold">$${p.amountUSD.toFixed(2)} (Bs ${p.amountVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })})</span>
      </div>`
    )
    .join('');

  const itemsHtml = ticket.items
    .map(
      (item) => `
      <div class="item-block">
        <div class="item-name">${item.quantity} ${item.unit} x ${escapeHtml(item.productName)}</div>
        <div class="item-detail">
          <span>P. Unit: $${item.priceUSDAtSale.toFixed(2)}</span>
          <span class="bold">$${item.totalUSD.toFixed(2)} / Bs ${item.totalVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Ticket #${ticket.ticketNumber}</title>
  <style>
    @page {
      size: auto;
      margin: 2mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      width: 100%;
      max-width: 78mm;
      margin: 0 auto;
      padding: 3mm 2mm 12mm 2mm;
      font-family: 'Courier New', Courier, monospace;
      font-size: 11px;
      line-height: 1.25;
      color: #000;
      background: #fff;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .bold { font-weight: bold; }
    .store-name {
      font-size: 14px;
      font-weight: 900;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    .divider {
      border-top: 1px dashed #000;
      margin: 5px 0;
    }
    .double-divider {
      border-top: 1px solid #000;
      border-bottom: 1px solid #000;
      height: 2px;
      margin: 5px 0;
    }
    .row {
      display: flex;
      justify-content: space-between;
      margin: 2px 0;
    }
    .item-block {
      margin-bottom: 4px;
    }
    .item-name {
      font-weight: bold;
      word-break: break-word;
    }
    .item-detail {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      padding-left: 4px;
      color: #111;
    }
    .total-highlight {
      font-size: 13px;
      font-weight: 900;
    }
    .footer {
      margin-top: 8px;
      font-size: 10px;
    }
  </style>
</head>
<body>
  <div class="text-center">
    <div class="store-name">${escapeHtml(storeName)}</div>
    ${storePhone ? `<div>Tel: ${escapeHtml(storePhone)}</div>` : ''}
    <div class="bold" style="font-size: 13px; margin: 3px 0;">TICKET #${ticket.ticketNumber}</div>
    <div>${dateStr}</div>
    ${ticket.customerName ? `<div>Cliente: ${escapeHtml(ticket.customerName)}</div>` : ''}
    <div>Cajero: ${escapeHtml(ticket.cashierName)}</div>
    <div>Tasa BCV/ref: Bs ${ticket.exchangeRateSnapshot.appliedRate.toFixed(2)}/$</div>
  </div>

  <div class="divider"></div>
  <div class="bold" style="font-size: 10px; margin-bottom: 3px;">CANT. ARTÍCULOS:</div>
  ${itemsHtml}

  <div class="double-divider"></div>
  <div class="row total-highlight">
    <span>TOTAL USD:</span>
    <span>$${ticket.totalUSD.toFixed(2)}</span>
  </div>
  <div class="row total-highlight">
    <span>TOTAL BS:</span>
    <span>Bs ${ticket.totalVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</span>
  </div>

  <div class="divider"></div>
  <div class="bold" style="font-size: 10px; margin-bottom: 2px;">DETALLE DE PAGO:</div>
  ${paymentsHtml}

  ${ticket.changeGivenVES ? `
  <div class="row">
    <span>Vuelto entregado:</span>
    <span class="bold">Bs ${ticket.changeGivenVES.toFixed(2)}</span>
  </div>` : ''}

  ${ticket.changeCreditedUSD ? `
  <div class="row">
    <span>Vuelto a favor guardado:</span>
    <span class="bold">$${ticket.changeCreditedUSD.toFixed(2)}</span>
  </div>` : ''}

  <div class="divider"></div>
  <div class="text-center footer">
    <div class="bold">¡GRACIAS POR SU COMPRA!</div>
    <div style="font-size: 9px; margin-top: 3px; color: #333;">ComercioPro • Control Comercial</div>
  </div>
</body>
</html>`;

  // Hidden print iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (doc) {
    doc.open();
    doc.write(html);
    doc.close();

    // Small delay to ensure styles and dom are painted before printing
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      // Remove iframe safely after printing dialogue is spawned
      setTimeout(() => {
        iframe.remove();
      }, 1500);
    }, 250);
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
