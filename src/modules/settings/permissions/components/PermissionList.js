import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Pagination,
  ModalTrigger,
  Button,
  DataWithLoader,
  Table,
  FormControl,
  Tip,
  ActionButtons,
  ShowContent
} from 'modules/common/components';
import { Wrapper } from 'modules/layout/components';
import Sidebar from 'modules/settings/Sidebar';
import PermissionForm from './PermissionForm';
import { FilterWrapper } from './styles';
import Select from 'react-select-plus';
import { router } from 'modules/common/utils';
import {
  generateModuleParams,
  generateUsersParams,
  correctValue
} from './utils';

const propTypes = {
  isLoading: PropTypes.bool.isRequired,
  permissions: PropTypes.array.isRequired,
  modules: PropTypes.array.isRequired,
  actions: PropTypes.array.isRequired,
  totalCount: PropTypes.number,
  users: PropTypes.array.isRequired,
  history: PropTypes.object,
  queryParams: PropTypes.object,
  save: PropTypes.func,
  remove: PropTypes.func
};

class PermissionList extends Component {
  constructor(props) {
    super(props);

    this.renderObjects = this.renderObjects.bind(this);
  }

  renderObjects() {
    const { permissions, remove } = this.props;
    const { can } = this.context;

    return permissions.map(object => {
      return (
        <tr key={object._id}>
          <td>{object.module}</td>
          <td>{object.action}</td>
          <td>{object.user.email}</td>
          <td>
            <FormControl
              componentClass="checkbox"
              disabled="disabled"
              defaultChecked={object.allowed}
            />
          </td>
          <td>
            <ShowContent show={can('configPermission')}>
              <ActionButtons>
                <Tip text="Delete">
                  <Button
                    btnStyle="link"
                    onClick={remove.bind(null, object._id)}
                    icon="close"
                  />
                </Tip>
              </ActionButtons>
            </ShowContent>
          </td>
        </tr>
      );
    });
  }

  renderContent() {
    return (
      <Table>
        <thead>
          <tr>
            <th>Module</th>
            <th>Action</th>
            <th>Email</th>
            <th>Allow</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{this.renderObjects()}</tbody>
      </Table>
    );
  }

  renderForm(props) {
    return <PermissionForm {...props} />;
  }

  render() {
    const {
      isLoading,
      modules,
      actions,
      users,
      history,
      save,
      queryParams,
      totalCount
    } = this.props;

    const { can } = this.context;

    const title = 'New permission';

    const breadcrumb = [
      { title: 'Settings', link: '/settings' },
      { title: 'Permissions' }
    ];

    const trigger = (
      <Button btnStyle="success" size="small" icon="plus">
        {title}
      </Button>
    );

    const actionBarRight = can('configPermission') ? (
      <ModalTrigger title={title} size={'lg'} trigger={trigger}>
        {this.renderForm({ modules, actions, users, history, save })}
      </ModalTrigger>
    ) : null;

    const actionBarLeft = (
      <div>
        <FilterWrapper>
          <Select
            placeholder="Choose module"
            options={generateModuleParams(modules)}
            value={queryParams.module}
            onChange={item => {
              router.setParams(history, { module: correctValue(item) });
            }}
          />
        </FilterWrapper>

        <FilterWrapper>
          <Select
            placeholder="Choose action"
            options={generateModuleParams(actions)}
            value={queryParams.action}
            onChange={item => {
              router.setParams(history, { action: correctValue(item) });
            }}
          />
        </FilterWrapper>

        <FilterWrapper>
          <Select
            placeholder="Choose user"
            options={generateUsersParams(users)}
            value={queryParams.userId}
            onChange={item => {
              router.setParams(history, { userId: correctValue(item) });
            }}
          />
        </FilterWrapper>
      </div>
    );

    return (
      <Wrapper
        header={<Wrapper.Header breadcrumb={breadcrumb} />}
        leftSidebar={<Sidebar />}
        actionBar={
          <Wrapper.ActionBar left={actionBarLeft} right={actionBarRight} />
        }
        footer={<Pagination count={totalCount} />}
        transparent={false}
        content={
          <DataWithLoader
            data={this.renderContent({
              modules,
              actions,
              users,
              history,
              save
            })}
            loading={isLoading}
            count={totalCount}
            emptyText="There is no data."
            emptyImage="/images/robots/robot-05.svg"
          />
        }
      />
    );
  }
}

PermissionList.propTypes = propTypes;

PermissionList.contextTypes = {
  can: PropTypes.func
};

export default PermissionList;