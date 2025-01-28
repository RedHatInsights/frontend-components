# Frontend components config migrations

## 6.3.x -> 6.4.x

The configuration is now using data from the Frontend CRD. The Frontend CRD is now mandatory to use the shared build configuration.

The default location of the CRD is **deploy/frontend.yaml**. If the CRD is not located at this path in your frontend repository, please use the `frontendCRDPath` configuration option in the `fec.config.js` or as an attribute of the create config function if you are using custom webpack configuration.
