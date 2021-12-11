+++ author = "Timur Philip Cöl"
title = "Monitor the TLS certificate expiration date with Java"
date = "2021-12-11"
description = "A sad story about PKI and certificate expiration"
categories = [
"pki",
"tls",
"java"
]
tags = [
"pki",
"tls",
"java",
"cloudwatch",
"aws"
]
image = "ssl-cert.png"
+++

**So i wanted to write about this story for a little while.**

<p>A few weeks ago our application stopped serving valid tls certificates. One might ask "How can it be? Don't you have automatic tls certificate renewal implemented? It should be very easy since we are already running on the AWS cloud.". Well the reality is that a lot of big corporations use their own enterprise DNS systems where the creation of custom DNS aliases and certificate requires a Change Request in some old Change Management System. These certificates are often valid for about two years after which they expire and your end users will be blessed by a sweet insecure connection warning in their browsers.</p>

So how can we avoid this?

**Automatic certificate renewal. Should be easy with services like ACM and Route53.**

Well for this kind of domain name we don't have access to the appropriate Hosted Zone so it sadly does not work.

**The next obvious answer is to create a appointment in your team calendar or a JIRA Task with a due date 30 days before the expiration to remind everyone in the team to renew the damn certificates.**

Well, we did it and somehow everyone still missed the expiration date.

**Monitor the expiration dates and alert on the remaining days until expiration**

This is what we should have done. So i wrote a little application to help us in the future.

**How do i check TLS certificate expirations in Java?**

In short:

```java
var hostname = "blog.coel.link";

URL url = new URL("https://" + hostname);
HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();
conn.connect();
Arrays.stream(conn.getServerCertificates())
        .map(X509Certificate.class::cast)
        .filter(x509Certificate -> x509Certificate.getSubjectX500Principal().getName().contains(hostname))
        .findFirst()
        .map(x509Certificate -> LocalDate.ofInstant(x509Certificate.getNotAfter().toInstant(),
                ZoneId.systemDefault()))
        .ifPresent(date -> System.out.println(hostname + " expires on " + date));
}
```

This results in the following output:

```
❯ java Application.java
blog.coel.link expires on 2022-09-05
```

The java code uses the old HTTP client API `HttpsURLConnection`. It then finds the first x509 certificate in the chain matching our hostname.

So at this point i simply created a metric in Cloudwatch that shows the remaining days until expiry. With that metric as source you can simply create Cloudwatch alarms that notify you with SNS by Webhook, SMS or whatever.

Check out the full  solution on my GitHub https://gist.github.com/tmplcl/d68dd0873d103151cfb8e378f1fc6ad0

Cheers
Timur
