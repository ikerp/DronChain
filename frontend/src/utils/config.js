import { useEffect, useRef } from 'react';

// Identificadores del tipo de usuario
export const PROPIETARIO = 'propietario';
export const EMPRESA = 'empresa';
export const ANONIMO = 'anonimo';
export const SIN_METAMASK = 'sin metamask';

// Lista de pesticidas disponibles
export const PESTICIDAS = {
    '1' : 'Pesticida A',
    '2' : 'Pesticida B',
    '3' : 'Pesticida C',
    '4' : 'Pesticida D',
    '5' : 'Pesticida E'
}

// Funcion para guardar el estado previo de un Hook
export function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
}