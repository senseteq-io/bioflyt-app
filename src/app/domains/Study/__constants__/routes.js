
    import { StudiesAll, StudyCreate } from '../routes'

    export default [
  {
  name: 'StudiesAll',
  path: '/studies',
  exact: true,
  component: StudiesAll
}
,
{
  name: 'StudyCreate',
  path: '/study/new',
  exact: true,
  component: StudyCreate
}
]
  