FROM registry.access.redhat.com/ubi8/nodejs-16
USER root
WORKDIR /docs
COPY ./packages /docs/packages
COPY ./tsconfig.json /docs/tsconfig.json
WORKDIR /docs/packages/docs
RUN npm i
RUN npm run build
RUN npm i puppeteer

# install puppeteer/chromium dependencies
RUN dnf install -y bzip2 fontconfig nss.x86_64 pango.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 libXScrnSaver.x86_64 libXrandr.x86_64 GConf2.x86_64 alsa-lib.x86_64 atk.x86_64 gtk3.x86_64 libdrm libgbm libxshmfence GConf2 nss libXScrnSaver alsa-lib wget

EXPOSE 3000
USER 1001
CMD node server.js
