"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import { BookingData } from "../booking-widget";

interface CustomerDetailsProps {
  travelEnabled: boolean;
  data: Partial<BookingData>;
  onSubmit: (data: Partial<BookingData>) => void;
  onBack: () => void;
}

export function CustomerDetails({
  travelEnabled,
  data,
  onSubmit,
  onBack,
}: CustomerDetailsProps) {
  const [formData, setFormData] = useState({
    customerName: data.customerName || "",
    customerEmail: data.customerEmail || "",
    customerPhone: data.customerPhone || "",
    locationType: data.locationType || ("in-shop" as "in-shop" | "home-visit"),
    customerAddress: data.customerAddress || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName || formData.customerName.length < 2) {
      newErrors.customerName = "Name must be at least 2 characters";
    }

    if (
      !formData.customerEmail ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)
    ) {
      newErrors.customerEmail = "Invalid email address";
    }

    if (!formData.customerPhone || formData.customerPhone.length < 10) {
      newErrors.customerPhone = "Phone number must be at least 10 digits";
    }

    if (formData.locationType === "home-visit" && !formData.customerAddress) {
      newErrors.customerAddress = "Address is required for home visits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-4 mb-4">
        <Button type="button" variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-xl font-bold">Your Details</h3>
      </div>

      <div className="space-y-4">
        <Input
          label="Full Name"
          value={formData.customerName}
          onChange={(e) =>
            setFormData({ ...formData, customerName: e.target.value })
          }
          error={errors.customerName}
          required
        />

        <Input
          label="Email"
          type="email"
          value={formData.customerEmail}
          onChange={(e) =>
            setFormData({ ...formData, customerEmail: e.target.value })
          }
          error={errors.customerEmail}
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          value={formData.customerPhone}
          onChange={(e) =>
            setFormData({ ...formData, customerPhone: e.target.value })
          }
          error={errors.customerPhone}
          required
        />

        {travelEnabled && (
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <input
                  type="radio"
                  name="locationType"
                  value="in-shop"
                  checked={formData.locationType === "in-shop"}
                  onChange={(e) =>
                    setFormData({ ...formData, locationType: "in-shop" })
                  }
                />
                <span>In-shop</span>
              </label>
              <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <input
                  type="radio"
                  name="locationType"
                  value="home-visit"
                  checked={formData.locationType === "home-visit"}
                  onChange={(e) =>
                    setFormData({ ...formData, locationType: "home-visit" })
                  }
                />
                <span>Barber comes to me</span>
              </label>
            </div>
          </div>
        )}

        {formData.locationType === "home-visit" && (
          <Input
            label="Your Address"
            value={formData.customerAddress}
            onChange={(e) =>
              setFormData({ ...formData, customerAddress: e.target.value })
            }
            error={errors.customerAddress}
            placeholder="Enter your full address"
            required
          />
        )}

        <Button type="submit" className="w-full">
          Continue to Payment
        </Button>
      </div>
    </form>
  );
}
