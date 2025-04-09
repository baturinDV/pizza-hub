'use client'
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

interface IngredientSelectProps {
  name: string;
  items: { id: string; name: string }[];
}

export const FormIngredientsSelect: React.FC<IngredientSelectProps> = ({ name, items }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="font-medium">Выберите ингредиенты:</p>
            <button
              type="button"
              onClick={() => field.onChange([])}
              className="text-red-500 text-sm hover:underline"
            >
              Очистить все
            </button>
          </div>
          
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={item.id}
                checked={field.value?.includes(item.id) || false}
                onChange={(e) => {
                  const currentValue = field.value || [];
                  const newValue = e.target.checked
                    ? [...currentValue, item.id]
                    : currentValue.filter((id: string) => id !== item.id);
                  field.onChange(newValue);
                }}
              />
              <label>{item.name}</label>
            </div>
          ))}
        </div>
      )}
    />
  );
};
