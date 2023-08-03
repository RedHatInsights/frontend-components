import { Dropdown, DropdownItem, DropdownList, DropdownProps, MenuToggle, Tooltip } from '@patternfly/react-core';

import React, { useState } from 'react';

import { ExportIcon } from '@patternfly/react-icons';

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
  tooltipText,
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
            <MenuToggle variant="plain" ref={toggleRef} isExpanded={isOpen} onClick={() => setIsOpen((prev) => !prev)}>
              <ExportIcon />
            </MenuToggle>
          )}
          isOpen={isOpen}
          ouiaId="Export"
        >
          <DropdownList>
            <DropdownItem
              key="download-csv"
              ouiaId="DownloadCSV"
              component="button"
              onClick={(event) => onSelect(event, 'csv')}
              isDisabled={isDisabled}
            >
              Export to CSV
            </DropdownItem>
            ,
            <DropdownItem
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
