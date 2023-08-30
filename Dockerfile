################################
#            STEP 1            #
# install dependencies & build #
################################
FROM node:16-alpine AS build


WORKDIR /app

COPY package.json /app/
COPY yarn.lock /app/
COPY tsconfig.json /app/
COPY config /app/config/
COPY src /app/src/
COPY .env /app/


RUN yarn install
RUN yarn build
RUN yarn install --production

################################
#            STEP 2            #
# copy compiled files and run  #
################################
FROM alpine:3
RUN apk add nodejs --no-cache
WORKDIR /app

COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/build /app/
COPY --from=build /app/package.json /app/


# ENV VARIABLES
ENV NODE_ENV=production
ENV PORT=5000

##ENV CONNECTION_TYPE=localfile
##ENV CONNECTION_STRING=/app/src/service/task/tasks.json
ENV CONNECTION_TYPE=mongo
ENV CONNECTION_STRING=mongodb://localhost:27017


EXPOSE 5000
CMD node src/index.js
