import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, InventoryWaste, WasteReason, ProductUnit, Category } from '../types';
import { dbInit } from '../services/localDatabase';
import { useCurrency } from './CurrencyContext';
import { useAuth } from './AuthContext';
import { db } from '../services/firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

interface InventoryContextType {
  products: Product[];
  categories: Category[];
  wastes: InventoryWaste[];
  addProduct: (product: Omit<Product, 'id' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (name: string, color?: string) => Category;
  updateCategory: (id: string, name: string, color?: string) => void;
  deleteCategory: (id: string) => void;
  unpackBulk: (productId: string, packsToUnpack: number) => { success: boolean; message: string };
  recordWaste: (productId: string, quantity: number, reason: WasteReason, notes?: string) => void;
  clearAllWastes: () => void;
  getProductPriceUSD: (product: Product) => number;
  getProductPriceVES: (product: Product) => number;
  adjustStock: (productId: string, quantityDelta: number) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => dbInit.getProducts());
  const [categories, setCategories] = useState<Category[]>(() => dbInit.getCategories());
  const [wastes, setWastes] = useState<InventoryWaste[]>(() => dbInit.getWastes());
  const { toVES, toUSD } = useCurrency();
  const { tenant } = useAuth();

  // Sincronización en segundo plano con Firestore (Offline-First)
  useEffect(() => {
    if (!db || !tenant?.id) return;

    const colRef = collection(db, 'tenants', tenant.id, 'products');
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudProducts: Product[] = [];
          snapshot.forEach((docSnap) => {
            cloudProducts.push(docSnap.data() as Product);
          });
          cloudProducts.sort((a, b) => a.name.localeCompare(b.name));
          setProducts(cloudProducts);
          dbInit.saveProducts(cloudProducts);
        } else {
          // Si Firestore está vacío (primer uso), respaldar productos iniciales
          const local = dbInit.getProducts();
          if (local && local.length > 0) {
            local.forEach((prod) => {
              setDoc(doc(db, 'tenants', tenant.id, 'products', prod.id), prod).catch(() => {});
            });
          }
        }
      },
      (err) => {
        console.warn('Sincronización de inventario en segundo plano:', err);
      }
    );

    const catColRef = collection(db, 'tenants', tenant.id, 'categories');
    const unsubCats = onSnapshot(
      catColRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudCats: Category[] = [];
          snapshot.forEach((docSnap) => {
            cloudCats.push(docSnap.data() as Category);
          });
          cloudCats.sort((a, b) => a.name.localeCompare(b.name));
          setCategories(cloudCats);
          dbInit.saveCategories(cloudCats);
        } else {
          const local = dbInit.getCategories();
          if (local && local.length > 0) {
            local.forEach((cat) => {
              setDoc(doc(db, 'tenants', tenant.id, 'categories', cat.id), cat).catch(() => {});
            });
          }
        }
      },
      (err) => {
        console.warn('Sincronización de categorías en segundo plano:', err);
      }
    );

    return () => {
      unsubscribe();
      unsubCats();
    };
  }, [tenant?.id]);

  const getProductPriceUSD = (product: Product): number => {
    if (product.pricingMode === 'USD') {
      return product.priceUSD;
    }
    return toUSD(product.priceVES);
  };

  const getProductPriceVES = (product: Product): number => {
    if (product.pricingMode === 'VES') {
      return product.priceVES;
    }
    return toVES(product.priceUSD);
  };

  const addProduct = (newProd: Omit<Product, 'id' | 'updatedAt'>) => {
    const product: Product = {
      ...newProd,
      id: 'prod_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      tenantId: tenant?.id || 'tenant_cojedes_01',
      updatedAt: Date.now(),
    };
    const updated = [product, ...products];
    setProducts(updated);
    dbInit.saveProducts(updated);
    if (db && tenant?.id) {
      setDoc(doc(db, 'tenants', tenant.id, 'products', product.id), product).catch(() => {});
    }
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    let changed: Product | undefined;
    const updated = products.map((p) => {
      if (p.id === id) {
        changed = { ...p, ...updates, updatedAt: Date.now() };
        return changed;
      }
      return p;
    });
    setProducts(updated);
    dbInit.saveProducts(updated);
    if (db && tenant?.id && changed) {
      setDoc(doc(db, 'tenants', tenant.id, 'products', id), changed).catch(() => {});
    }
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    dbInit.saveProducts(updated);
    if (db && tenant?.id) {
      deleteDoc(doc(db, 'tenants', tenant.id, 'products', id)).catch(() => {});
    }
  };

  const addCategory = (name: string, color?: string): Category => {
    const trimmed = name.trim();
    const existing = categories.find((c) => c.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) return existing;

    const newCat: Category = {
      id: 'cat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      tenantId: tenant?.id || 'tenant_comercio_01',
      name: trimmed,
      color: color || '#2563eb',
      createdAt: Date.now(),
    };

    const updated = [...categories, newCat].sort((a, b) => a.name.localeCompare(b.name));
    setCategories(updated);
    dbInit.saveCategories(updated);

    if (db && tenant?.id) {
      setDoc(doc(db, 'tenants', tenant.id, 'categories', newCat.id), newCat).catch(() => {});
    }
    return newCat;
  };

  const updateCategory = (id: string, name: string, color?: string) => {
    const trimmed = name.trim();
    const updated = categories.map((c) => (c.id === id ? { ...c, name: trimmed, color: color || c.color } : c));
    setCategories(updated);
    dbInit.saveCategories(updated);

    if (db && tenant?.id) {
      setDoc(doc(db, 'tenants', tenant.id, 'categories', id), { name: trimmed, color: color || '#2563eb' }, { merge: true }).catch(() => {});
    }
  };

  const deleteCategory = (id: string) => {
    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    dbInit.saveCategories(updated);

    if (db && tenant?.id) {
      deleteDoc(doc(db, 'tenants', tenant.id, 'categories', id)).catch(() => {});
    }
  };

  const adjustStock = (productId: string, quantityDelta: number) => {
    setProducts((prev) => {
      let changed: Product | undefined;
      const updated = prev.map((p) => {
        if (p.id === productId) {
          const newStock = Math.max(0, Math.round((p.stock + quantityDelta) * 1000) / 1000);
          changed = { ...p, stock: newStock, updatedAt: Date.now() };
          return changed;
        }
        return p;
      });
      dbInit.saveProducts(updated);
      if (db && tenant?.id && changed) {
        setDoc(doc(db, 'tenants', tenant.id, 'products', productId), changed).catch(() => {});
      }
      return updated;
    });
  };

  // Despiece de bulto a unidades sueltas
  const unpackBulk = (productId: string, packsToUnpack: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product || !product.isBulkPack || !product.packUnits) {
      return { success: false, message: 'El producto no está configurado como bulto' };
    }

    const unitsToAdd = packsToUnpack * product.packUnits;
    adjustStock(productId, unitsToAdd);

    return {
      success: true,
      message: `Se desempacaron ${packsToUnpack} bulto(s). Se añadieron +${unitsToAdd} unidades al inventario.`,
    };
  };

  // Registro de consumo propio o mermas
  const recordWaste = (
    productId: string,
    quantity: number,
    reason: WasteReason,
    notes?: string
  ) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    adjustStock(productId, -quantity);

    const wasteEntry: InventoryWaste = {
      id: 'waste_' + Date.now(),
      tenantId: product.tenantId,
      productId: product.id,
      productName: product.name,
      quantity,
      unit: product.unit as ProductUnit,
      reason,
      costUSD: Math.round((product.costUSD * quantity) * 100) / 100,
      timestamp: Date.now(),
      notes,
    };

    const updatedWastes = [wasteEntry, ...wastes];
    setWastes(updatedWastes);
    dbInit.saveWastes(updatedWastes);
  };

  const clearAllWastes = () => {
    setWastes([]);
    dbInit.saveWastes([]);
  };

  return (
    <InventoryContext.Provider
      value={{
        products,
        categories,
        wastes,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        unpackBulk,
        recordWaste,
        clearAllWastes,
        getProductPriceUSD,
        getProductPriceVES,
        adjustStock,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) throw new Error('useInventory must be used within an InventoryProvider');
  return context;
};
