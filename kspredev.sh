#!/bin/bash

#appId 服务名称（唯一）
#branch 部署环境（dev-开发；release-测试；master-生产）
#replicas pod初始集群数量
#dcHost 数据中心域名 区分域名以便上层负载均衡分发不同环境，ks-曙光；hks-华三
#group 分组

appId=$1
branch=$2
replicas=$3
dcHost=$4
group="tfsmy-frontend"


[ -d ./deploy ] && echo "deploy dir exist" || mkdir deploy/{dev,release,master} -p
cat > deploy/${branch}/deploy.yaml << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: vuejs
    component: ${appId}
    release: ${branch}
    tier: frontend
  name: ${appId}
  namespace: ${group}
spec:
  progressDeadlineSeconds: 600
  replicas: ${replicas}
  selector:
    matchLabels:
      app: vuejs
      component: ${appId}
      release: ${branch}
      tier: frontend
  template:
    metadata:
      labels:
        app: vuejs
        component: ${appId}
        release: ${branch}
        tier: frontend
    spec:
      containers:
        - image: $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BUILD_NUMBER
          imagePullPolicy: Always
          name: ${appId}
          readinessProbe:
            tcpSocket:
              port: 80
            timeoutSeconds: 10
            periodSeconds: 10
            successThreshold: 1
            failureThreshold: 3
          ports:
            - name: tcp-80
              containerPort: 80
              protocol: TCP
          resources:
            requests:
              cpu: 10m
              memory: 10Mi
          volumeMounts:
            - name: volume-vuejs
              mountPath: /etc/nginx/nginx.conf
              subPath: nginx.conf
          terminationMessagePath: /dev/termination-log
          terminationMessagePolicy: File
      volumes:
        - name: volume-vuejs
          configMap:
            name: nginx-vue-config
            items:
              - key: nginx.conf
                path: nginx.conf
      restartPolicy: Always
      terminationGracePeriodSeconds: 30
      imagePullSecrets:
        - name: nexushub-id
EOF

cat > deploy/${branch}/deploy-svc.yaml << EOF
apiVersion: v1
kind: Service
metadata:
  labels:
    app: vuejs
    component: ${appId}
    release: ${branch}
    tier: frontend
  name: ${appId}-svc
  namespace: ${group}
spec:
  ports:
    - name: http-80
      port: 80
      protocol: TCP
      targetPort: 80
  selector:
    app: vuejs
    component: ${appId}
    release: ${branch}
    tier: frontend
  type: ClusterIP
  sessionAffinity: ClientIP
  sessionAffinityConfig:
    clientIP:
      timeoutSeconds: 10800
EOF

cat > deploy/${branch}/deploy-ingress.yaml << EOF
kind: Ingress
apiVersion: extensions/v1beta1
metadata:
  name: ${appId}-ingress
  namespace: ${group}
  labels:
    app: vuejs
    component: ${appId}-ingress
    release: ${branch}
    tier: frontend
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/proxy-body-size: 50m
    nginx.ingress.kubernetes.io/proxy-connect-timeout: '600'
    nginx.ingress.kubernetes.io/proxy-read-timeout: '600'
    nginx.ingress.kubernetes.io/proxy-send-timeout: '600'
    nginx.ingress.kubernetes.io/rewrite-target: /\$2
    nginx.ingress.kubernetes.io/use-regex: 'true'
spec:
  rules:
    - host: ${dcHost}
      http:
        paths:
          - path: /${appId}(/|$)(.*)
            backend:
              serviceName: ${appId}-svc
              servicePort: 80
EOF