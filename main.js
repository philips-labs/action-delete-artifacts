const core = require('@actions/core')
const github = require('@actions/github')

async function main() {
    try {
        const token = core.getInput("github_token") || process.env.GITHUB_TOKEN;
        const workflow = core.getInput("workflow", { required: true });
        const repo = core.getInput("repo") || process.env.GITHUB_REPOSITORY;
        const [owner, repository] = repo.split("/");
        const name = core.getInput("name");
        let workflowConclusion = core.getInput("workflow_conclusion") || 'success'; 
        let runID = core.getInput("run_id"); 

        const client = github.getOctokit(token);

        if (!runID) {
            for await (const runs of client.paginate.iterator(client.rest.actions.listWorkflowRuns, {
                owner: owner,
                repo: repository,
                workflow_id: workflow
            })) {
                for (const run of runs.data) {
                    if (workflowConclusion && (workflowConclusion != run.conclusion && workflowConclusion != run.status)) {
                        continue;
                    }
                    runID = run.id;
                    break;
                }
                if (runID) {
                    break;
                }
            }
        }

        if (!runID) {
            throw new Error("no matching workflow run found");
        }

        let artifacts = await client.paginate(client.rest.actions.listWorkflowRunArtifacts, {
            owner: owner,
            repo: repository,
            run_id: runID,
        });

        if (name) {
            artifacts = artifacts.filter((artifact) => artifact.name === name);
        }

        if (artifacts.length === 0) {
            throw new Error("no artifacts found");
        }
        
        for (const artifact of artifacts) {
            console.log("==> Deleting artifact:", artifact.id);
            await client.rest.actions.deleteArtifact({
                owner: owner,
                repo: repository,
                artifact_id: artifact.id,
            });
        }

    } catch (error) {
        core.setFailed(error.message);
    }
}

main();
