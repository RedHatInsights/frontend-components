import { Dropdown } from '@patternfly/react-core/dist/dynamic/components/Dropdown';
import { DropdownItem } from '@patternfly/react-core/dist/dynamic/components/Dropdown';
import { DropdownList } from '@patternfly/react-core/dist/dynamic/components/Dropdown';
import { DropdownProps } from '@patternfly/react-core/dist/dynamic/components/Dropdown';
import { MenuToggle } from '@patternfly/react-core/dist/dynamic/components/MenuToggle';
import { Tooltip } from '@patternfly/react-core/dist/dynamic/components/Tooltip';

import React, { useState } from 'react';

import ExportIcon from '@patternfly/react-icons/dist/dynamic/icons/export-icon';

export interface DownloadButtonProps extends Omit<DropdownProps, 'onSelect' | 'toggle' | 'dropdownItems'> {
  /**
   * Additional JSX elements rendered as dropdown options
   */
  extraItems?: React.ReactNode;
  /**
   * Text to appear in the tooltip
   */
  tooltipText?: React.ReactNode;
  /**
   * Action the button will take when selected
   */
  onSelect?: (event: MouseEvent | React.MouseEvent<any, MouseEvent> | React.KeyboardEvent<Element>, format: 'csv' | 'json') => void;
  /**
   * Determines if the button is disabled or not
   */
  isDisabled?: boolean;
}

/**
 * Download Button is a button component specifically made to be used for any download logic
 */

const DownloadButton: React.FunctionComponent<DownloadButtonProps> = ({
  extraItems = [],
  onSelect = () => undefined,
  isDisabled,
  tooltipText = 'Export data',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const internalOnSelect = () => setIsOpen((prev) => !prev);

  const conditionallyTooltip = (children: React.ReactElement) => {
    return <React.Fragment>{tooltipText ? <Tooltip content={tooltipText}>{children}</Tooltip> : children}</React.Fragment>;
  };

  return (
    <React.Fragment>
      {conditionallyTooltip(
        <Dropdown
          {...props}
          onOpenChange={(isOpen) => setIsOpen(isOpen)}
          onSelect={internalOnSelect}
          toggle={(toggleRef) => (
            <MenuToggle
              aria-label="Export"
              variant="plain"
              ref={toggleRef}
              isExpanded={isOpen}
              onClick={() => setIsOpen((prev) => !prev)}
              icon={<ExportIcon />}
            />
          )}
          isOpen={isOpen}
          ouiaId="Export"
          popperProps={{ appendTo: 'inline' }}
        >
          <DropdownList>
            <DropdownItem
              key="download-csv"
              ouiaId="DownloadCSV"
              component="button"
              onClick={(event) => onSelect(event, 'csv')}
              isDisabled={isDisabled}
              aria-label="Export to CSV"
            >
              Export to CSV
            </DropdownItem>
            <DropdownItem
              aria-label="Export to JSON"
              key="download-json"
              ouiaId="DownloadJSON"
              component="button"
              onClick={(event) => onSelect(event, 'json')}
              isDisabled={isDisabled}
            >
              Export to JSON
            </DropdownItem>
            {extraItems}
          </DropdownList>
        </Dropdown>
      )}
    </React.Fragment>
  );
};

export default DownloadButton;
