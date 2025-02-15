import { useEffect } from 'react';

export const useExample = () => {
    useEffect(() => {
        console.log('TEST');
    }, []);
};
