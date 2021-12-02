+++ author = "Timur Philip Cöl"
title = "My thoughts on AWS exams"
date = "2021-12-01"
description = "My thoughts after passing the AWS Certified Solutions Architect – Associate exam"
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

After working almost two years with AWS i decided that it's finally time to do the Solution Architect exam. To be honest, i wanted to clear it way earlier but i guess the everyday laziness and my dislike for exams in general kicked in.

*So what is the exam about?*

It covers a wide range of AWS Services. You have to know how they work together and what service to use in which situation.
The questions always have multiple choice style answers bringing you into a scenario where customers come to you as a Solutions Architect with a question or problem in their current cloud or on premise setup.

The trick is to look out for common keywords like 'most cost efficient solution', 'highly available', 'near real time'.
Acknowledging these you can always rule out most answers. But in the end you still have to do the hard work and understand a bunch of specific AWS services.

*How did i prepare?*

Usually it is just not enough working with AWS for some time. Your everyday work probably does not cover all exam topics like for example hybrid cloud setups with *Storage Gateway*.

While my work place gave me a free subscription for *A Cloud Guru* i still decided to buy the [SAA-C02 course from Adrian Cantrill](https://learn.cantrill.io/). Beyond just knowing AWS stuff you do have to be good at actually clearing the exam. The exam questions are usually worded pretty weird so for getting used to this stuff i bought the practice exams from Jon Bonso at Tutorials Dojo.

All in all once you are getting comfortable doing the practice exams with a score greater than 80 percent you should be ready to take the real exam.

Cheers
Timur


PS: I decided to write down some of my quick notes for the exam preparation in markdown. I will include them here under this blog post.
### IAM

- Global service
- access key id only for programmatic access
- MFA must be set by each user
- Identities: Users, Groups, Roles

### S3

- Object storage with unlimited amount of data capacity
- Default replicated across 3 AZ, 99.99% Availability, 11' 9s durability
- Objects from 0 Bytes to 5 TB
- Bucket names are unique across all AWS accounts
- Lifecycle Management
  - Delete or move objects to different class
- Versioning
  - Deleting restores old version
- MultiFactor Auth Delete
- Private buckets by default
- Logging of operations on objects can be turned on
- Bucket policies
  - JSON Doc for complex access.
  - Applies to whole bucket
- Bucket ACL
  - For specific objects

- Path-Style URLs (such as https://s3.Region.amazonaws.com/bucket-name/key name) are supported by AWS.
- Virtual-host-style URLs (such as: https://bucket-name.s3.Region.amazonaws.com/key name) are supported by AWS.

#### Storage Classes

- Standard
- Intelligent Tiering
- Standard IA: 30 days charge - Retrieval fee - No latency
- One-Zone IA: Same durability - Less availability
- Glacier: 90 days charge - mins to hours latency
- Glacier Deep Archive: 180 days charge - hours latency

### VPC

- VPC tenancy can be default or dedicated (can be changed)

#### VPC Endpoints

- Access AWS services without going through the internet.
- Interface Endpoint
  - Costs
  - Use an ENI with IP
- Gateway Endpoint
  - Route target
  - Only DynamoDB and S3

#### VPC Flow logs

- In and out traffic
- VPC / Subnet / ENI level
- Only IPs

#### NACL

- Default NACL allows all out and inbound traffic
- Subnets need exactly one association
- Allow or deny rules
- Stateless (inbound is not allowed outbound)

#### Security Groups

- Instance level firewall
- All inbound is blocked and all outbound allowed by default
- Stateful (inbound is also allowed outbound)

#### NAT

- Allow outbound traffic to the internet from a private subnet
- Must exist in a public subnet
- NAT instance (disable resource and destination checks)
- Gateway 
  - 5 to 45 Gbps
  - Per AZ
- 

### EC2

- General Purpose, Compute Optimized, Memory Optimized, Accelerated Optimized, Storage Optimized
- Metadata - http://169.254.169.254/latest/meta-data


#### Placement Groups

- Cluster
  - Inside same AZ
  - Low latency
- Partition
  - Logical Partition - One Rack per partition
- Spread
  - Instances placed on different Racks
  - Max 7 instances
  - Multi AZ

#### Pricing

- On-Demand
  - Pay per hours
- Reserved Instances
  - Up to 75% off
  - Can be resold
- Spot Instances

  So what happens to all the instances that are reserved by customers but not used. Smart as AWS is they sell this capacity to different customers under the premise that they can terminate this instance with a two minute warning.

  These type of instances are called spot instances. Depending on the current capacity in the region these instances can be used for a much cheaper price (up to 90 percent) the so called **spot price** that moves up and down.

  If you want to use these instances you can issue a maximum price that you want to pay. As long as the current spot price is under your maximum price your instances will be provisioned. If it's above they wont. 

  Since your instances can be terminated with a notice of two minutes the best use cases are stateless workloads like big data, social media, web apis and so on. You should definitely not use these instances for your databases.

### ELB

- Network Application or Classic
- No cross region ELB
- X-Forwarded-For Header contains IP

### EBS

- Snapshots
- Modified on the fly
- Root volumes deleted on termination
- Instance Store
  - Ephermal

### CloudFront

- CDN with copies in Edge Locations
- Web or RTMP (Streaming Media) Distributions
- Protect with Signed URL and Signed Cookies
- Lambda@Edge - Change behaviour of response


### RDS
 
- Aurora, MySQL, MariaDB, Postgres, Oracle, SQL Server
- Multi AZ
- Read-Replicas
- Aurora
  - 6 copies - 3 AZ
  - Can be Global
  - Serverless option

### Storage Gateway

- Connect on-premise storage to cloud storage
- Volume Gateway - Backups
  - Stored (EBS Snapshots in S3) - Data on-premise
  - Cached - Only cached on-premis - Data on S3
- File Gateway - S3 as a local file system (NFS/ SMB)
  - Extend local hard drive
- Tape Gateway
  - Backup virtual tapes to S3 Glacier

### Kinesis

- Real-time streaming data
- Firehose
  - Processed Data disappears
- Data Analytics
  -  Real Time queries
- Data Stream
  - Persist streams in shards 24h to 168h

### API Gateway

- Secure, throttle APIs
- Caching
- CORS, XSS
- Authorization with Cognito or Lambda

### Lambda

- Timeout at 15 mins, memory up to 3008 mb (may be higher now)
- Up to 1000 concurrent functions
### Cognito

- Managed authentication and identity service
- User Pool: User directory to allow authentication with Identity Providers
- Identity Pool: temporary IAM Credentials
- Identity Providers: OIDC -> Oauth, SAML -> SSO, Facebook google, Amazon

### Route53

- DNS Provider
- Routing
  - Simple - Random
  - Weighted - Percentage based
  - Latency-Based
  - Failover - Change on Health Checks
  - Geolocation - Geographic location of requests origin
  - Geo-proximity - More complex stuff
  - Multi-value - Return multiple values to DNS queries
- Alias record - Smart AWS custom record
- Route53 resolver - Route DNS queries between your VPCs and Datacenter

### Cloudwatch

- Using the default settings metrics are sent every 5 minutes to CloudWatch. Using the detailed settings, metrics are then sent every 1 minute.

### CloudTrail

- Log API calls
- Account or Org level
- Data Events (S3 GetObject f.e. ), Management Events (AssumeRole)

### Elasticache

- Redis
  - Not multithreaded
  - Cluster
- Memcached
  - Multithreaded
  - No cluster

## AWS Service Overview

So there are a large amounts of AWS services in the exam with very similar names. Here i try to describe most of them in a few words each.

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

### Management and Governance

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

**AWS Migration Hub**

Single place to monitor all AWS migration tools.

**AWS SMS (Server Migration Service)**

Contains the Application Migration Service for lift-and-shift migrations to AWS.

**AWS Snowball/ Snowmobile**

Migrates your data center to AWS by transferring to to a physical device.

**AWS Transfer Family**

Transfer data over FTP like protocols to S3 and EFS.

### Networking and Content Delivery

**Amazon API Gateway**

Centralized serverless entry point to your application apis.

**CloudFront**

CDN solution.

**AWS Direct Connect**

Hybrid cloud solution. Create a dedicated connection to AWS from your data center without going through the internet.

**AWS Global Accelerator**

Use AWS edge locations and the global AWS backbone network to achieve very high network performance when accessing your applications from the internet.

**Route 53**

AWS own DNS. Register your domains here.

**AWS Transit Gateway**

Connect a large amount of VPCs together when VPC peering is not enough.

**Amazon VPC**

Your custom network inside a AWS region.

### Security Identity and Compliance

**AWS Certificate Manager**

Manage TLS certificates from AWS or your own.

**AWS Directory Service**

Managed Microsoft Active Directory.

**Amazon Guard Duty**

Service that monitors your AWS account for threats and security issues.

**AWS Identity and Access Management (IAM)**

Heart piece of AWS. Manage access to your Account.

**Amazon Macie**

Managed data security service. Discover sensitive and vulnerable data in your S3 Buckets.

**AWS Secrets Manager**

Well it stores secrets.

**AWS Shield**

DDoS protection.

**AWS Single Sign-On**

SSO solution to avoid setting up custom users.

**AWS WAF**

Firewall service. Protect against malicious traffic, block IPs, SQL injection, XSS, ect.

### Storage

**EBS (Elastic Block Store)**

Standard block storage drives. SSD , HDD ..

**EFS (Elastic File System)**

Amazons network drive.

**Amazon FSx**

Windows file system network drives or high performance network drives.

**S3 (Simple Storage Service)**

Object storage

**S3 Glacier**

Cheaper S3 storage class with longer retrieval times.

**AWS Storage Gateway**

Use cloud storage from your on-premise infrastructure.
