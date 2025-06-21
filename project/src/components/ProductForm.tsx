import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { ProductVariation, Product } from '../types';

interface ProductFormProps {
  onSubmit: (product: {
    name: string;
    price: number;
    variations: ProductVariation[];
  }) => void;
  editingProduct?: Product | null;
  onCancelEdit?: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ 
  onSubmit, 
  editingProduct, 
  onCancelEdit 
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [variations, setVariations] = useState<ProductVariation[]>([
    { id: '1', name: 'Padrão', stock: 0 }
  ]);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setPrice(editingProduct.price);
      setVariations(editingProduct.variations);
    }
  }, [editingProduct]);

  const resetForm = () => {
    setName('');
    setPrice(0);
    setVariations([{ id: Date.now().toString(), name: 'Padrão', stock: 0 }]);
  };

  const addVariation = () => {
    const newVariation: ProductVariation = {
      id: Date.now().toString(),
      name: '',
      stock: 0
    };
    setVariations([...variations, newVariation]);
  };

  const removeVariation = (id: string) => {
    if (variations.length > 1) {
      setVariations(variations.filter(v => v.id !== id));
    }
  };

  const updateVariation = (id: string, field: keyof ProductVariation, value: string | number) => {
    setVariations(variations.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && variations.every(v => v.name && v.stock >= 0)) {
      onSubmit({ name, price, variations });
      if (!editingProduct) {
        resetForm();
      } else {
        onCancelEdit?.();
      }
    }
  };

  const handleCancel = () => {
    resetForm();
    onCancelEdit?.();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {editingProduct ? 'Editar Produto' : 'Cadastrar Produto'}
        </h2>
        {editingProduct && (
          <button
            onClick={handleCancel}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Produto
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preço Base (R$)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Variações
            </label>
            <button
              type="button"
              onClick={addVariation}
              className="inline-flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Adicionar
            </button>
          </div>

          <div className="space-y-3">
            {variations.map((variation, index) => (
              <div key={variation.id} className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">Nome da Variação</label>
                  <input
                    type="text"
                    value={variation.name}
                    onChange={(e) => updateVariation(variation.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Tamanho P, Cor Azul"
                    required
                  />
                </div>
                
                <div className="w-24">
                  <label className="block text-xs text-gray-600 mb-1">Estoque</label>
                  <input
                    type="number"
                    min="0"
                    value={variation.stock}
                    onChange={(e) => updateVariation(variation.id, 'stock', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {variations.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariation(variation.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          {editingProduct && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {editingProduct ? 'Atualizar' : 'Salvar'} Produto
          </button>
        </div>
      </form>
    </div>
  );
};