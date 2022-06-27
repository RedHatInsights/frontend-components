import { Dropdown, DropdownItem, DropdownProps, DropdownToggle, Tooltip } from '@patternfly/react-core';
import React, { useState } from 'react';

import { ExportIcon } from '@patternfly/react-icons';

export interface DownloadButtonProps extends Omit<DropdownProps, 'onSelect' | 'toggle' | 'dropdownItems'> {
  /**
   * Additional JSX elements rendered as dropdown options
   */
  extraItems?: React.ReactElement[];
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

  const onToggle = (isOpen: boolean) => setIsOpen(isOpen);

  const internalOnSelect = () => setIsOpen((prev) => !prev);

  const conditionallyTooltip = (children: React.ReactElement) => {
    return <React.Fragment>{tooltipText ? <Tooltip content={tooltipText}>{children}</Tooltip> : children}</React.Fragment>;
  };

  return (
    <React.Fragment>
      {conditionallyTooltip(
        <Dropdown
          isPlain
          {...props}
          onSelect={internalOnSelect}
          toggle={
            <DropdownToggle aria-label="Export" toggleIndicator={null} onToggle={onToggle} isDisabled={isDisabled} ouiaId="Export">
              <ExportIcon size="sm" />
            </DropdownToggle>
          }
          isOpen={isOpen}
          ouiaId="Export"
          dropdownItems={[
            <DropdownItem
              key="download-csv"
              ouiaId="DownloadCSV"
              component="button"
              onClick={(event) => onSelect(event, 'csv')}
              isDisabled={isDisabled}
            >
              Export to CSV
            </DropdownItem>,
            <DropdownItem
              key="download-json"
              ouiaId="DownloadJSON"
              component="button"
              onClick={(event) => onSelect(event, 'json')}
              isDisabled={isDisabled}
            >
              Export to JSON
            </DropdownItem>,
            ...extraItems,
          ]}
        />
      )}
    </React.Fragment>
  );
};

export default DownloadButton;
