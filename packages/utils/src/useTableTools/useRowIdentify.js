export const useRowIdentify = (options = {}) => {
    const getIdProp = (item, idProp = 'id') => (item[idProp]);
    const identifier = options?.identifier || getIdProp;

    const identify = (item) => {
        if (typeof identifier === 'string') {
            return {
                ...item,
                itemId: getIdProp(item, identifier)
            };
        } else {
            return {
                ...item,
                itemId: identifier(item)
            };
        }
    };

    return (items) => (
        items.map(identify)
    );
};

export default useRowIdentify;
