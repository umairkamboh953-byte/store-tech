import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

interface AccessDeniedProps {
  onGoToLogin?: () => void;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({ onGoToLogin }) => {
  const { navigateTo } = useStore();

  return (
    <div className="bg-slate-950 min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
        <div className="h-16 w-16 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 mx-auto flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
            Security Exception
          </span>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Access Denied — Admin authorization required.
          </h1>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            This protected zone requires authenticated staff credentials with verified administrative privileges. Normal customer sessions cannot access internal store management.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={() => {
              if (onGoToLogin) {
                onGoToLogin();
              } else {
                navigateTo('admin');
              }
            }}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Go to Admin Authentication Login</span>
          </button>

          <button
            onClick={() => navigateTo('home')}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Customer Store Front</span>
          </button>
        </div>
      </div>
    </div>
  );
};
