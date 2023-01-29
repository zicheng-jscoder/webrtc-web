############################################
#                 构建阶段
############################################
FROM repo.svc.tfsmy:30818/nodejs-pm2-8.16.2-smybase-alpin:v2 as build

WORKDIR /app
COPY . /app

ARG GIT_BRANCH
ARG NPM_IP
ARG NPM_HOST
RUN echo npm set progress=false \
    && echo "${NPM_IP} ${NPM_HOST}" >> /etc/hosts \
    && npm config set sass-binary-site https://npm.taobao.org/mirrors/node-sass \
    && npm i

RUN if [ "$GIT_BRANCH" = "release" ] ; then npm run build:test --force ; fi
RUN if [ "$GIT_BRANCH" = "master" ] ; then npm run build --force ; fi
RUN ls /app

############################################
#        运行时，也即最终的 Image 内容
############################################
FROM repo.svc.tfsmy:30818/nginx-1.17.6-smybase:v1

# 在k8s环境下，将conf文件以configmap形式进行映射，测试docker环境下需要放开
#COPY --from=build /app/_nginx/nginx.conf /etc/nginx/nginx.conf

#COPY --from=build /app/_nginx/* /etc/nginx/

COPY --from=build /app/dist /etc/nginx/html

CMD [ "nginx", "-g", "daemon off;"]