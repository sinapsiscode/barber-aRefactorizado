import React from 'react';
import { DEMO_CREDENTIALS, AUTH_LABELS } from '../../constants/auth';

const DemoCredentials = ({ onCredentialSelect }) => {
  return (
    <div className="mt-8 p-4 bg-[#000000] rounded-xl border border-[#FFB800]/10">
      <h3 className="text-xs font-semibold text-[#B8B8B8] mb-4 uppercase tracking-wider text-center">
        {AUTH_LABELS.LOGIN.DEMO_TITLE}
      </h3>

      <div className="grid grid-cols-1 gap-2">
        {DEMO_CREDENTIALS.map((demo, index) => (
          <button
            key={index}
            onClick={() => onCredentialSelect(demo.email, demo.password)}
            className="group flex items-center justify-between p-3 bg-gradient-to-r from-[#1A1A1A] to-[#0A0A0A] rounded-lg border border-[#FFB800]/10 hover:border-[#FFB800]/30 transition-all duration-200 hover:shadow-md hover:shadow-[#FFB800]/10"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl" role="img" aria-label={demo.role}>
                {demo.icon}
              </span>
              <div className="text-left">
                <div className="font-semibold text-white text-sm">
                  {demo.role}
                </div>
                <div className="text-[#808080] text-xs">
                  {demo.email}
                </div>
                {demo.description && (
                  <div className="text-[#606060] text-xs mt-1">
                    {demo.description}
                  </div>
                )}
              </div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="text-[#FFB800] text-xs">Usar →</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DemoCredentials;