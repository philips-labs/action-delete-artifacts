<div align="center">

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

</div>

<br />
<div align="center">
  <h3 align="center">GitHub Action to delete workflow artifact(s)</h3>

  <p align="center">
An action that deletes an artifact associated with given workflow.
    <br>
    <a href="https://github.com/philips-labs/action-delete-artifacts/issues">Report Bug</a>
    ·
    <a href="https://github.com/philips-labs/action-delete-artifacts/issues">Request Feature</a>
  </p>
</div>

## Description

Let's suppose you have a workflow with a job in it that at the end uploads an artifact using `actions/upload-artifact` action and you want to download this artifact in another workflow using [dawidd6/action-download-artifact](https://github.com/dawidd6/action-download-artifact). After downloading the artifact and doing something with the artifact (like deploying something to GitHub Pages), you may want to clean up the workflow artifact to stay within storage cost restrictions. This GitHub Actions helps with that.  

## Usage

```YAML
  cleanup-artifacts:
    name: Job to clean up old artifacts
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Remove artifact
        uses: philips-labs/action-delete-artifacts@v1.0.0
        with:
          # Optional, GitHub token, a Personal Access Token with `repo` scope if needed
          # Required, if artifact is from a different repo
          # Required, if repo is private a Personal Access Token with `repo` scope is needed
          github_token: ${{secrets.GITHUB_TOKEN}}
          # Required, workflow file name or ID
          workflow: workflow-name.yml
          # Optional, uploaded artifact name,
          # will delete all artifacts if not specified
          name: artifact.json
          # Optional, the status or conclusion of a completed workflow to search for
          # Can be one of a workflow conclusion:
          #   "failure", "success", "neutral", "cancelled", "skipped", "timed_out", "action_required"
          # Default is set to success
          workflow_conclusion: success
```

## Example

```YAML
name: Deploy Portal 

on:
  workflow_run:
    branches:
      - main
    workflows: ["Deployment"]
    types:
      - completed
  workflow_dispatch:

jobs:
  cleanup-artifacts:
    name: Job to clean up old artifacts
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Download artifact
        uses: philips-labs/action-delete-artifacts@v1.0.0
        with:
          workflow: crawl.yml
          name: repos.json
```

## Contributing

If you have a suggestion that would make this project better, please fork the repository and create a pull request. You can also simply open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See [LICENSE](/LICENSE) for more information.

## Acknowledgments

This project is inspired by:

- [dawidd6/action-download-artifact](https://github.com/dawidd6/action-download-artifact)

[contributors-shield]: https://img.shields.io/github/contributors/philips-labs/action-delete-artifacts.svg?style=for-the-badge
[contributors-url]: https://github.com/philips-labs/action-delete-artifacts/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/philips-labs/action-delete-artifacts.svg?style=for-the-badge
[forks-url]: https://github.com/philips-labs/action-delete-artifacts/network/members
[stars-shield]: https://img.shields.io/github/stars/philips-labs/action-delete-artifacts.svg?style=for-the-badge
[stars-url]: https://github.com/philips-labs/action-delete-artifacts/stargazers
[issues-shield]: https://img.shields.io/github/issues/philips-labs/action-delete-artifacts.svg?style=for-the-badge
[issues-url]: https://github.com/philips-labs/action-delete-artifacts/issues
[license-shield]: https://img.shields.io/github/license/philips-labs/action-delete-artifacts.svg?style=for-the-badge
[license-url]: https://github.com/philips-labs/action-delete-artifacts/blob/master/LICENSE