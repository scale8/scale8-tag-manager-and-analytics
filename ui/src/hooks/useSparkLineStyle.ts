import { useMemo } from 'react';

export const useSparkLineStyle = (): { fill: 'none' } => useMemo(() => ({ fill: 'none' }), []);
