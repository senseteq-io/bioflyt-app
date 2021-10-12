
    import { GroupCreate, GroupEdit, GroupsAll, GroupShow } from '../routes'

    export default [
  {
  name: 'GroupCreate',
  path: '/group/new',
  exact: true,
  component: GroupCreate
}
,
{
  name: 'GroupEdit',
  path: '/groups/:id/edit',
  exact: true,
  component: GroupEdit
}
,
{
  name: 'GroupsAll',
  path: '/groups',
  exact: true,
  component: GroupsAll
}
,
{
  name: 'GroupShow',
  path: '/groups/:id',
  exact: true,
  component: GroupShow
}
]
  