# Frontend components config utilities

# 4.0.x -> 4.1.x

The proxy configuration is now using data from the Frontend CRD. The Frontend CRD is now mandatory to use the development proxy.

The default location of the CRD is **deploy/frontend.yaml**. If the CRD is not located at this path in your frontend repository, please use the `frontendCRDPath` as an attribute of the proxy function if you are using custom webpack configuration.
