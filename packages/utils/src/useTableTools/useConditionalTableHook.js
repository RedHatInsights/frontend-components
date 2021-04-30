const useConditionalTableHook = (condition, hook, options) => {
    if (condition) {
        return hook(options);
    } else {
        return { };
    }
};

export default useConditionalTableHook;
