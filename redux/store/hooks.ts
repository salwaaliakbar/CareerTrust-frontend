import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * Pre-typed useDispatch hook
 * Use throughout your app instead of plain `useDispatch`
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Pre-typed useSelector hook
 * Use throughout your app instead of plain `useSelector`
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
