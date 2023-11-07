import axios from 'axios';
import { IListRequest, IListResponse, IPeople, ResourcesType } from './definitions/swapi';
import { IRule } from './definitions/rules';

export async function greet(name: string): Promise<string> {
  return `Hello, ${name}!`;
}

const apiUrl = 'https://swapi.dev/api/';

async function get<T>(url: string): Promise<T> {
  try {
    const result = await axios.get<T>(`${apiUrl}/${url}`);
    return result.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getPeople({ page = 1, search = '' }: IListRequest) {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  if (search) {
    params.append('search', search);
  }
  return await get<IListResponse<IPeople>>(`${ResourcesType.People}/?${params.toString()}`);
}

export async function getPerson(id: number) {
  return await get<IPeople>(`${ResourcesType.People}/${id}`);
}

export async function getAllPeople({ page = 1, search = '' }: IListRequest) {
  const people: IPeople[] = [];
  let next = true;
  while (next) {
    const response = await getPeople({ page, search });
    people.push(...response.results);
    next = response.next !== null;
    if (page % 2 === 0) {
      const totalPages = Math.ceil((response?.count || 0) / 10);
      console.log(`Page ${page} of ${totalPages} with a total of ${response?.count} people`);
    }
    page++;
  }
  return people;
}

function matchesRule<T>(person: T, rule: IRule<T>) {
  switch (rule.operator) {
    case 'eq': {
      return person[rule.propertyName] === rule.value;
    }
    case 'regex': {
      const regex = new RegExp(`${rule.value}`, 'gi');
      return regex.test(`${person[rule.propertyName]}`);
    }
    default:
      return false;
  }
}

export async function getPeopleByRules(rules: IRule<IPeople>[]) {
  const people = await getAllPeople({ page: 1 });
  return people.filter((person) => {
    for (const rule of rules) {
      if (!matchesRule(person, rule)) return false;
    }
    return true;
  });
}
