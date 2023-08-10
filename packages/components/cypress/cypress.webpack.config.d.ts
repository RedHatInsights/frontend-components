import MiniCssExtractPlugin = require("mini-css-extract-plugin");
export namespace module {
    const rules: ({
        test: RegExp;
        exclude: RegExp;
        use: {
            loader: string;
            options: {
                jsc: {
                    parser: {
                        syntax: string;
                        tsx: boolean;
                    };
                };
            };
        };
        type?: undefined;
    } | {
        test: RegExp;
        use: (string | {
            loader: string;
            options: {
                join: any;
                sourceMap?: undefined;
            };
        } | {
            loader: string;
            options: {
                sourceMap: boolean;
                join?: undefined;
            };
        })[];
        exclude?: undefined;
        type?: undefined;
    } | {
        test: RegExp;
        type: string;
        exclude?: undefined;
        use?: undefined;
    })[];
}
export namespace resolve {
    const extensions: string[];
    const alias: {};
}
export namespace output {
    const filename: string;
    const hashFunction: string;
    const path: string;
}
export namespace cache {
    const type: string;
    namespace buildDependencies {
        const config: string[];
    }
    const cacheDirectory: string;
}
export namespace stats {
    const errorDetails: boolean;
}
export const plugins: MiniCssExtractPlugin[];
