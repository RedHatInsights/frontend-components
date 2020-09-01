const filterTypes = (type) => type.schema?.authentication && type.schema?.endpoint;

export default filterTypes;
