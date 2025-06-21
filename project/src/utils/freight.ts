export const calculateFreight = (subtotal: number): number => {
  if (subtotal >= 200) {
    return 0; // Free shipping
  } else if (subtotal >= 52 && subtotal <= 166.59) {
    return 15;
  } else {
    return 20;
  }
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
};