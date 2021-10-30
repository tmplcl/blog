+++ author = "Timur Philip Cöl"
title = "AWS Certified Solutions Architect – Associate - Cheat Sheet"
date = "2021-09-05"
description = "My notes as preparation for the SAA-C02 exam"
categories = [
"cloud",
"aws",
"certificates"
]
tags = [
"cloud",
"aws"
]
image = "cert.png"
+++

### IAM

### S3

### EC2

#### Spot Instances

So what happens to all the instances that are reserved by customers but not used. Smart as AWS is they sell this capacity to different customers under the premise that they can terminate this instance with a two minute warning.

These type of instances are called spot instances. Depending on the current capacity in the region these instances can be used for a much cheaper price (up to 90 percent) the so called **spot price** that moves up and down.

If you want to use these instances you can issue a maximum price that you want to pay. As long as the current spot price is under your maximum price your instances will be provisioned. If it's above they wont. 

Since your instances can be terminated with a notice of two minutes the best use cases are stateless workloads like big data, social media, web apis and so on. You should definitely not use these instances for your databases.

## AWS Service Overview

### Analytics

**Amazon Athena**

Query your Data inside S3.

**Amazon Elasticsearch Service**

Just a managed ElasticSearch cluster. Rebranded to OpenSearch in recent open source drama.

**Amazon EMR (Elastic Map Reduce)**

Big data service. Runs Spark, Hive and Presto workloads.

**AWS Glue**

Serverless ETL solution.

**Amazon Kinesis**

Service for data stream processing. Amazon's proprietary alternative to Apache Kafka.

**Amazon QuickSight**

Serverless BI solution. Lets you create fancy dashboards.

### AWS Billing and Cost Management

**AWS Budgets**

Create budgets and forecasted costs for your AWS resources. Here you can set up alarms to inform you if the costs are exceeding your threshold.

**Cost Explorer**

Visualize and analyze your costs over time.

### Application Integration

**SNS (Amazon Simple Notification Service)**

Serverless topics. Push events to subscribers.

**SQS (Amazon Simple Queue Service)**

Serverless Message Queues. Consumers poll events from a queue.

### Compute

**EC2 (Elastic Compute Cloud)**

Bread and butter of AWS. Runs virtual machines.

**Elastic Beanstalk**

Magic stuff that you throw code at and somehow it tries to figure out how to run it. Alternative to Heroku.

**ECS (Elastic Container Service)**

Basic platform to run your containers on. Serverless with Fargate or on top of EC2.

**EKS (Elastic Kubernetes Service)**

Managed Kubernetes platform.

**ELB (Elastic Load Balancing)**

Application (L7) and Network (L4) load balancing.

**AWS Fargate**

Run your ECS or EKS workload without worrying about EC2 instances because AWS will hide them from you.

**AWS Lambda**

Serverless PaaS that runs your code always triggered by an event source.

### Database

**Amazon Aurora**

AWS own scalable and HA RDS solution with compatibility to postgresql and mysql. Also available as serverless option.

**Amazon DynamoDB**

HA NoSQL database with almost unlimited scaling as long as you can pay them ;). Only as serverless solution.

**ElastiCache**

Managed Redis or Memcached.

**RDS**

Run managed relational databases like Postgres, MySQL, Oracle, MariaDB, SQLServer.

**Amazon Redshift**

Data warehouse and data lake solution.


**AWS Auto Scaling**

AWS own smart solution to scale EC2 instances, ECS tasks, DynamoDB tables and Aurora replicas.

**AWS Backup**

Centralize and automate backups across multiple AWS services like EC2, EBS, RDS ..

**CloudFormation**

Managed IaaC service to provision your AWS resources.

**AWS CloudTrail**

Monitor and log all AWS API calls and actions on your account.

**CloudWatch**

Managed service for monitoring your resources. Contains metrics, logs and tracing.

**AWS Config**

Audit and evaluate the configurations of your AWs resources. Good for compliance stuff.

**Amazon EventBride (ex. CloudWatch Events)**

Schedule events like cron jobs. Integrate event sources with targets that can be AWS services or your own applications.

**AWS Organization**

If your business requires several AWS accounts. Let's you create hierarchies. Allow or deny specific AWS services.

**AWS Resource Access Manager**

Share resources across AWS accounts.

**AWS Systems Manager**

Mostly for operating EC2 instances. A lot of stuff runs inside here like: Parameter store, Session manager, patching, compliance checks.

**AWS Trusted Advisor**

Recommendations and checks that evaluate your account. Can be enhanced by buying a better support plan.

### Migration and Transfer

**AWS DMS (Database Migration Service)**

Migrate databases from on premise to RDS, DynamoDB, RedShift. Includes an schema conversion tool.

**AWS DataSync**

Move data (NSF /SMB) to S3 and EFS. Runs with an agent. Typically from on-premise data center.

**AWs Migration Hub**

Cheers
Timur
### Management and Governance