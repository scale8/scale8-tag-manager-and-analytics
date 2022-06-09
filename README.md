<p align="center">
    <a href="https://scale8.com"><img src="https://scale8.com/img/logo.png" width="100px" /></a>
</p>

<h1 align="center">
    Scale8 - Tag Manager & Data Manager
</h1>

<p align="center">
    <a href="https://www.producthunt.com/posts/scale8?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-scale8" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=348531&theme=neutral&period=daily" alt="Scale8 - An&#0032;open&#0045;source&#0032;and&#0032;privacy&#0032;friendly&#0032;alternative&#0032;to&#0032;GA&#0032;&#0038;&#0032;GTM | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
</p>

<p align="center">
    <a href="https://scale8.com"><img src="https://img.shields.io/badge/Scale8-Website-9042e7" height="20"/></a>
    <a href="https://scale8.github.io/docs"><img src="https://img.shields.io/badge/Scale8-Documentation-39cce0" height="20"/></a>
    <a href="https://scale8.github.io/api-docs"><img src="https://img.shields.io/badge/Scale8-API%20Documentation-ff0084" height="20"/></a>
</p>

<p align="center">
    <a href="https://www.gnu.org/licenses/agpl-3.0"><img src="https://img.shields.io/badge/License-AGPL%20v3%20%26%20MIT*-blue.svg" height="20"/></a>
    <a href="#"><img src="https://github.com/scale8/tag-manager/actions/workflows/main.yml/badge.svg" height="20"/></a>
</p>

<br />

> :eyes: \*MIT License is applied to **Platforms** to enable network distribution. The rest of the project remains under AGPL v3.

A simple, yet powerful [Google Tag Manager alternative](https://scale8.com/tag-manager/) that is fully open-sourced and privacy-friendly.
Our in-built [Google Analytics alternative](https://scale8.com) doesn't use any cookies and is fully GDPR, CCPA and PECR compliant.
We've made it quick and easy to try a demo or simply host it yourself in production. We'll also be offering a cloud hosted version in the near future.

The [Data Manager](https://scale8.com/data-manager/) provides pluggable backends to send data anywhere, and we've got a pipeline to increase both connectors and features.
In just a few clicks, design a schema, configure a back-end and create an endpoint to send data to. The [Tag Manager](https://scale8.com/tag-manager/) uses this same underlying tech to provide analytics.

Our mission has been to create an intuitive Tag Management tool that can be fully extended via custom platforms (built by our community!).
We're a small team that is passionate about building great open-source software and hopefully reducing the market share of much larger companies.
We are not a fan of increasing corporate or government surveillance, and we fundamentally believe that your website's users deserve better - this however needs
to be balanced with the business requirement to monetise a property and personal data being shared.

## Running the project

Here is a one-line example of how to get started if you already have [Docker Compose](https://docs.docker.com/compose/) installed.

```bash
~> curl -L https://github.com/scale8/tag-manager/raw/master/docker-compose.yml | docker-compose -f - up
```

Once the command above has started the services, point your browser at **```http://127.0.0.1:8080```**. You will be prompted to enter some basic details to configure the project.

Or if you have checked out the project already and installed the dependencies via ```~> yarn install:all``` and wish to run it locally: -

```bash
~> yarn run:all
```

## Platform structure

We've architected the entire platform to support docker and limited where possible complex build processes and mounting of extra volumes.
We're scripting hard to provide complete one-click production ready setups for both AWS, Google Cloud and custom kubernetes setups.

| Component | Description |
|---|---|
| [API](/api) | Contains all the business logic and provides GraphQL / RESTFul endpoints that power the UI |
| [Common](/common) | A small common library that is shared between project components |
| [Edge](/edge) | Designed to scale horizontally, the edge server is responsible for delivering platforms at the edge and also tracking data in |
| [Platforms](/platforms) | Custom platforms created by the community and Scale8 that extend the functionality of the Tag Manager |
| [Router](/router) | A simple router, created using Nginx and designed for spinning up the self-hosted version quickly |
| [UI](/ui) | Provides a static build of the UI using Next.js & React |

## Development - Install dependencies and build

- Install all project dependencies: ```~> yarn install:all```
- Build all projects: ```~> yarn build:all```

## Analytics-only mode

As not everyone has the requirement to use a full Tag Manager, we've also provided an option to generate an extremely light version that only requires a few lines of JavaScript.

<p align="center"><a href="https://scale8.github.io/docs/creating-application"><img src="https://scale8.com/img/screenshot.png" width="100%"/></a><a href="#"><img src="https://scale8.com/img/shadow.png" width="100%"/></a></p>

We have also provided full support for tracking Single Page Applications (SPAs) and hash-routing. These can be enabled when you install your application.

## Features overview

### Tag Manager

- [Tags](https://scale8.github.io/docs/tags): Create tags that automatically load, or include them on the fly in your application.
- [Rule Groups](https://scale8.github.io/docs/rule-groups): Tags can be associated with one or more Rule Groups that can be run in parallel.
- [Rules](https://scale8.github.io/docs/rules): Rule groups can contain multiple rules with the first rule winning. Rules can also be repeated once they've won.
- [Events](https://scale8.github.io/docs/events): Attach events to rules as triggers. Once attached they will listen for your chosen event to occur before allowing a rule to proceed.
- [Conditions & Exceptions](https://scale8.github.io/docs/conditions-and-exceptions): Attach conditions and exceptions to rules. These will test your data containers / data layers.
- [Actions](https://scale8.github.io/docs/actions): Once events and/or conditions are satisfied, then trigger one or more actions. App-state enables actions to trigger other actions.
- [Action Groups](https://scale8.github.io/docs/action-groups): Action groups contain actions and provide a useful container to separate logic.
- [Action Group Distributions](https://scale8.github.io/docs/action-group-distributions): Run experiments (A/B tests) or monitor just a percentage of traffic. Easily distribute your actions across your users.
- [Installed Platforms](https://scale8.github.io/docs/installed-platforms): Install 3rd party platforms submitted by our community. These platforms extend Events, Data Containers and Actions.
- [Installed Platform Revisions](https://scale8.github.io/docs/installed-platform-revisions): A revision is locked to a platform revision. Upgrade and deploy with confidence as connect platforms change.
- [Environments](https://scale8.github.io/docs/tag-manager-environments): Create as many environments as your team requires, matching your existing workflows.
- [Revision Control](https://scale8.github.io/docs/tag-manager-revisions): All changes happen within a new revision. Preview and test without complex release cycles. Deploy with confidence.
- [Debugging](https://scale8.github.io/docs/tag-manager-debug): Debug your application with ease. ***Remote debugging coming soon!***
- [Analytics](https://scale8.github.io/docs/analytics): A simple and intuitive set of analytics tools. Event tracking with Event Group support.
- [Analytics-only Mode](https://scale8.github.io/docs/creating-application#analytics-only): Run an incredibly lightweight snippet of JavaScript code to gain full analytics data.

### Data Manager

- [Ingest Endpoints](https://scale8.github.io/docs/ingest-endpoints): Generate new endpoints to send data to in just a few clicks.
- [Data Structure](https://scale8.github.io/docs/data-structure): Compose a data structure that is compatible with any backend we offer. Design once, use everywhere.
- [Revisions](https://scale8.github.io/docs/revisioning): Everything sits under revision control. Release with confidence.
- [Usage Monitoring](https://scale8.github.io/docs/ingest-endpoint-dashboard): Track endpoint requests and data usage.
- [Environments](https://scale8.github.io/docs/environments): Test your latest data structure without compromising your production setup. Roll-back in seconds.

### All products

- [Team Support](https://scale8.github.io/docs/managing-your-team): Invite team members and manage access levels.
- [Full API Support](https://scale8.github.io/api-docs): **Automate everything** - The UI is static and calls the GraphQL API for everything.

## Core concepts

We've done our best to simplify the process of organising and managing tags across one or more web properties.
The Tag Manager is based on an **event-driven**, **rule-based** engine whereby a rule is triggered when [Events](https://scale8.github.io/docs/events) and [Conditions and Exceptions](https://scale8.github.io/docs/conditions-and-exceptions) are all met, resulting in one or more [Actions](https://scale8.github.io/docs/actions) being taken.

### Events

A triggered event within the browser can be easily managed by our simple interface.
A clicked link, a page coming into focus, or a submitted form are all examples of events you may wish to listen to.

### Conditions & Exceptions

A condition is a test made on a data container and aims to assert that some key belonging to a data container object is aligned with the expected value.
An exception aims to make the same test, but instead exclude the rule should the test pass.

<p align="center"><a href="https://scale8.github.io/docs/conditions-and-exceptions"><img src="https://scale8.github.io/img/tag-manager/tag-manager-condition-equal-gb.png" width="100%"/></a><a href="#"><img src="https://scale8.com/img/shadow.png" width="100%"/></a></p>

### Actions

Upon meeting the rule's required events and condition, an action will be fired. [Learn more about actions here](https://scale8.github.io/docs/actions).

## Tech stack

### TLDR;

- **UI**: [Next.js](https://nextjs.org/), TypeScript, React, Apollo, GraphQL, Material UI.
- **Edge**: [Micronaut](https://micronaut.io/), Java, Maven.
- **Router**: [Nginx](https://www.nginx.com/) - Used for self-hosted version only and not required for all setups.
- **API**: [InversifyJS](https://github.com/inversify/InversifyJS), Node, TypeScript, Express, MongoDB, Apollo, GraphQL, Jest.
- **Platforms**: TypeScript, Webpack, Jest.

### A longer explanation

We originally started off with a TypeScript front-end and Scala driven back-end.
To provide the code transparency we wanted, coupled with a decision to open-source the project required us to move to almost purely TypeScript with just the edge server in Java.
We fundamentally believe the future of this project sits with the open-source community now and there are more TypeScript and Java engineers than Scala engineers.

Just before releasing we've moved from CRA to Next.js too. We've also introduced inversion of control (IOC) in our TypeScript back-end.
Our goal is for this project to be as extensible as possible. A plug and play model provides us with the opportunity to provide multiple services and prevent lock-ins.

```typescript
container.bind<BaseStorage>(TYPES.BackendStorage).to(MongoDBStorage).inSingletonScope();
container.bind<BaseDatabase>(TYPES.BackendDatabase).to(MongoDb).inSingletonScope();
container.bind<BaseLogger>(TYPES.BackendLogger).to(ConsoleLogger).inSingletonScope();
container.bind<BaseEmail>(TYPES.BackendEmail).to(Mailer).inSingletonScope();
container.bind<BaseConfig>(TYPES.BackendConfig).to(EnvironmentConfig).inSingletonScope();
```

We've taken a similar approach with our Java code too.

```java
@Replaces(StorageInterface.class)
@Singleton
@Requires(property = "backend-storage", value = "google")
public class GoogleStorage implements StorageInterface {
    ...
}
```

At present, we provide only MongoDB and Google's BigQuery for analytics. MongoDB is only suitable for small projects and for the purpose of demo / testing.
We have full Clickhouse support in our yet to be released cloud version, and we'll be adding this support in the self-hosted version shortly along with Redshift and Postgres.

We've also removed our hourly aggregation pipelines from the self-hosted version. This added an unnecessary degree of complexity for the vast majority of use cases.
There is a plan to potentially re-introduce this later and should anyone require it, please let us know.

## Documentation

All of our [documentation](https://scale8.github.io/docs) is designed for the cloud version of the product, however we'll be adding more detailed documentation for the self-hosted version soon.
We've hidden away some features such as payment processing and SSL termination for custom domains that are not relevant to the self-hosted version.

The entire UI is powered by [GraphQL](https://graphql.org/) using Apollo and the [API documentation](https://scale8.github.io/api-docs) is automatically generated and easily navigated.

## Support us!

All we ask is that you star or watch this on GitHub if you like the project. We'd love people to share and blog about this too! All issues will be responded to quickly in GitHub, and we're excited to see where this goes next.

## Authors

| Author | GitHub | LinkedIn |
|---|---|---|
| Christopher Beck | [![Christopher Beck on GitHub](https://img.shields.io/badge/GitHub-242A2F.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/cwbeck) | [![Christopher Beck on LinkedIn](https://img.shields.io/badge/LinkedIn-1066C2.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/chriswbeck/) |
| Alessandro Barzanti | [![Alessandro Barzanti on GitHub](https://img.shields.io/badge/GitHub-242A2F.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/a-barzanti) | [![Alessandro Barzanti on LinkedIn](https://img.shields.io/badge/LinkedIn-1066C2.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/barzanti/) |

