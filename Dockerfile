# ----------------------------------- base ----------------------------------- #
FROM node:16 as base

ENV WORKDIR=/usr/home
WORKDIR ${WORKDIR}

RUN mkdir -p modules

COPY ./package.json ./
COPY ./tsconfig.json ./
COPY ./yarn.lock ./
COPY ./lerna.json ./

# --------------------------------- module-a --------------------------------- #

FROM base as module-a

# copy referenced module
COPY ./modules/core ./modules/core

# copy the module itself
COPY ./modules/module-a ./modules/module-a

RUN yarn install --prod

CMD [ "yarn", "test" ]

# --------------------------------- module-b --------------------------------- #

FROM base as module-b

# copy referenced module
COPY ./modules/core ./modules/core

# copy the module itself
COPY ./modules/module-b ./modules/module-b

RUN yarn install --prod

CMD [ "yarn", "test" ]
