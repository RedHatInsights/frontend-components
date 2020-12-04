# ConditionalFilter

## Props

|name|type|default|description|
|----|----|-------|-----------|
|hideLabel|`bool`|false||
|items|{
  "name": "arrayOf",
  "value": {
    "name": "shape",
    "value": {
      "id": {
        "name": "string",
        "required": false
      },
      "label": {
        "name": "node",
        "required": false
      },
      "value": {
        "name": "string",
        "required": false
      },
      "type": {
        "name": "enum",
        "computed": true,
        "value": "Object.values(conditionalFilterType)",
        "required": false
      },
      "filterValues": {
        "name": "union",
        "value": [
          {
            "name": "shape",
            "value": {
              "value": {
                "name": "string",
                "required": false
              },
              "placeholder": {
                "name": "string",
                "required": false
              },
              "onChange": {
                "name": "func",
                "required": false
              }
            }
          },
          {
            "name": "shape",
            "value": {
              "value": {
                "name": "union",
                "value": [
                  {
                    "name": "string"
                  },
                  {
                    "name": "arrayOf",
                    "value": {
                      "name": "union",
                      "value": [
                        {
                          "name": "string"
                        },
                        {
                          "name": "shape",
                          "value": {
                            "label": {
                              "name": "node",
                              "required": false
                            },
                            "value": {
                              "name": "string",
                              "required": false
                            }
                          }
                        }
                      ]
                    }
                  },
                  {
                    "name": "shape",
                    "value": {}
                  }
                ],
                "required": false
              },
              "items": {
                "name": "arrayOf",
                "value": {
                  "name": "shape",
                  "value": {
                    "label": {
                      "name": "node",
                      "required": false
                    },
                    "value": {
                      "name": "string",
                      "required": false
                    }
                  }
                },
                "required": false
              }
            }
          }
        ],
        "required": false
      }
    }
  }
}|[]||
|value|`string`|''||
|placeholder|`string`|||
|onChange|`func`|||
|isDisabled|`bool`|false||
|id|undefined|'default-input'||


