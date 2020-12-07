const path = require('path');
const glob = require('glob');
const fse = require('fs-extra');

const COMPONENTS_JSON = 'component-docs.json';

//const firstComponents = Object.entries(components)[0];
const componentsDest = path.resolve(__dirname, './pages/components');
const navDest = path.resolve(__dirname, './components/navigation');

const propTypeGeneratorMapper = {
    string: primitiveGenerator,
    number: primitiveGenerator,
    bool: primitiveGenerator,
    fuc: primitiveGenerator,
    array: primitiveGenerator,
    union: unionGenerator,
    node: primitiveGenerator,
    any: (type, file) => {
        console.warn('\x1b[33m%s\x1b[0m', `Warn: you are using "any" prop type in ${file}. Please avoid using any in your proptypes.`);
        return primitiveGenerator(type);
    },
    func: primitiveGenerator,
    arrayOf: arrayOfGenerator,
    shape: shapeGenerator,
    instanceOf: ({ value }) => value,
    enum: enumGenerator,
    custom: ({ raw }) => raw,
    object: primitiveGenerator
};

function primitiveGenerator({ name }) {
    return name;
}

function enumGenerator({ value }) {
    return value.map(({ value }) => value).join(' &#124; ');
}

function unionGenerator({ value }) {
    return `${value.map(type => propTypeGeneratorMapper[type.name](type)).join(' &#124; ')}`;
}

function arrayOfGenerator({ value }) {
    return `Array of: ${propTypeGeneratorMapper[value.name](value)}`;
}

function shapeGenerator({ value }) {
    const shape = Object.entries(value).reduce((acc, [ name, value ]) => ({
        ...acc,
        [`${name}${value.required ? '*' : ''}`]: propTypeGeneratorMapper[value.name](value)
    }), {});
    return JSON.stringify(shape);
}

function getPropType(propType, file) {
    if (typeof propType === 'string') {
        return propType;
    }

    if (typeof propType === 'object') {
        const { value, name, ...rest } = propType;
        try {
            return `${propTypeGeneratorMapper[propType.name](propType, file)}`;

        } catch (error) {
            console.warn('\x1b[33m%s\x1b[0m', `Warn: Error while generating prop types in ${file}.`);
            console.warn('\x1b[33m%s\x1b[0m', JSON.stringify({ rest, value, name }, null, 2));
        }
    }

    return JSON.stringify(propType);
}

async function generateMD(file, API) {
    const name = file.split('/').pop().replace('.js', '');
    const content = `# ${API.displayName}${API.description ? `
${API.description}` : ''}

${API.props ? `## Props

|name|type|default|description|
|----|----|-------|-----------|
${Object.entries(API.props).map(([ name, value ]) => `|${name}${value.required ? '*' : ''}|${getPropType(value.type, file)}|${value.defaultValue ? value.defaultValue.value : '' || ''}|${value.description ? value.description : ''}|
`).join('')}` : '\n'}

`;
    return fse.writeFile(`${componentsDest}/${name}.md`, content);
}

async function traverseComponents() {
    const components = fse.readJSONSync(path.resolve(__dirname, COMPONENTS_JSON));
    const foo = Object.entries(components);
    const cmds = foo.map(([ name, API ]) => {
        return generateMD(name, API);
    });
    const componentsNav = Object.keys(components).map(key => key.split('/').pop().replace('.js', '')).sort((a, b) => a.localeCompare(b));
    fse.writeJsonSync(`${navDest}/components-navigation.json`, componentsNav);
    return Promise.all(cmds);
}

async function run() {
    try {
        await traverseComponents();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

run();
