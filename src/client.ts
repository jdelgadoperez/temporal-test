import { Connection, Client, WorkflowStartOptions, Workflow } from '@temporalio/client';
import { ApplicationFailure } from '@temporalio/common';
import { nanoid } from 'nanoid';

import { peopleByRulesWorkflow, helloWorkflow, peopleListWorkflow } from './workflows';
import { IRule } from './definitions/rules';
import { IPeople } from './definitions/swapi';

async function processWorkflow(client: Client, workflowTypeOrFunc: string | Workflow, options: WorkflowStartOptions<Workflow>) {
  try {
    const handle = await client.workflow.start(workflowTypeOrFunc, options);
    console.log(`Started workflow ${handle.workflowId}`);
    console.log(await handle.result());
  } catch (error) {
    throw new ApplicationFailure(`Workflow failed. Error: ${error}`);
  }
}

async function run() {
  const connection = await Connection.connect({ address: 'localhost:7233' });
  const client = new Client({
    connection,
  });
  const taskQueue = 'star-wars';

  // 1. Set up a HelloWorld Workflow with Temporal
  await processWorkflow(client, helloWorkflow, {
    taskQueue,
    args: ['Temporal'],
    workflowId: 'workflow-' + nanoid(),
  });

  // 2. Collect a list of ALL of the ‘people’ from public API
  await processWorkflow(client, peopleListWorkflow, {
    taskQueue,
    args: [{ page: 1 }],
    workflowId: 'workflow-' + nanoid(),
  });

  // 3. Filter the list of ‘people’ using a rules interface
  await processWorkflow(client, peopleByRulesWorkflow, {
    taskQueue,
    args: [
      <IRule<IPeople>[]>[
        { propertyName: 'eye_color', operator: 'eq', value: 'red' },
        { propertyName: 'name', operator: 'regex', value: '[0-9]' },
      ]
    ],
    workflowId: 'workflow-' + nanoid(),
  });
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
