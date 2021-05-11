import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const useNavigation = () => {
    const [ currentId, setCurrentNav ] = useState();
    const { pathname } = useRouter();
    useEffect(() => {
        const idFragment = pathname.replace(/^\//, '').split('/').shift();
        setCurrentNav(idFragment);
    }, [ pathname ]);

    return currentId;
};

export default useNavigation;
