import * as acm from '@aws-cdk/aws-certificatemanager';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as route53 from '@aws-cdk/aws-route53';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3Deployment from '@aws-cdk/aws-s3-deployment';
import * as cdk from '@aws-cdk/core';
import { StackProps } from '@aws-cdk/core';
import targets = require("@aws-cdk/aws-route53-targets/lib");

export interface StaticSiteProps extends StackProps {
  domainName: string;
  siteSubDomain: string;
}

export class InfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: StaticSiteProps) {
    super(scope, id, props);

    const zone = route53.HostedZone.fromLookup(this, "Zone", {
      domainName: props.domainName,
    });

    const siteDomain = props.siteSubDomain + "." + props.domainName;
    new cdk.CfnOutput(this, "Site", { value: "https://" + siteDomain });

    const siteBucket = new s3.Bucket(this, "coel-blog-bucket", {
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteIndexDocument: "index.html",
    });
    new cdk.CfnOutput(this, "Bucket", { value: siteBucket.bucketName });

    // TLS certificate
    const certificateArn = new acm.DnsValidatedCertificate(
      this,
      "SiteCertificate",
      {
        domainName: siteDomain,
        hostedZone: zone,
        region: "us-east-1", // Cloudfront only checks this region for certificates.
      }
    ).certificateArn;
    new cdk.CfnOutput(this, "Certificate", { value: certificateArn });

    const siteDeployment = new s3Deployment.BucketDeployment(this, "deployStaticWebsite", {
      sources: [s3Deployment.Source.asset("../myblog/public")],
      destinationBucket: siteBucket,
    });

    // CloudFront distribution that provides HTTPS
    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "SiteDistribution",
      {
        aliasConfiguration: {
          acmCertRef: certificateArn,
          names: [siteDomain],
          sslMethod: cloudfront.SSLMethod.SNI,
          securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_1_2016,
        },
        originConfigs: [
          {
            customOriginSource: {
              domainName: siteBucket.bucketWebsiteDomainName,
              originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
      }
    );
    new cdk.CfnOutput(this, "DistributionId", {
      value: distribution.distributionId,
    });

    // Route53 alias record for the CloudFront distribution
    new route53.ARecord(this, "SiteAliasRecord", {
      recordName: siteDomain,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      ),
      zone,
    });

  }
}
