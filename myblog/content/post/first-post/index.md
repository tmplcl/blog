+++ author = "Timur Philip Cöl"
title = "Deploy containers to ECS Fargate using CDK"
date = "2021-09-05"
description = "A short tutorial on deploying Spring Boot applications to AWS ECS using the ApplicationLoadBalancedFargateService CDK construct"
categories = [
"cloud",
"aws",
"java",
"spring",
"cdk"
]
tags = [
"cloud",
"aws",
"spring",
"cdk",
"ecs"
]
image = "rack.jpg"
+++

In this blog post I will show you how you can easily deploy containers to AWS ECS. You can check out the code used in this blog post [on GitHub](https://github.com/tmplcl/Spring-Boot-ECS-Fargate).

ECS is a container plattform on AWS that can run containers either using standard EC2 Instances or as a managed service
using Fargate. Compared to something like Kubernetes you can get up and running very quickly on ECS.


## Building the Spring Boot application

To start of we do need to build a container that can serve HTTP traffic. For this example I use a small Spring Boot
application, but you can use every other HTTP backend as well.

Our application will serve some simple hello world text on the `HOST:PORT/hello` path:

```java

@SpringBootApplication
public class HelloApplication {

    public static void main(String[] args) {
        SpringApplication.run(HelloApplication.class, args);
    }

    @RestController
    static class HelloController {
        @GetMapping("/hello")
        public String getHello() {
            return "Hello World!";
        }
    }
}
```

Now lets build this application using maven with `mvn package`. The built artifact will be available under the `target/`
directory.

## Creating the container image

Before we start with the CDK part lets also create a `Dockerfile` that describes how our spring application will
be packaged into a container.

This dockerfile uses the standard jdk16 base image based on alpine linux and simply copies our `.jar` artifact into the
container.

```dockerfile
FROM openjdk:16-jdk-alpine
ARG JAR_FILE=target/*.jar

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

If everything is correct you can test the container build using Docker `docker build . -t helloapp` and 
run the container with `docker run helloapp -p 8080:8080`.

## Building the infrastructure with CDK

Now lets move over to the CDK part. Since I like to separate infrastructure code from application code I create the CDK
project in a different directory. 


Usually it looks something like this:

```yaml
hello/          # Repository root
hello/infra     # CDK project containing our infrastructure
hello/service   # Our actual service
```

Once in the directory you can bootstrap the CDK project with the cli using `cdk init app --language java`. In this blog
post I am using Java as well for the infrastructure part since I want to keep the programming language similar if possible. Though most CDK
projects do use TypeScript or Python.

**Adding the needed dependencies**

CDK separates its constructs in different libraries. For our example we need to add `ec2`, `ecs` and `ecs-patterns`. In the `pom.xml` we simply
add the following dependencies.

```xml
<dependency>
    <groupId>software.amazon.awscdk</groupId>
    <artifactId>ec2</artifactId>
    <version>${cdk.version}</version>
</dependency>
<dependency>
    <groupId>software.amazon.awscdk</groupId>
    <artifactId>ecs</artifactId>
    <version>${cdk.version}</version>
</dependency>
<dependency>
    <groupId>software.amazon.awscdk</groupId>
    <artifactId>ecs-patterns</artifactId>
    <version>${cdk.version}</version>
</dependency>
```

Now to build our stack we set up a new VPC and ECS Cluster. The sweet part happens under the ApplicationLoadBalancedFargateService.
It is a 2nd level construct by AWS that lets us avoid a lot of cumbersome configuration compared to the 1st level CloudFormation constructs.


In this expample we create a single running container in our private subnet that gets exposed on the internet with an ApplicationLoadBalancer.

```java
public HelloInfraStack(final Construct parent, final String id, final StackProps props) {
    super(parent, id, props);

    // ECS needs a VPC to run inside
    Vpc vpc = Vpc.Builder.create(this, "HelloVpc")
            .maxAzs(3)
            .build();

    // Our ECS cluster. Can be fine tuned further
    Cluster cluster = Cluster.Builder.create(this, "HelloCluster")
            .vpc(vpc).build();

    // The actual container definition.
    // Here we define the container resources and image
    ApplicationLoadBalancedFargateService fargateService = ApplicationLoadBalancedFargateService.Builder.create(this, "HelloFargateService")
            .cluster(cluster)
            .cpu(256)
            .desiredCount(1)
            .taskImageOptions(
                // This lets CDK build a container during deployment. We can simply point to a directory with a dockerfile inside.
                    ApplicationLoadBalancedTaskImageOptions.builder()
                            .image(ContainerImage.fromAsset("../hello-service"))
                            .containerPort(8080)
                            .build())
            .memoryLimitMiB(512)
            .openListener(true)
                // We want to expose our cotainer using an ALB
            .publicLoadBalancer(true)
            .build();
    
    // Configure the ALB health checks
    fargateService.getTargetGroup().configureHealthCheck(HealthCheck.builder()
            .healthyHttpCodes("200")
            .path("/hello")
            .build());

}
```

Now to deploy our infastructure we go to the commandline and execute `cdk deploy`.

After some waiting we should see the stack outputs on the commandline. The stack output does contain the uri to our ApplicationLoadBalancer. For my stack i got the following output:

```properties
Outputs:
HelloInfraStack.HelloFargateServiceLoadBalancerDNS98570353 = Hello-Hello-YMYEY4EYNOWB-460997296.eu-central-1.elb.amazonaws.com
HelloInfraStack.HelloFargateServiceServiceURL3049AAE5 = http://Hello-Hello-YMYEY4EYNOWB-460997296.eu-central-1.elb.amazonaws.com
```

So when I try to send a HTTP request to the endpoint I should get the hello world text served by our container.

```shell
❯ curl -v Hello-Hello-YMYEY4EYNOWB-460997296.eu-central-1.elb.amazonaws.com/hello
*   Trying 52.28.236.87...
* TCP_NODELAY set
* Connected to Hello-Hello-YMYEY4EYNOWB-460997296.eu-central-1.elb.amazonaws.com (52.28.236.87) port 80 (#0)
> GET /hello HTTP/1.1
> Host: Hello-Hello-YMYEY4EYNOWB-460997296.eu-central-1.elb.amazonaws.com
> User-Agent: curl/7.64.1
> Accept: */*
>
< HTTP/1.1 200
< Date: Sun, 05 Sep 2021 09:44:54 GMT
< Content-Type: text/plain;charset=UTF-8
< Content-Length: 12
< Connection: keep-alive
<
* Connection #0 to host Hello-Hello-YMYEY4EYNOWB-460997296.eu-central-1.elb.amazonaws.com left intact
Hello World!* Closing connection 0
```

So it works! 

As you probably noticed, this endpoint is only availabe over HTTP without encryption. We will add TLS encryption in a later step.

Cheers


Timur