import plugins from './plugins';
import config from './config';

export default (configuration) => ({
    plugins: plugins(configuration),
    config: config(configuration)
})
