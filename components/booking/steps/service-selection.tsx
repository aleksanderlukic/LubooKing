"use client";

import { Database } from "@/lib/supabase/database.types";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign } from "lucide-react";
import { formatPrice } from "@/lib/utils/booking";

type Service = Database["public"]["Tables"]["services"]["Row"];

interface ServiceSelectionProps {
  services: Service[];
  selectedServiceId?: string;
  onSelect: (serviceId: string) => void;
}

export function ServiceSelection({
  services,
  selectedServiceId,
  onSelect,
}: ServiceSelectionProps) {
  if (services.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">
          No services available for booking at this time.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Select a Service</h3>
      <div className="space-y-3">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onSelect(service.id)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
              selectedServiceId === service.id
                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-2">{service.title}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{service.duration_minutes} minutes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium text-base">
                      {formatPrice(service.price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
