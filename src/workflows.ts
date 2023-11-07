import * as workflow from '@temporalio/workflow';

// Only import the activity types
import type * as activities from './activities';
import { IListRequest, IPeople } from './definitions/swapi';
import { IRule } from './definitions/rules';

const {
  greet,
  getPerson,
  getAllPeople,
  getPeopleByRules,
} = workflow.proxyActivities<typeof activities>({
  retry: {
    initialInterval: '50 milliseconds',
    maximumAttempts: 2,
  },
  startToCloseTimeout: '1 minute',
});

export async function helloWorkflow(name: string): Promise<string> {
  return await greet(name);
}

export async function peopleListWorkflow(request: IListRequest): Promise<IPeople[]> {
  return await getAllPeople(request);
}

export async function peopleByRulesWorkflow(rules: IRule<IPeople>[]): Promise<IPeople[]> {
  return await getPeopleByRules(rules);
}

export async function personWorkflow(id: number): Promise<IPeople> {
  return await getPerson(id);
}
