import { useEffect, useRef, useState } from 'react';

import getVariant from './getVariant';

const useScreen = () => {
    const [ variant, setVariant ] = useState(() => getVariant());
    const prev = useRef(variant);

    useEffect(() => {
        function handleResize() {
            const newVariant = getVariant();
            if (newVariant !== prev.current) {
                prev.current = newVariant;
                setVariant(newVariant);
            }
        }

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return variant;
};

export default useScreen;
