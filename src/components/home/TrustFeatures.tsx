import React from 'react';
import { Truck, ShieldCheck, CheckCircle2, Headphones } from 'lucide-react';

export const TrustFeatures: React.FC = () => {
  const features = [
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Fast and reliable delivery across Pakistan via TCS & Leopard Express.',
      highlight: '1-3 Business Days',
      color: 'text-cyan-600 bg-cyan-50',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Shopping',
      description: 'Safe and secure shopping experience with verified IBFT, JazzCash & COD.',
      highlight: 'Verified & Encrypted',
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      icon: CheckCircle2,
      title: 'Quality Products',
      description: 'Carefully selected technology products with official PTA approval & brand warranty.',
      highlight: '100% Genuine Guaranteed',
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      icon: Headphones,
      title: 'Customer Support',
      description: 'Helpful customer support whenever you need it via WhatsApp & helpline.',
      highlight: 'Prompt 7 Days/Week',
      color: 'text-amber-600 bg-amber-50',
    },
  ];

  return (
    <section className="relative -mt-8 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-md hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className={`h-11 w-11 rounded-xl ${feature.color} flex items-center justify-center mb-3.5`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm tracking-tight mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  {feature.description}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center text-[11px] font-semibold text-slate-700">
                <span>{feature.highlight}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
