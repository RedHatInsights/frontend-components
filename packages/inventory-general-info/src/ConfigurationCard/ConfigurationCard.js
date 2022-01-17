import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingCard from '../LoadingCard';
import { generalMapper, repositoriesMapper } from '../dataMapper';
import { configurationSelector } from '../selectors';
import { extraShape } from '../constants';

export function enabledRepos(repositories) {
  if (repositories) {
    return [
      repositories.enabled && repositories.enabled.length > 0 && `${repositories.enabled.length} enabled`,
      repositories.disabled && repositories.disabled.length > 0 && `${repositories.disabled.length} disabled`,
    ]
      .filter(Boolean)
      .join(' / ');
  }
}

const ConfigurationCard = ({ detailLoaded, configuration, handleClick, hasPackages, hasServices, hasProcesses, hasRepositories, extra }) => (
  <LoadingCard
    title="Configuration"
    isLoading={!detailLoaded}
    items={[
      ...(hasPackages
        ? [
            {
              title: 'Installed packages',
              value: configuration.packages?.length,
              singular: 'package',
              target: 'installed_packages',
              onClick: () => {
                handleClick('Installed packages', generalMapper(configuration.packages, 'Package name'));
              },
            },
          ]
        : []),
      ...(hasServices
        ? [
            {
              title: 'Services',
              value: configuration.services?.length,
              singular: 'service',
              target: 'services',
              onClick: () => {
                handleClick('Services', generalMapper(configuration.services, 'Service name'));
              },
            },
          ]
        : []),
      ...(hasProcesses
        ? [
            {
              title: 'Running processes',
              value: configuration.processes?.length,
              singular: 'process',
              plural: 'processes',
              target: 'running_processes',
              onClick: () => {
                handleClick('Running processes', generalMapper(configuration.processes, 'Process name'));
              },
            },
          ]
        : []),
      ...(hasRepositories
        ? [
            {
              title: 'Repositories',
              value: enabledRepos(configuration.repositories),
              target: 'repositories',
              onClick: () => {
                handleClick('Repositories', repositoriesMapper(configuration.repositories), 'medium');
              },
            },
          ]
        : []),
      ...extra.map(({ onClick, ...item }) => ({
        ...item,
        ...(onClick && { onClick: (e) => onClick(e, handleClick) }),
      })),
    ]}
  />
);

ConfigurationCard.propTypes = {
  detailLoaded: PropTypes.bool,
  handleClick: PropTypes.func,
  configuration: PropTypes.shape({
    packages: PropTypes.arrayOf(PropTypes.string),
    services: PropTypes.arrayOf(PropTypes.string),
    processes: PropTypes.arrayOf(PropTypes.string),
    repositories: PropTypes.shape({
      enabled: PropTypes.arrayOf(
        PropTypes.shape({
          // eslint-disable-next-line camelcase
          base_url: PropTypes.string,
          name: PropTypes.string,
          enabled: PropTypes.bool,
          gpgcheck: PropTypes.bool,
        })
      ),
      disabled: PropTypes.arrayOf(
        PropTypes.shape({
          // eslint-disable-next-line camelcase
          base_url: PropTypes.string,
          name: PropTypes.string,
          enabled: PropTypes.bool,
          gpgcheck: PropTypes.bool,
        })
      ),
    }),
  }),
  hasPackages: PropTypes.bool,
  hasServices: PropTypes.bool,
  hasProcesses: PropTypes.bool,
  hasRepositories: PropTypes.bool,
  extra: PropTypes.arrayOf(extraShape),
};
ConfigurationCard.defaultProps = {
  detailLoaded: false,
  handleClick: () => undefined,
  hasPackages: true,
  hasServices: true,
  hasProcesses: true,
  hasRepositories: true,
  extra: [],
};

export default connect(({ systemProfileStore: { systemProfile } }) => ({
  detailLoaded: systemProfile && systemProfile.loaded,
  configuration: configurationSelector(systemProfile),
}))(ConfigurationCard);
