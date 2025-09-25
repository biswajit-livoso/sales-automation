import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Vendor, Visit, VisitPaymentInfo, VisitOrderItem } from '../types';
import { useAuth } from './authContext';

interface VisitContextType {
  vendors: Vendor[];
  visits: Visit[];
  createVisit: (vendorId: string, topic: string) => Visit;
  closeVisit: (
    visitId: string,
    payload: { discussionSummary: string; payment?: VisitPaymentInfo; order?: VisitOrderItem[] },
  ) => void;
  updateVisit: (
    visitId: string,
    payload: { discussionSummary?: string; payment?: VisitPaymentInfo; order?: VisitOrderItem[] },
  ) => void;
  addVendor: (input: Omit<Vendor, 'id'> & Partial<Pick<Vendor, 'id'>>) => Vendor;
  updateVendor: (vendorId: string, updates: Partial<Omit<Vendor, 'id'>>) => void;
}

const VisitContext = createContext<VisitContextType | undefined>(undefined);

const VENDORS_KEY = 'vendors';
const VISITS_KEY = 'visits';

const defaultVendors: Vendor[] = [
  { id: 'v1', name: 'Acme Supplies', contactName: 'Rita Patel', phone: '999-111-2222', email: 'rita@acme.com' },
  { id: 'v2', name: 'Global Traders', contactName: 'Vikram Rao', phone: '999-333-4444', email: 'vikram@global.com' },
  { id: 'v3', name: 'Sunrise Distributors', contactName: 'Neha Gupta', phone: '999-555-6666', email: 'neha@sunrise.com' },
];

export const VisitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  // Simple unique ID generator to avoid external dependency
  const generateId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const saved = localStorage.getItem(VENDORS_KEY);
    if (saved) return JSON.parse(saved) as Vendor[];
    localStorage.setItem(VENDORS_KEY, JSON.stringify(defaultVendors));
    return defaultVendors;
  });
  const [visits, setVisits] = useState<Visit[]>(() => {
    const saved = localStorage.getItem(VISITS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(VISITS_KEY, JSON.stringify(visits));
  }, [visits]);

  // persist vendors
  useEffect(() => {
    localStorage.setItem(VENDORS_KEY, JSON.stringify(vendors));
  }, [vendors]);

  // One-time migration: ensure all existing visits have a unique id
  useEffect(() => {
    setVisits(prev => {
      let changed = false;
      const updated = prev.map(v => {
        if (!v.id) {
          changed = true;
          return { ...v, id: generateId() };
        }
        return v;
      });
      if (changed) {
        localStorage.setItem(VISITS_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const createVisit = (vendorId: string, topic: string): Visit => {
    if (!user) throw new Error('Must be logged in to create a visit');
    const newVisit: Visit = {
      id: generateId(),
      vendorId,
      createdBy: user.id,
      topic,
      createdAt: new Date().toISOString(),
      status: 'open',
      startedAt: new Date().toISOString(),
    };
    setVisits(prev => [newVisit, ...prev]);
    return newVisit;
  };

  const closeVisit = (
    visitId: string,
    payload: { discussionSummary: string; payment?: VisitPaymentInfo; order?: VisitOrderItem[] },
  ) => {
    setVisits(prev =>
      prev.map(v =>
        v.id === visitId
          ? {
              ...v,
              status: 'closed',
              closedAt: new Date().toISOString(),
              discussionSummary: payload.discussionSummary,
              payment: payload.payment,
              ...(payload.order ? ({ order: payload.order } as any) : {}),
            }
          : v,
      ),
    );
  };

  const updateVisit = (
    visitId: string,
    payload: { discussionSummary?: string; payment?: VisitPaymentInfo; order?: VisitOrderItem[] },
  ) => {
    setVisits(prev =>
      prev.map(v =>
        v.id === visitId
          ? {
              ...v,
              ...(payload.discussionSummary !== undefined && { discussionSummary: payload.discussionSummary }),
              ...(payload.payment !== undefined && { payment: payload.payment }),
              ...(payload.order !== undefined && ({ order: payload.order } as any)),
            }
          : v,
      ),
    );
  };

  const addVendor: VisitContextType['addVendor'] = (input) => {
    const id = input.id || generateId();
    const vendor: Vendor = {
      id,
      name: input.name,
      contactName: input.contactName,
      phone: input.phone,
      email: input.email,
      address: input.address,
    };
    setVendors(prev => [vendor, ...prev]);
    return vendor;
  };

  const updateVendor: VisitContextType['updateVendor'] = (vendorId, updates) => {
    setVendors(prev => prev.map(v => (v.id === vendorId ? { ...v, ...updates } : v)));
  };

  const value = useMemo(
    () => ({ vendors, visits, createVisit, closeVisit, updateVisit, addVendor, updateVendor }),
    [vendors, visits],
  );

  return <VisitContext.Provider value={value}>{children}</VisitContext.Provider>;
};

export const useVisits = () => {
  const ctx = useContext(VisitContext);
  if (!ctx) throw new Error('useVisits must be used within a VisitProvider');
  return ctx;
};
