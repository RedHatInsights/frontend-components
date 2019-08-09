module.exports = {
    "presets": [
        [
            "@babel/env",
            {
                "targets": "> 0.25%, not dead"
            }
        ],
        "@babel/react",
    ],
    "plugins": [
        [
            "@babel/plugin-proposal-decorators",
            {
                "legacy": true
            }
        ],
        "@babel/plugin-transform-runtime",
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-proposal-object-rest-spread",
        "babel-plugin-lodash",
        "@babel/plugin-transform-react-display-name",
        "@babel/plugin-proposal-class-properties",
        [
            "react-intl",
            {
                "messagesDir": "./build/messages/"
            }
        ]
    ],
    "ignore": [
        "node_modules"
    ]
}
