import * as acm from '@aws-cdk/aws-certificatemanager';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as route53 from '@aws-cdk/aws-route53';
import * as route53_targets from '@aws-cdk/aws-route53-targets';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3Deployment from '@aws-cdk/aws-s3-deployment';
import * as cdk from '@aws-cdk/core';
import { StackProps } from '@aws-cdk/core';

export interface StaticSiteProps extends StackProps {
  domainName: string;
  siteSubDomain: string;
  useCloudFront?: boolean;
}

export class InfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: StaticSiteProps) {
    super(scope, id, props);

    const zone = route53.HostedZone.fromLookup(this, "Zone", {
      domainName: props.domainName,
    });

    const siteDomain = props.siteSubDomain + "." + props.domainName;
    new cdk.CfnOutput(this, "Site", { value: "https://" + siteDomain });

    const siteBucket = new s3.Bucket(this, "StaticSiteContent", {
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteIndexDocument: "index.html",
      autoDeleteObjects: true
    });
    new cdk.CfnOutput(this, "Bucket", { value: siteBucket.bucketName });

    // TLS certificate
    const certificate = new acm.DnsValidatedCertificate(
      this,
      "SiteCertificate",
      {
        domainName: siteDomain,
        hostedZone: zone,
        region: "us-east-1", // Cloudfront only checks this region for certificates.
      }
    );
    new cdk.CfnOutput(this, "Certificate", { value: certificate.certificateArn });

    const siteDeployment = new s3Deployment.BucketDeployment(this, "deployStaticWebsite", {
      sources: [s3Deployment.Source.asset("../myblog/public")],
      destinationBucket: siteBucket,
    });

    if (props.useCloudFront) {
      this.routeToCloudFrontDistribution(siteDomain, siteBucket, zone, certificate.certificateArn)
    } else {
      this.routeToS3Bucket(siteDomain, siteBucket, zone);
    }
  }

  private routeToS3Bucket(siteDomain: string, siteBucket: s3.Bucket, zone: route53.IHostedZone) {
    const aRecord = new route53.ARecord(this, "SiteAliasRecord", {
      recordName: siteDomain,
      target: route53.RecordTarget.fromAlias(
        new route53_targets.BucketWebsiteTarget(siteBucket)
      ),
      zone,
    });
    new cdk.CfnOutput(this, "domainName", {
      value: aRecord.domainName,
    });
  }

  private routeToCloudFrontDistribution(siteDomain: string, siteBucket: s3.Bucket, zone: route53.IHostedZone, certificateArn: string) {

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

    const aRecord = new route53.ARecord(this, "SiteAliasRecord", {
      recordName: siteDomain,
      target: route53.RecordTarget.fromAlias(
        new route53_targets.CloudFrontTarget(distribution)
      ),
      zone,
    });
    new cdk.CfnOutput(this, "domainName", {
      value: aRecord.domainName,
    });
  }
}
