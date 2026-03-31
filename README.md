# WebForm

[TOC]

## Container Images

> [!Warning]  
> Updating the container image causes ~6s of downtime for that environment.

### Automatic to Staging

To build a new container image create a [new Tag](https://gitlab.rcgtconsulting.io/digital-app-dev/edc-ceba/webform/-/tags/new):
- **Tag name**: `release-#.#.#` (replace `#` with a number)
- **Create from**: `main` (typically)
- Click "Create tag"

This will create a [pipeline in this project](https://gitlab.rcgtconsulting.io/digital-app-dev/edc-ceba/webform/-/pipelines) named "Publish app deployment images for version \<Release Tag>" that will:
1. Build the image.
1. Push it to [this project's Container Registry](https://gitlab.rcgtconsulting.io/digital-app-dev/edc-ceba/webform/container_registry/79).
1. Push it to the CloudOps "Aerodrome" container registry in Azure.
1. Trigger a pipeline in the CloudOps Aeromarshal infrastructure.

> [!Note]  
> This project's pipeline does not wait for the CloudOps Aeromarshal pipeline to complete, it only triggers it.

The CloudOps Aeromarshal pipeline will:
1. Update [Staging](https://contact.staging.ceba-cuec.ca/) to run this new container image.
1. Create a new [pipeline in this project](https://gitlab.rcgtconsulting.io/digital-app-dev/edc-ceba/webform/-/pipelines) named "Promote \<Release Tag> To Production", which will be `Blocked` waiting for a manual step.

### Manual promotion to Production

If and when you want to promote the this release to [Production](https://contact.ceba-cuec.ca/):
1. Find the "Promote \<Release Tag> To Production" entry in [this project's pipeline list](https://gitlab.rcgtconsulting.io/digital-app-dev/edc-ceba/webform/-/pipelines), and click on it.
1. Click the "Run" (▶) button on the `trigger::glue::promote-production` Job in the `promote` stage, then click "Yes, run trigger::glue::promote-production".

> [!Note]  
> Manually running a Job requires at least the "Maintainer" role.

This will trigger a pipeline in the CloudOps Aeromarshal infrastructure that will update [Production](https://contact.ceba-cuec.ca/) to run the \<Release Tag> container image.

> [!Note]  
> This does not wait for the CloudOps Aeromarshal pipeline to complete, it only triggers it.

### Production Rollback

To roll back to previous version of the container in Production:
1. Find the "Promote \<Release Tag> To Production" entry for the desired previous version in [this project's pipeline list](https://gitlab.rcgtconsulting.io/digital-app-dev/edc-ceba/webform/-/pipelines), and click on it.
1. Use the "Run" (▶) button to re-run the `trigger::glue::promote-production` Job.
