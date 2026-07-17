import React, { useCallback, useEffect, useState } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import { TableView } from './TableView';
import { useTableState } from './hooks/useTableState';
import type { CursorLinks } from './hooks/useCursorPaginationState';
import { DefaultEmptyStateNoData, DefaultEmptyStateNoResults } from './components/TableViewEmptyState';
import type { CellRendererMap, ColumnConfigMap, ExpansionRendererMap, FilterConfig } from './types';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Dropdown, DropdownItem, DropdownList } from '@patternfly/react-core/dist/dynamic/components/Dropdown';
import { MenuToggle, MenuToggleElement } from '@patternfly/react-core/dist/dynamic/components/MenuToggle';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import EllipsisVIcon from '@patternfly/react-icons/dist/js/icons/ellipsis-v-icon';

// =============================================================================
// Test Helpers
// =============================================================================

function queryByOuiaId(root: HTMLElement, id: string): HTMLElement | null {
  return root.querySelector(`[data-ouia-component-id="${id}"]`);
}

function queryByDataTestId(root: HTMLElement, id: string): HTMLElement | null {
  return root.querySelector(`[data-testid="${id}"]`);
}

function queryCompactTable(root: HTMLElement): HTMLElement | null {
  return root.querySelector('.pf-m-compact');
}

function queryExpandedRow(root: HTMLElement): HTMLElement | null {
  return root.querySelector('tr.pf-m-expanded');
}

function queryPagination(root: HTMLElement): HTMLElement | null {
  return root.querySelector('.pf-v6-c-pagination');
}

function expectLoadingVisible(root: HTMLElement): void {
  expect(root.querySelectorAll('.pf-v6-c-skeleton, .ins-c-skeleton, [aria-label="Loading"]').length).toBeGreaterThan(0);
}

// =============================================================================
// Router Decorator
// =============================================================================

const withRouter: Decorator = (Story, context) => (
  <MemoryRouter initialEntries={context.parameters?.routerInitialEntries ?? ['/']}>
    <Story />
  </MemoryRouter>
);

// =============================================================================
// Mock Data Types
// =============================================================================

interface MockRole {
  uuid: string;
  name: string;
  display_name: string;
  description: string;
  system: boolean;
  platform_default: boolean;
  admin_default: boolean;
  created: string;
  modified: string;
  policyCount: number;
  accessCount: number;
  applications: string[];
}

interface MockPermission {
  permission: string;
  description: string;
}

interface MockCursorRole {
  id: string;
  name: string;
  description: string;
  permissions_count: number;
  last_modified: string;
}

// =============================================================================
// Mock Data Generators
// =============================================================================

function generateMockRoles(count: number): MockRole[] {
  const names = ['Administrator', 'Viewer', 'Editor', 'Auditor', 'Developer', 'Manager', 'Analyst', 'Support', 'Tester', 'Designer'];
  const descriptions = [
    'Full system access',
    'Read-only access',
    'Content management',
    'Audit and compliance',
    'Development access',
    'Team management',
    'Data analysis',
    'Customer support',
    'Quality assurance',
    'UI/UX design',
  ];

  const roles: MockRole[] = [];
  for (let i = 1; i <= count; i++) {
    const nameIdx = (i - 1) % names.length;
    roles.push({
      uuid: `role-${i}`,
      name: `role_${i}`,
      display_name: `${names[nameIdx]} ${Math.ceil(i / names.length)}`,
      description: descriptions[nameIdx],
      system: i === 4,
      platform_default: false,
      admin_default: false,
      created: new Date(Date.now() - ((i % 365) + 1) * 24 * 60 * 60 * 1000).toISOString(),
      modified: new Date(Date.now() - ((i % 365) + 1) * 24 * 60 * 60 * 1000).toISOString(),
      policyCount: 1,
      accessCount: (i % 20) + 1,
      applications: [],
    });
  }
  return roles;
}

function generateMockCursorRoles(count: number): MockCursorRole[] {
  const names = ['Administrator', 'Viewer', 'Editor', 'Auditor', 'Developer', 'Manager', 'Analyst', 'Support', 'Tester', 'Designer'];
  const descriptions = [
    'Full system access',
    'Read-only access',
    'Content management',
    'Audit and compliance',
    'Development access',
    'Team management',
    'Data analysis',
    'Customer support',
    'Quality assurance',
    'UI/UX design',
  ];

  const roles: MockCursorRole[] = [];
  for (let i = 1; i <= count; i++) {
    const nameIdx = (i - 1) % names.length;
    roles.push({
      id: `role-${i}`,
      name: `${names[nameIdx]} ${Math.ceil(i / names.length)}`,
      description: descriptions[nameIdx],
      permissions_count: (i % 20) + 1,
      last_modified: new Date(Date.now() - ((i % 365) + 1) * 24 * 60 * 60 * 1000).toISOString(),
    });
  }
  return roles;
}

const allMockRoles = generateMockRoles(50);
const allMockCursorRoles = generateMockCursorRoles(50);

// Mock permissions for expansion
const mockPermissions: Record<string, MockPermission[]> = {
  'role-1': [
    { permission: 'rbac:role:read', description: 'Read roles' },
    { permission: 'rbac:role:write', description: 'Write roles' },
    { permission: 'rbac:group:read', description: 'Read groups' },
  ],
  'role-2': [{ permission: 'rbac:role:read', description: 'Read roles' }],
  'role-3': [
    { permission: 'rbac:content:read', description: 'Read content' },
    { permission: 'rbac:content:write', description: 'Write content' },
  ],
};

// =============================================================================
// In-Memory API Simulation (replaces MSW + fetch)
// =============================================================================

interface ApiParams {
  offset: number;
  limit: number;
  orderBy?: string;
  filters: Record<string, string | string[]>;
}

interface ApiResponse<T> {
  data: T[];
  meta: { count: number; limit: number; offset: number };
}

async function simulateApi(allData: MockRole[], params: ApiParams, options?: { forceEmpty?: boolean }): Promise<ApiResponse<MockRole>> {
  await new Promise((resolve) => setTimeout(resolve, 50));

  if (options?.forceEmpty) {
    return { data: [], meta: { count: 0, limit: params.limit, offset: params.offset } };
  }

  let roles = [...allData];

  // Name filter
  const nameFilter = params.filters.name;
  if (nameFilter && typeof nameFilter === 'string' && nameFilter.trim()) {
    const term = nameFilter.toLowerCase();
    roles = roles.filter((r) => r.name.toLowerCase().includes(term) || r.display_name.toLowerCase().includes(term));
  }

  // Type filter (system/custom)
  const typeFilter = params.filters.type;
  if (Array.isArray(typeFilter) && typeFilter.length === 1) {
    if (typeFilter[0] === 'system') roles = roles.filter((r) => r.system);
    else if (typeFilter[0] === 'custom') roles = roles.filter((r) => !r.system);
  }

  // Sorting
  if (params.orderBy) {
    const desc = params.orderBy.startsWith('-');
    const field = (desc ? params.orderBy.slice(1) : params.orderBy) as keyof MockRole;
    roles = roles.sort((a, b) => {
      const aVal = String(a[field] ?? a.name);
      const bVal = String(b[field] ?? b.name);
      return desc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
    });
  }

  const count = roles.length;
  const paginatedRoles = roles.slice(params.offset, params.offset + params.limit);

  return {
    data: paginatedRoles,
    meta: { count, limit: params.limit, offset: params.offset },
  };
}

// =============================================================================
// Cursor API Simulation (for cursor pagination stories)
// =============================================================================

interface CursorApiResponse {
  data: MockCursorRole[];
  meta: { limit: number };
  links: CursorLinks;
}

async function simulateCursorApi(
  allData: MockCursorRole[],
  params: { limit: number; cursor?: string | null; orderBy?: string; filters: Record<string, string | string[]> },
): Promise<CursorApiResponse> {
  await new Promise((resolve) => setTimeout(resolve, 50));

  let roles = [...allData];

  const nameFilter = params.filters.name;
  if (nameFilter && typeof nameFilter === 'string' && nameFilter.trim()) {
    roles = roles.filter((r) => r.name.toLowerCase().includes(nameFilter.toLowerCase()));
  }

  if (params.orderBy) {
    const desc = params.orderBy.startsWith('-');
    const field = desc ? params.orderBy.slice(1) : params.orderBy;
    roles = roles.sort((a, b) => {
      const aVal = String(a[field as keyof MockCursorRole] ?? '');
      const bVal = String(b[field as keyof MockCursorRole] ?? '');
      return desc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
    });
  }

  const startIndex = params.cursor ? Math.max(0, parseInt(atob(params.cursor), 10) || 0) : 0;
  const paginatedRoles = roles.slice(startIndex, startIndex + params.limit);
  const nextIndex = startIndex + params.limit;
  const hasNext = nextIndex < roles.length;

  return {
    data: paginatedRoles,
    meta: { limit: params.limit },
    links: {
      next: hasNext ? `?limit=${params.limit}&cursor=${btoa(String(nextIndex))}` : null,
      previous: startIndex > 0 ? `?limit=${params.limit}&cursor=${btoa(String(Math.max(0, startIndex - params.limit)))}` : null,
    },
  };
}

// =============================================================================
// Column Definitions (Type-Safe)
// =============================================================================

const columns = ['name', 'description', 'permissions', 'modified'] as const;
const sortableColumns = ['name', 'modified'] as const;
type SortableColumnId = (typeof sortableColumns)[number];
type CompoundColumnId = 'permissions';

// Column config WITH expansion
const columnConfigWithExpansion: ColumnConfigMap<typeof columns> = {
  name: { label: 'Name', sortable: true },
  description: { label: 'Description' },
  permissions: { label: 'Permissions', isCompound: true },
  modified: { label: 'Last Modified', sortable: true },
};

// Column config WITHOUT expansion (permissions is NOT compound)
const columnConfigWithoutExpansion: ColumnConfigMap<typeof columns> = {
  name: { label: 'Name', sortable: true },
  description: { label: 'Description' },
  permissions: { label: 'Permissions', isCompound: false },
  modified: { label: 'Last Modified', sortable: true },
};

// =============================================================================
// Cell Renderers
// =============================================================================

const cellRenderers: CellRendererMap<typeof columns, MockRole> = {
  name: (row) => row.display_name,
  description: (row) => row.description || '—',
  permissions: (row) => row.accessCount,
  modified: (row) => new Date(row.modified).toLocaleDateString(),
};

const expansionRenderers: ExpansionRendererMap<CompoundColumnId, MockRole> = {
  permissions: (row) => {
    const permissions = mockPermissions[row.uuid] || [{ permission: 'No permissions defined', description: 'N/A' }];
    return (
      <div data-testid={`expanded-permissions-${row.uuid}`}>
        <Table aria-label={`Permissions for ${row.display_name}`} variant="compact">
          <Thead>
            <Tr>
              <Th>Permission</Th>
              <Th>Description</Th>
            </Tr>
          </Thead>
          <Tbody>
            {permissions.map((p) => (
              <Tr key={p.permission}>
                <Td dataLabel="Permission">{p.permission}</Td>
                <Td dataLabel="Description">{p.description}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    );
  },
};

// =============================================================================
// Filter Configuration
// =============================================================================

const filterConfig: FilterConfig[] = [
  { type: 'text', id: 'name', label: 'Name', placeholder: 'Filter by name...' },
  {
    type: 'checkbox',
    id: 'type',
    label: 'Type',
    options: [
      { id: 'custom', label: 'Custom' },
      { id: 'system', label: 'System' },
    ],
  },
];

// =============================================================================
// Row Actions Component
// =============================================================================

interface RoleActionsProps {
  role: MockRole;
  onEdit: (role: MockRole) => void;
  onDelete: (role: MockRole) => void;
}

const RoleActions: React.FC<RoleActionsProps> = ({ role, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dropdown
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          ref={toggleRef}
          aria-label={`Actions for ${role.display_name}`}
          variant="plain"
          onClick={() => setIsOpen(!isOpen)}
          isExpanded={isOpen}
        >
          <EllipsisVIcon />
        </MenuToggle>
      )}
    >
      <DropdownList>
        <DropdownItem
          key="edit"
          onClick={() => {
            setIsOpen(false);
            onEdit(role);
          }}
          isDisabled={role.system}
        >
          Edit
        </DropdownItem>
        <DropdownItem
          key="delete"
          onClick={() => {
            setIsOpen(false);
            onDelete(role);
          }}
          isDisabled={role.system}
        >
          Delete
        </DropdownItem>
      </DropdownList>
    </Dropdown>
  );
};

// =============================================================================
// Spies for Testing
// =============================================================================

// API call spy - tracks all "API" calls with parameters
const apiCallSpy = fn();

// Action spies
const onEditSpy = fn();
const onDeleteSpy = fn();
const onBulkDeleteSpy = fn();
const onCreateSpy = fn();

// =============================================================================
// Test Helpers - Reduce duplication in play functions
// =============================================================================

/**
 * Wait for initial data to load and return canvas.
 * Most play functions need to wait for data before interacting.
 */
async function waitForInitialLoad(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  await waitFor(() => {
    expect(canvas.queryByText('Administrator 1')).toBeInTheDocument();
  });
  return canvas;
}

/**
 * Apply a text filter to the name filter input.
 */
async function applyNameFilter(canvas: ReturnType<typeof within>, value: string) {
  const input = canvas.getByPlaceholderText(/filter by name/i);
  await userEvent.clear(input);
  await userEvent.type(input, value);
}

/**
 * Get the last API call parameters from the spy.
 */
function getLastApiCall(spy: ReturnType<typeof fn>) {
  const { calls } = spy.mock;
  return calls.length > 0 ? calls[calls.length - 1][0] : null;
}

/**
 * Click the "Clear filters" button.
 */
async function clickClearFilters(canvas: ReturnType<typeof within>) {
  const clearButtons = canvas.getAllByText('Clear filters');
  await userEvent.click(clearButtons[0]);
}

// =============================================================================
// Interactive Table Wrapper Component
// =============================================================================

interface InteractiveTableProps {
  initialLoading?: boolean;
  forceEmpty?: boolean;
  enableSelection?: boolean;
  enableExpansion?: boolean;
  /** If true, only allows expansion on rows that have permissions defined */
  conditionalExpansion?: boolean;
  enableActions?: boolean;
  enableFilters?: boolean;
  syncWithUrl?: boolean;
  variant?: 'default' | 'compact';
  ouiaId?: string;
  /** Custom empty state for no data - uses default if not provided */
  customEmptyStateNoData?: React.ReactNode;
  /** Custom empty state for no results - uses default if not provided */
  customEmptyStateNoResults?: React.ReactNode;
}

/**
 * Wrapper component that uses useTableState for proper state management.
 * Uses in-memory API simulation to demonstrate real-world usage patterns.
 */
const InteractiveTable: React.FC<InteractiveTableProps> = ({
  forceEmpty = false,
  enableSelection = true,
  enableExpansion = true,
  conditionalExpansion = false,
  enableActions = true,
  enableFilters = true,
  syncWithUrl = false,
  variant = 'default',
  ouiaId = 'interactive-table',
  customEmptyStateNoData,
  customEmptyStateNoResults,
}) => {
  // Data state - undefined means loading
  const [data, setData] = useState<MockRole[] | undefined>(undefined);
  const [totalCount, setTotalCount] = useState(0);

  // Choose column config based on expansion setting
  const columnConfig = enableExpansion ? columnConfigWithExpansion : columnConfigWithoutExpansion;

  // Fetch data from in-memory API - called by useTableState via onStaleData
  const handleStaleData = useCallback(
    async (apiParams: ApiParams) => {
      setData(undefined);
      try {
        const json = await simulateApi(allMockRoles, apiParams, { forceEmpty });
        // Spy call with shape matching what play functions assert
        apiCallSpy({
          limit: apiParams.limit,
          offset: apiParams.offset,
          orderBy: apiParams.orderBy ?? 'name',
          nameFilter: typeof apiParams.filters.name === 'string' ? apiParams.filters.name : '',
          typeFilter: Array.isArray(apiParams.filters.type)
            ? apiParams.filters.type.includes('system')
              ? 'system'
              : apiParams.filters.type.includes('custom')
                ? 'custom'
                : ''
            : '',
          forceEmpty,
        });
        setData(json.data);
        setTotalCount(json.meta.count);
      } catch (error) {
        setData([]);
        setTotalCount(0);
      }
    },
    [forceEmpty],
  );

  // Use the hook for all state management - onStaleData handles fetching automatically
  const tableState = useTableState<typeof columns, MockRole, SortableColumnId, CompoundColumnId>({
    columns,
    sortableColumns,
    compoundColumns: enableExpansion ? (['permissions'] as const) : ([] as const),
    initialSort: { column: 'name', direction: 'asc' },
    initialPerPage: 10,
    getRowId: (role) => role.uuid,
    isRowSelectable: (role) => !role.system,
    syncWithUrl,
    onStaleData: handleStaleData,
  });

  // Wrap clearAllFilters to immediately set loading state
  // This prevents a flash of "no data" empty state when clearing from "no results"
  const handleClearAllFilters = useCallback(() => {
    setData(undefined); // Show loading immediately
    tableState.clearAllFilters();
  }, [tableState]);

  // Bulk delete handler
  const handleBulkDelete = () => {
    onBulkDeleteSpy(tableState.selectedRows);
    // Clear selection after delete
    tableState.clearSelection();
  };

  return (
    <TableView
      // Column definitions
      columns={columns}
      columnConfig={columnConfig}
      sortableColumns={sortableColumns}
      // Data - undefined means loading, empty array means no data
      data={data}
      totalCount={totalCount}
      getRowId={(role) => role.uuid}
      // Renderers
      cellRenderers={cellRenderers}
      expansionRenderers={enableExpansion ? expansionRenderers : undefined}
      // Conditional expansion - only rows with permissions defined can expand
      isCellExpandable={
        conditionalExpansion
          ? (role) => {
              // Only allow expansion if the role has permissions defined
              return !!mockPermissions[role.uuid];
            }
          : undefined
      }
      // Filtering
      filterConfig={enableFilters ? filterConfig : undefined}
      // Selection
      selectable={enableSelection}
      isRowSelectable={(role) => !role.system}
      // Row actions
      renderActions={enableActions ? (role) => <RoleActions role={role} onEdit={onEditSpy} onDelete={onDeleteSpy} /> : undefined}
      // Toolbar
      toolbarActions={
        <Button variant="primary" onClick={() => onCreateSpy()}>
          Create role
        </Button>
      }
      bulkActions={
        tableState.selectedRows.length > 0 ? (
          <Button variant="secondary" onClick={handleBulkDelete}>
            Delete selected ({tableState.selectedRows.length})
          </Button>
        ) : undefined
      }
      // Empty states - pass custom ones if provided, otherwise use defaults
      emptyStateNoData={customEmptyStateNoData}
      emptyStateNoResults={customEmptyStateNoResults}
      // Config
      variant={variant}
      ouiaId={ouiaId}
      ariaLabel="Roles table"
      // Spread all state from hook, but override clearAllFilters with wrapped version
      {...tableState}
      clearAllFilters={handleClearAllFilters}
    />
  );
};

// =============================================================================
// Out of Range Page Test Component
// =============================================================================

/**
 * Component for testing out-of-range page clamping.
 * Expects to be rendered inside a MemoryRouter with initialEntries set to an out-of-range page.
 */
const OutOfRangePageTable: React.FC = () => {
  const [searchParams] = useSearchParams();

  const [data, setData] = useState<MockRole[] | undefined>(undefined);
  const [totalCount, setTotalCount] = useState(0);

  const handleStaleData = useCallback(async (apiParams: ApiParams) => {
    setData(undefined);
    try {
      const json = await simulateApi(allMockRoles, apiParams);
      setData(json.data);
      setTotalCount(json.meta.count);
    } catch (error) {
      setData([]);
      setTotalCount(0);
    }
  }, []);

  const tableState = useTableState<typeof columns, MockRole, SortableColumnId, CompoundColumnId>({
    columns,
    sortableColumns,
    compoundColumns: ['permissions'] as const,
    initialSort: { column: 'name', direction: 'asc' },
    initialPerPage: 10,
    getRowId: (role) => role.uuid,
    syncWithUrl: true,
    onStaleData: handleStaleData,
  });

  return (
    <div>
      <div
        data-testid="url-params"
        style={{
          marginBottom: '16px',
          padding: '8px',
          background: 'var(--pf-t--global--background--color--secondary--default)',
          fontFamily: 'monospace',
        }}
      >
        URL: ?{searchParams.toString() || '(empty)'}
      </div>
      <TableView
        columns={columns}
        columnConfig={columnConfigWithExpansion}
        sortableColumns={sortableColumns}
        data={data}
        totalCount={totalCount}
        getRowId={(role) => role.uuid}
        cellRenderers={cellRenderers}
        expansionRenderers={expansionRenderers}
        ariaLabel="Out of range page test table"
        ouiaId="out-of-range-table"
        {...tableState}
      />
    </div>
  );
};

// =============================================================================
// URL Sync Test Component
// =============================================================================

interface UrlSyncTableProps {
  ouiaId?: string;
}

/**
 * Component that syncs state with URL for testing URL parameters.
 */
const UrlSyncTable: React.FC<UrlSyncTableProps> = ({ ouiaId = 'url-sync-table' }) => {
  const [searchParams] = useSearchParams();

  // Data state - undefined means loading
  const [data, setData] = useState<MockRole[] | undefined>(undefined);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch data from in-memory API - called by useTableState via onStaleData
  const handleStaleData = useCallback(async (apiParams: ApiParams) => {
    setData(undefined);
    try {
      const json = await simulateApi(allMockRoles, apiParams);
      apiCallSpy({
        limit: apiParams.limit,
        offset: apiParams.offset,
        orderBy: apiParams.orderBy ?? 'name',
        nameFilter: typeof apiParams.filters.name === 'string' ? apiParams.filters.name : '',
        typeFilter: Array.isArray(apiParams.filters.type)
          ? apiParams.filters.type.includes('system')
            ? 'system'
            : apiParams.filters.type.includes('custom')
              ? 'custom'
              : ''
          : '',
      });
      setData(json.data);
      setTotalCount(json.meta.count);
    } catch (error) {
      setData([]);
      setTotalCount(0);
    }
  }, []);

  // Use the hook with URL sync enabled - onStaleData handles fetching automatically
  const tableState = useTableState<typeof columns, MockRole, SortableColumnId, CompoundColumnId>({
    columns,
    sortableColumns,
    compoundColumns: ['permissions'] as const,
    initialSort: { column: 'name', direction: 'asc' },
    initialPerPage: 10,
    getRowId: (role) => role.uuid,
    isRowSelectable: (role) => !role.system,
    syncWithUrl: true, // Enable URL sync
    onStaleData: handleStaleData,
  });

  // Track URL params for testing
  useEffect(() => {
    apiCallSpy({
      urlParams: Object.fromEntries(searchParams.entries()),
      page: tableState.page,
      perPage: tableState.perPage,
      sort: tableState.sort,
      filters: tableState.filters,
    });
  }, [searchParams, tableState.page, tableState.perPage, tableState.sort, tableState.filters]);

  return (
    <div>
      {/* Debug: Show current URL params */}
      <div
        data-testid="url-params"
        style={{
          marginBottom: '16px',
          padding: '8px',
          background: 'var(--pf-t--global--background--color--secondary--default)',
          fontFamily: 'monospace',
        }}
      >
        URL: ?{searchParams.toString() || '(empty)'}
      </div>
      <TableView
        columns={columns}
        columnConfig={columnConfigWithExpansion}
        sortableColumns={sortableColumns}
        data={data}
        totalCount={totalCount}
        getRowId={(role) => role.uuid}
        cellRenderers={cellRenderers}
        expansionRenderers={expansionRenderers}
        filterConfig={filterConfig}
        selectable
        isRowSelectable={(role) => !role.system}
        variant="default"
        ouiaId={ouiaId}
        ariaLabel="URL Sync Test Table"
        {...tableState}
      />
    </div>
  );
};

// =============================================================================
// Initial Selection Test Component
// =============================================================================

interface InitialSelectionTableProps {
  ouiaId?: string;
}

/**
 * Component that demonstrates useTableState with initialSelectedRows.
 */
const InitialSelectionTable: React.FC<InitialSelectionTableProps> = ({ ouiaId = 'initial-selection-table' }) => {
  const [data, setData] = useState<MockRole[] | undefined>(undefined);
  const [totalCount, setTotalCount] = useState(0);

  // Pre-select first two roles
  const initialSelectedRows = [allMockRoles[0], allMockRoles[1]];

  const handleStaleData = useCallback(async (apiParams: ApiParams) => {
    setData(undefined);
    try {
      const json = await simulateApi(allMockRoles, apiParams);
      setData(json.data);
      setTotalCount(json.meta.count);
    } catch (error) {
      setData([]);
      setTotalCount(0);
    }
  }, []);

  const tableState = useTableState<typeof columns, MockRole, SortableColumnId, CompoundColumnId>({
    columns,
    sortableColumns,
    compoundColumns: ['permissions'] as const,
    initialSort: { column: 'name', direction: 'asc' },
    initialPerPage: 10,
    getRowId: (role) => role.uuid,
    isRowSelectable: (role) => !role.system,
    initialSelectedRows,
    onStaleData: handleStaleData,
  });

  return (
    <TableView
      columns={columns}
      columnConfig={columnConfigWithExpansion}
      sortableColumns={sortableColumns}
      data={data}
      totalCount={totalCount}
      getRowId={(role) => role.uuid}
      cellRenderers={cellRenderers}
      expansionRenderers={expansionRenderers}
      ariaLabel="Roles table with initial selection"
      ouiaId={ouiaId}
      selectable
      bulkActions={
        tableState.selectedRows.length > 0 ? (
          <Button variant="secondary" onClick={() => tableState.clearSelection()}>
            Clear selection ({tableState.selectedRows.length})
          </Button>
        ) : undefined
      }
      {...tableState}
    />
  );
};

// =============================================================================
// Cursor Pagination Table Wrapper Component
// =============================================================================

const cursorApiCallSpy = fn();

const cursorCellRenderers: CellRendererMap<typeof columns, MockCursorRole> = {
  name: (row) => row.name ?? '—',
  description: (row) => row.description ?? '—',
  permissions: (row) => row.permissions_count ?? 0,
  modified: (row) => (row.last_modified ? new Date(row.last_modified).toLocaleDateString() : '—'),
};

interface CursorPaginatedTableProps {
  ouiaId?: string;
  enableFilters?: boolean;
}

/**
 * Wrapper component that uses useTableState in cursor mode.
 * Uses in-memory cursor API simulation.
 */
const CursorPaginatedTable: React.FC<CursorPaginatedTableProps> = ({ ouiaId = 'cursor-paginated-table', enableFilters = true }) => {
  const [data, setData] = useState<MockCursorRole[] | undefined>(undefined);

  const tableState = useTableState<typeof columns, MockCursorRole, SortableColumnId, never>({
    columns,
    sortableColumns,
    initialSort: { column: 'name', direction: 'asc' },
    initialPerPage: 10,
    getRowId: (role) => role.id ?? '',
    paginationMode: 'cursor',
  });

  const fetchData = useCallback(async () => {
    setData(undefined);
    try {
      const json = await simulateCursorApi(allMockCursorRoles, {
        limit: tableState.apiParams.limit,
        cursor: tableState.apiParams.cursor,
        orderBy: tableState.apiParams.orderBy,
        filters: tableState.apiParams.filters,
      });

      // Spy call for cursor pagination tests
      const cursorParam = tableState.apiParams.cursor ?? null;
      let offset = 0;
      if (cursorParam) {
        try {
          offset = parseInt(atob(cursorParam), 10) || 0;
        } catch {
          offset = 0;
        }
      }
      const nameFilter = tableState.apiParams.filters.name;
      cursorApiCallSpy({
        limit: tableState.apiParams.limit,
        cursor: cursorParam,
        offset,
        orderBy: tableState.apiParams.orderBy ?? 'name',
        nameFilter: typeof nameFilter === 'string' ? nameFilter : '',
      });

      setData(json.data);
      tableState.cursorMeta?.setCursorLinks(json.links);
    } catch (error) {
      setData([]);
    }
  }, [
    tableState.apiParams.limit,
    tableState.apiParams.cursor,
    tableState.apiParams.orderBy,
    tableState.apiParams.filters,
    tableState.cursorMeta?.setCursorLinks,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <TableView
      columns={columns}
      columnConfig={columnConfigWithoutExpansion}
      sortableColumns={sortableColumns}
      data={data}
      getRowId={(role) => role.id ?? ''}
      cellRenderers={cursorCellRenderers}
      filterConfig={enableFilters ? [filterConfig[0]] : undefined}
      variant="default"
      ouiaId={ouiaId}
      ariaLabel="Cursor-paginated roles table"
      {...tableState}
    />
  );
};

// =============================================================================
// Loading Story Component (never resolves data)
// =============================================================================

const NeverLoadingTable: React.FC = () => {
  const tableState = useTableState<typeof columns, MockRole, SortableColumnId, CompoundColumnId>({
    columns,
    sortableColumns,
    compoundColumns: ['permissions'] as const,
    initialSort: { column: 'name', direction: 'asc' },
    initialPerPage: 10,
    getRowId: (role) => role.uuid,
  });

  return (
    <TableView
      columns={columns}
      columnConfig={columnConfigWithExpansion}
      sortableColumns={sortableColumns}
      data={undefined}
      totalCount={0}
      getRowId={(role) => role.uuid}
      cellRenderers={cellRenderers}
      ariaLabel="Loading table"
      ouiaId="loading-table"
      {...tableState}
    />
  );
};

// =============================================================================
// Story Meta
// =============================================================================

const meta: Meta<typeof InteractiveTable> = {
  title: 'Components/TableView',
  component: InteractiveTable,
  tags: ['table-view'],
  parameters: {
    docs: {
      description: {
        component: `
# TableView Component

A unified, type-safe table component that handles:

- **Columns**: Defined as \`const\` tuples for extreme TypeScript safety
- **Filtering**: Decoupled from columns - supports text and checkbox filters
- **Sorting**: Strongly typed to sortable columns only
- **Pagination**: Page and per-page controls with URL sync
- **Selection**: Row checkboxes with bulk actions
- **Compound Expansion**: Click cells to expand with nested content
- **Row Actions**: Per-row action menus
- **URL Sync**: Optional state persistence to URL query params

## API Integration

Stories use in-memory simulation functions to model a real API. The component
receives data with parameters for:
- \`limit\` and \`offset\` for pagination
- \`orderBy\` for sorting (prefix with \`-\` for descending)
- \`filters.name\` for text filtering
- \`filters.type\` for checkbox filtering

## Usage

\`\`\`typescript
const columns = ['name', 'description', 'permissions'] as const;
const sortableColumns = ['name'] as const;

const tableState = useTableState({
  columns,
  sortableColumns,
  compoundColumns: ['permissions'],
  getRowId: (r) => r.uuid,
  syncWithUrl: true,
});

// Fetch data using tableState.apiParams
const { data, totalCount } = await fetchRoles(tableState.apiParams);

<TableView
  columns={columns}
  columnConfig={columnConfig}
  data={data}
  totalCount={totalCount}
  cellRenderers={cellRenderers}
  expansionRenderers={expansionRenderers}
  {...tableState}
/>
\`\`\`
        `,
      },
    },
  },
  decorators: [withRouter],
  // Reset spies before each story
  beforeEach: () => {
    apiCallSpy.mockClear();
    onEditSpy.mockClear();
    onDeleteSpy.mockClear();
    onBulkDeleteSpy.mockClear();
    onCreateSpy.mockClear();
  },
};

export default meta;
type Story = StoryObj<typeof InteractiveTable>;

// =============================================================================
// BASIC STORIES
// =============================================================================

/**
 * Default interactive table with all features enabled.
 * Try: sorting columns, filtering by name, selecting rows, expanding permissions.
 */
export const Default: Story = {
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story: `
# TableView Component

A high-level table component that handles pagination, sorting, filtering, selection,
compound expansion, and row actions with full TypeScript safety.

## Basic Usage

\`\`\`tsx
import { TableView, useTableState } from '@redhat-cloud-services/frontend-components/TableView';

const columns = ['name', 'description', 'modified'] as const;

const MyTable = () => {
  const tableState = useTableState({
    columns,
    getRowId: (row) => row.id,
    syncWithUrl: true,
    onStaleData: (params) => fetchData(params),
  });

  return (
    <TableView
      {...tableState}
      columns={columns}
      columnConfig={{
        name: { label: 'Name' },
        description: { label: 'Description' },
        modified: { label: 'Modified' },
      }}
      data={data}
      totalCount={totalCount}
      getRowId={(row) => row.id}
      cellRenderers={{
        name: (row) => row.name,
        description: (row) => row.description,
        modified: (row) => <DateFormat date={row.modified} />,
      }}
      ariaLabel="My Table"
    />
  );
};
\`\`\`

## Features

### Sorting
Add \`sortableColumns\` prop and configure columns with \`sortable: true\`:
\`\`\`tsx
const sortableColumns = ['name', 'modified'] as const;
<TableView sortableColumns={sortableColumns} ... />
\`\`\`

### Filtering
Use \`filterConfig\` to define filters (decoupled from columns):
\`\`\`tsx
<TableView
  filterConfig={[
    { id: 'name', label: 'Name', type: 'text', placeholder: 'Filter by name...' },
    { id: 'type', label: 'Type', type: 'checkbox', options: [
      { value: 'system', label: 'System' },
      { value: 'custom', label: 'Custom' },
    ]},
  ]}
/>
\`\`\`

### Selection
Enable with \`selectable\` prop. Use \`isRowSelectable\` for conditional selection:
\`\`\`tsx
<TableView
  selectable
  isRowSelectable={(row) => !row.system}
  bulkActions={<Button onClick={() => handleBulkDelete(tableState.selectedRows)}>Delete</Button>}
/>
\`\`\`

### Compound Expansion
Define \`compoundColumns\` and provide \`expansionRenderers\`:
\`\`\`tsx
const compoundColumns = ['permissions'] as const;
<TableView
  compoundColumns={compoundColumns}
  expansionRenderers={{
    permissions: (row) => <PermissionsTable roleId={row.id} />,
  }}
/>
\`\`\`

### Custom Empty States
Override default empty states with custom components:
\`\`\`tsx
<TableView
  emptyStateNoData={<DefaultEmptyStateNoData title="No items yet" />}
  emptyStateNoResults={
    <DefaultEmptyStateNoResults
      title="No results"
      onClearFilters={tableState.clearAllFilters}
    />
  }
/>
\`\`\`

## Related Stories
- **Sorting**: SortingInteraction
- **Filtering**: TextFilteringWithClear, MultipleFiltersWithChips
- **Selection**: SelectionWithBulkDelete
- **Expansion**: CompoundExpansion, ConditionalExpansion
- **Empty States**: CustomEmptyStateNoData, CustomEmptyStateNoResults
- **URL Sync**: URLSynchronization
        `,
      },
    },
  },
  args: {
    enableSelection: true,
    enableExpansion: true,
    enableActions: true,
    enableFilters: true,
    variant: 'default',
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify', async () => {
      const canvas = within(canvasElement);

      await waitFor(() => {
        expect(canvas.queryByText('Administrator 1')).toBeInTheDocument();
      });

      // Verify toolbar actions
      expect(canvas.getByText('Create role')).toBeInTheDocument();
    });
  },
};

/**
 * Compact variant for denser tables.
 */
export const CompactVariant: Story = {
  args: {
    variant: 'compact',
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify', async () => {
      const canvas = within(canvasElement);

      await waitFor(() => {
        expect(canvas.queryByText('Administrator 1')).toBeInTheDocument();
      });

      // Verify compact class is applied
      const table = queryCompactTable(canvasElement);
      expect(table).toBeInTheDocument();
    });
  },
};

/**
 * Loading state shows skeleton while data is being fetched.
 * Uses a dedicated component that never resolves data to keep the table in loading state.
 */
export const Loading: StoryObj<typeof NeverLoadingTable> = {
  render: () => <NeverLoadingTable />,
  play: async ({ canvasElement, step }) => {
    await step('Verify', async () => {
      expectLoadingVisible(canvasElement);
    });
  },
};

/**
 * Default empty state when there's no data.
 * Uses the built-in default empty state component.
 */
export const DefaultEmptyState: Story = {
  args: {
    forceEmpty: true,
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify', async () => {
      const canvas = within(canvasElement);

      await waitFor(() => {
        // Default empty state shows "No data available"
        expect(canvas.queryByText('No data available')).toBeInTheDocument();
        expect(canvas.queryByText(/There is no data to display/)).toBeInTheDocument();
      });
    });
  },
};

/**
 * Custom empty state for no data using DefaultEmptyStateNoData component.
 * Demonstrates using the exported component with custom title/body props.
 */
export const CustomEmptyStateNoData: Story = {
  args: {
    forceEmpty: true,
    customEmptyStateNoData: <DefaultEmptyStateNoData title="No roles configured yet" body="Create your first role to start managing permissions." />,
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify', async () => {
      const canvas = within(canvasElement);

      await waitFor(() => {
        expect(canvas.queryByText('No roles configured yet')).toBeInTheDocument();
        expect(canvas.queryByText('Create your first role to start managing permissions.')).toBeInTheDocument();
      });
    });
  },
};

/**
 * Custom empty state for no search results using DefaultEmptyStateNoResults.
 * Note: The "Clear filters" button won't appear here because onClearFilters isn't passed
 * (Storybook args are static). In real usage, pass tableState.clearAllFilters to enable it.
 * If you don't provide a custom emptyStateNoResults, TableView automatically wires the button.
 */
export const CustomEmptyStateNoResults: Story = {
  args: {
    customEmptyStateNoResults: (
      <DefaultEmptyStateNoResults title="No matching roles found" body="Try adjusting your search criteria or removing some filters." />
    ),
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify', async () => {
      const canvas = within(canvasElement);

      await waitFor(() => {
        expect(canvas.queryByText('Administrator 1')).toBeInTheDocument();
      });

      // Type a filter that will return no results
      const filterInput = canvas.getByPlaceholderText(/filter by name/i);
      await userEvent.type(filterInput, 'nonexistent12345');

      // Verify custom empty state appears
      await waitFor(() => {
        expect(canvas.queryByText('No matching roles found')).toBeInTheDocument();
      });
    });
  },
};

/**
 * Fully custom empty state with action button.
 * Demonstrates using DefaultEmptyStateNoData with a custom action handler.
 */
export const CustomEmptyStateWithAction: Story = {
  args: {
    forceEmpty: true,
    customEmptyStateNoData: (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h3>Get started with roles</h3>
        <p style={{ marginBottom: '16px' }}>Roles let you define what users can do in your application.</p>
        <Button variant="primary" onClick={onCreateSpy}>
          Create your first role
        </Button>
      </div>
    ),
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify', async () => {
      const canvas = within(canvasElement);

      await waitFor(() => {
        expect(canvas.queryByText('Get started with roles')).toBeInTheDocument();
      });

      // Click the action button
      const createButton = canvas.getByRole('button', { name: /create your first role/i });
      await userEvent.click(createButton);

      expect(onCreateSpy).toHaveBeenCalled();
    });
  },
};

// =============================================================================
// SELECTION & BULK ACTIONS STORIES
// =============================================================================

/**
 * Selection with bulk delete action.
 * Tests: selecting rows, bulk actions appearing, onBulkDelete callback with correct row data.
 */
export const SelectionWithBulkDelete: Story = {
  args: {
    enableSelection: true,
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify', async () => {
      const canvas = within(canvasElement);

      await waitFor(() => {
        expect(canvas.queryByText('Administrator 1')).toBeInTheDocument();
      });

      // Clear spies
      onBulkDeleteSpy.mockClear();

      // Find row checkboxes (skip bulk select which is first)
      const checkboxes = canvas.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(1);

      // Select first two rows
      await userEvent.click(checkboxes[1]);
      await userEvent.click(checkboxes[2]);

      // Should see bulk delete button
      await waitFor(() => {
        expect(canvas.queryByText(/Delete selected \(2\)/)).toBeInTheDocument();
      });

      // Click bulk delete
      const deleteButton = canvas.getByText(/Delete selected/);
      await userEvent.click(deleteButton);

      // Verify callback was called with correct selected rows data
      await waitFor(() => {
        expect(onBulkDeleteSpy).toHaveBeenCalledTimes(1);
        const selectedRows = onBulkDeleteSpy.mock.calls[0][0];
        expect(selectedRows).toHaveLength(2);

        selectedRows.forEach((row: MockRole) => {
          expect(row).toHaveProperty('uuid');
          expect(row).toHaveProperty('display_name');
          expect(row).toHaveProperty('description');
          expect(row).toHaveProperty('accessCount');
          expect(row.uuid).toMatch(/^role-\d+$/);
        });
      });
    });
  },
};

/**
 * Bulk select respects isRowSelectable.
 * Uses a minimal static-data component to verify that handleBulkSelect
 * filters out non-selectable rows before calling onSelectAll.
 */

interface SimpleItem {
  id: string;
  name: string;
  system: boolean;
}

const bulkSelectItems: SimpleItem[] = [
  { id: '1', name: 'Custom Role A', system: false },
  { id: '2', name: 'System Role B', system: true },
  { id: '3', name: 'Custom Role C', system: false },
  { id: '4', name: 'System Role D', system: true },
  { id: '5', name: 'Custom Role E', system: false },
];

const bulkSelectColumns = ['name'] as const;
const bulkSelectColumnConfig: ColumnConfigMap<typeof bulkSelectColumns> = {
  name: { label: 'Name' },
};
const bulkSelectCellRenderers: CellRendererMap<typeof bulkSelectColumns, SimpleItem> = {
  name: (row) => row.name,
};

const BulkSelectIsRowSelectableTable: React.FC = () => {
  const tableState = useTableState<typeof bulkSelectColumns, SimpleItem>({
    columns: bulkSelectColumns,
    getRowId: (row) => row.id,
    isRowSelectable: (row) => !row.system,
    initialPerPage: 10,
  });

  return (
    <TableView
      columns={bulkSelectColumns}
      columnConfig={bulkSelectColumnConfig}
      data={bulkSelectItems}
      totalCount={bulkSelectItems.length}
      getRowId={(row) => row.id}
      cellRenderers={bulkSelectCellRenderers}
      selectable
      isRowSelectable={(row) => !row.system}
      ariaLabel="Bulk select test table"
      ouiaId="BulkSelectTest"
      bulkActions={
        tableState.selectedRows.length > 0 ? (
          <>
            <span data-testid="selected-count">Selected: {tableState.selectedRows.length}</span>
            <span data-testid="selected-ids">{tableState.selectedRows.map((row) => row.id).join(',')}</span>
            <span data-testid="selected-names">{tableState.selectedRows.map((row) => row.name).join(',')}</span>
          </>
        ) : undefined
      }
      {...tableState}
    />
  );
};

export const BulkSelectRespectsIsRowSelectable: StoryObj<typeof BulkSelectIsRowSelectableTable> = {
  render: () => <BulkSelectIsRowSelectableTable />,
  play: async ({ canvasElement, step }) => {
    await step('Verify bulk select skips non-selectable rows', async () => {
      const canvas = within(canvasElement);

      // Wait for data to render
      await waitFor(() => {
        expect(canvas.queryByText('Custom Role A')).toBeInTheDocument();
      });

      // 5 rows total, 3 selectable (non-system), 2 non-selectable (system)
      // Non-selectable rows render no checkbox -> only 4 checkboxes: 1 bulk + 3 rows
      const checkboxes = canvas.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(4); // 1 bulk select + 3 selectable rows

      const bulkSelectCheckbox = checkboxes[0];

      // Click bulk select to select all on page
      await userEvent.click(bulkSelectCheckbox);

      // Should show selected count = 3 (only non-system rows)
      await waitFor(() => {
        expect(canvas.queryByTestId('selected-count')).toHaveTextContent('Selected: 3');
      });

      // Verify the actual selectedRows contains only non-system rows (by ID and name)
      const selectedIds = canvas.getByTestId('selected-ids');
      expect(selectedIds).toHaveTextContent('1,3,5');
      // Verify system role IDs are NOT in the selection
      expect(selectedIds.textContent).not.toContain('2');
      expect(selectedIds.textContent).not.toContain('4');

      const selectedNames = canvas.getByTestId('selected-names');
      expect(selectedNames).toHaveTextContent('Custom Role A,Custom Role C,Custom Role E');
      // Verify system roles are NOT in the selection
      expect(selectedNames.textContent).not.toContain('System Role B');
      expect(selectedNames.textContent).not.toContain('System Role D');

      // All row checkboxes should be checked
      expect(checkboxes[1]).toBeChecked();
      expect(checkboxes[2]).toBeChecked();
      expect(checkboxes[3]).toBeChecked();

      // Deselect all
      await userEvent.click(bulkSelectCheckbox);

      // Selected count should disappear
      await waitFor(() => {
        expect(canvas.queryByTestId('selected-count')).not.toBeInTheDocument();
      });

      // All row checkboxes should be unchecked
      expect(checkboxes[1]).not.toBeChecked();
      expect(checkboxes[2]).not.toBeChecked();
      expect(checkboxes[3]).not.toBeChecked();
    });
  },
};

/**
 * Table without selection feature.
 */
export const NoSelection: Story = {
  args: {
    enableSelection: false,
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify', async () => {
      const canvas = within(canvasElement);

      await waitFor(() => {
        expect(canvas.queryByText('Administrator 1')).toBeInTheDocument();
      });

      // Should not have checkboxes
      const checkboxes = canvas.queryAllByRole('checkbox');
      expect(checkboxes.length).toBe(0);
    });
  },
};

// =============================================================================
// ROW ACTIONS STORIES
// =============================================================================

/**
 * Row actions with edit/delete callbacks.
 * Tests: clicking actions triggers callbacks with correct row data.
 */
export const RowActionsWithCallbacks: Story = {
  args: {},
  play: async ({ canvasElement, step }) => {
    await step('Verify', async () => {
      const canvas = within(canvasElement);

      await waitFor(() => {
        expect(canvas.queryByText('Administrator 1')).toBeInTheDocument();
      });

      // Clear spies
      onEditSpy.mockClear();
      onDeleteSpy.mockClear();

      // Find and click actions menu for first row
      const actionsToggle = canvas.getByLabelText('Actions for Administrator 1');
      await userEvent.click(actionsToggle);

      // Click Edit
      await waitFor(() => {
        expect(within(document.body).queryByText('Edit')).toBeInTheDocument();
      });
      await userEvent.click(within(document.body).getByText('Edit'));

      // Verify edit callback was called with correct role data
      await waitFor(() => {
        expect(onEditSpy).toHaveBeenCalledTimes(1);
        const editedRole = onEditSpy.mock.calls[0][0];
        // Verify the full role object structure
        expect(editedRole).toMatchObject({
          uuid: 'role-1',
          display_name: 'Administrator 1',
          description: 'Full system access',
        });
        expect(editedRole.accessCount).toBeGreaterThan(0);
        expect(editedRole.modified).toBeDefined();
      });

      // Open menu again and click Delete
      await userEvent.click(actionsToggle);
      await waitFor(() => {
        expect(within(document.body).queryByText('Delete')).toBeInTheDocument();
      });
      await userEvent.click(within(document.body).getByText('Delete'));

      // Verify delete callback was called with correct role data
      await waitFor(() => {
        expect(onDeleteSpy).toHaveBeenCalledTimes(1);
        const deletedRole = onDeleteSpy.mock.calls[0][0];
        // Verify the full role object structure
        expect(deletedRole).toMatchObject({
          uuid: 'role-1',
          display_name: 'Administrator 1',
          description: 'Full system access',
        });
        expect(deletedRole.accessCount).toBeGreaterThan(0);
        expect(deletedRole.modified).toBeDefined();
      });
    });
  },
};

/**
 * Table without row actions.
 */
export const NoActions: Story = {
  args: {
    enableActions: false,
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify', async () => {
      const canvas = within(canvasElement);

      await waitFor(() => {
        expect(canvas.queryByText('Administrator 1')).toBeInTheDocument();
      });

      const actionsToggle = canvas.queryByLabelText(/Actions for/);
      expect(actionsToggle).toBeNull();
    });
  },
};

/**
 * Toolbar actions with Create button callback.
 * Tests: clicking toolbar action button triggers callback.
 */
export const ToolbarActionsCallback: Story = {
  args: {},
  play: async ({ canvasElement, step }) => {
    await step('Verify', async () => {
      const canvas = within(canvasElement);

      await waitFor(() => {
        expect(canvas.queryByText('Administrator 1')).toBeInTheDocument();
      });

      // Clear the spy
      onCreateSpy.mockClear();

      // Find and click the Create button
      const createButton = canvas.getByText('Create role');
      expect(createButton).toBeInTheDocument();
      await userEvent.click(createButton);

      // Verify callback was triggered
      await waitFor(() => {
        expect(onCreateSpy).toHaveBeenCalledTimes(1);
      });
    });
  },
};

// =============================================================================
// FILTERING STORIES
// =============================================================================

/**
 * Text filtering with clear all.
 * Tests: filtering updates API params, clear filters resets them.
 */
export const TextFilteringWithClear: Story = {
  args: {},
  play: async ({ canvasElement, step }) => {
    await step('Verify', async () => {
      const canvas = await waitForInitialLoad(canvasElement);
      apiCallSpy.mockClear();

      // Apply filter using helper
      await applyNameFilter(canvas, 'Admin');

      // Verify API was called with filter parameter
      await waitFor(() => {
        const lastCall = getLastApiCall(apiCallSpy);
        expect(lastCall?.nameFilter).toContain('Admin');
        expect(lastCall?.offset).toBe(0);
      });

      // Clear filters using helper
      await clickClearFilters(canvas);

      // Verify API was called with cleared filter
      await waitFor(() => {
        const lastCall = getLastApiCall(apiCallSpy);
        expect(lastCall?.nameFilter).toBe('');
      });
    });
  },
};

/**
 * Multiple filters (text + checkbox) with chips.
 * Tests: applying text filter, switching filter type, and applying checkbox filter.
 */
export const MultipleFiltersWithChips: Story = {
  args: {},
  play: async ({ canvasElement, step }) => {
    await step('Verify', async () => {
      const canvas = within(canvasElement);

      await waitFor(() => {
        expect(canvas.queryByText('Administrator 1')).toBeInTheDocument();
      });

      apiCallSpy.mockClear();

      // 1. Apply name filter (text filter)
      const filterInput = canvas.getByPlaceholderText(/filter by name/i);
      await userEvent.type(filterInput, 'Admin');

      // Verify name filter was sent to API (wait for debounce)
      await waitFor(() => {
        const { calls } = apiCallSpy.mock;
        expect(calls.length).toBeGreaterThan(0);
        const filterCall = calls.find((c) => c[0].nameFilter?.includes('Admin'));
        expect(filterCall).toBeDefined();
      });

      // 2. Switch to Type filter - find the filter type toggle within DataViewFilters
      // The toggle is a MenuToggle button that shows the current filter type (initially "Name")
      const filterContainer = queryByOuiaId(canvasElement, 'DataViewFilters');
      expect(filterContainer).toBeTruthy();
      const filterCanvas = within(filterContainer as HTMLElement);

      // Find the filter type dropdown button (it shows "Name" as current selection)
      const filterTypeButtons = filterCanvas.getAllByRole('button');
      // The first MenuToggle with text content is the filter type selector
      const filterDropdownButton = filterTypeButtons.find((btn) => btn.textContent?.includes('Name'));
      expect(filterDropdownButton).toBeTruthy();
      await userEvent.click(filterDropdownButton!);

      // Wait for dropdown menu and select "Type" option
      const typeOption = await within(document.body).findByRole('menuitem', { name: /Type/i });
      await userEvent.click(typeOption);

      // 3. Now interact with the Type filter checkbox dropdown
      // The checkbox filter toggle has a specific OUIA ID
      const typeFilterToggle = queryByOuiaId(canvasElement, 'DataViewCheckboxFilter-toggle');
      expect(typeFilterToggle).toBeTruthy();
      await userEvent.click(typeFilterToggle!);

      // Select "Custom" checkbox option from the dropdown
      const customMenuItem = await within(document.body).findByRole('menuitem', { name: /Custom/i });
      const customCheckbox = within(customMenuItem).getByRole('checkbox');

      apiCallSpy.mockClear();
      await userEvent.click(customCheckbox);

      // Verify both filters are sent to API
      await waitFor(() => {
        const { calls } = apiCallSpy.mock;
        expect(calls.length).toBeGreaterThan(0);
        const filterCall = calls.find((c) => c[0].nameFilter?.includes('Admin') && c[0].typeFilter?.includes('custom'));
        expect(filterCall).toBeDefined();
      });
    });
  },
};

/**
 * Clear all filters button test.
 * Tests the default empty state with "Clear all filters" link.
 */
export const ClearAllFilters: Story = {
  args: {},
  play: async ({ canvasElement, step }) => {
    await step('Verify', async () => {
      const canvas = within(canvasElement);

      await waitFor(
        () => {
          expect(canvas.queryByText('Administrator 1')).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      // Apply a filter that returns no results
      const filterInput = canvas.getByPlaceholderText(/filter by name/i);
      await userEvent.type(filterInput, 'nonexistent12345');

      // Should see default empty state with clear filters option
      await waitFor(
        () => {
          expect(canvas.queryByText('No results found')).toBeInTheDocument();
          expect(canvas.queryByText('Clear all filters')).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      // Click clear all filters
      await userEvent.click(canvas.getByText('Clear all filters'));

      // Should see data again
      await waitFor(
        () => {
          expect(canvas.queryByText('Administrator 1')).toBeInTheDocument();
        },
        { timeout: 5000 },
      );
    });
  },
};

/**
 * Table without filters.
 */
export const NoFilters: Story = {
  args: {
    enableFilters: false,
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify', async () => {
      const canvas = within(canvasElement);

      await waitFor(() => {
        expect(canvas.queryByText('Administrator 1')).toBeInTheDocument();
      });

      const filterInput = canvas.queryByPlaceholderText(/filter/i);
      expect(filterInput).toBeNull();
    });
  },
};

// =============================================================================
// PAGINATION STORIES
// =============================================================================

/**
 * Pagination resets to page 1 when filter changes.
 */
export const PaginationResetsOnFilterChange: Story = {
  args: {},
  play: async ({ canvasElement, step }) => {
    await step('Verify', async () => {
      const canvas = within(canvasElement);

      await waitFor(() => {
        expect(canvas.queryByText('Administrator 1')).toBeInTheDocument();
      });

      apiCallSpy.mockClear();

      // Navigate to page 2
      const nextButtons = canvas.getAllByRole('button', { name: /next/i });
      if (nextButtons.length > 0) {
        await userEvent.click(nextButtons[0]);

        // Verify we're on page 2 (offset = 10 for page 2 with limit 10)
        await waitFor(() => {
          const { calls } = apiCallSpy.mock;
          const pageCall = calls.find((c) => c[0].offset === 10);
          expect(pageCall).toBeDefined();
        });

        // Now apply a filter
        const filterInput = canvas.getByPlaceholderText(/filter by name/i);
        await userEvent.type(filterInput, 'Admin');

        // Page should reset to 1 (offset = 0)
        await waitFor(
          () => {
            const { calls } = apiCallSpy.mock;
            const lastCall = calls[calls.length - 1][0];
            expect(lastCall.offset).toBe(0);
            expect(lastCall.nameFilter).toContain('Admin');
          },
          { timeout: 5000 },
        );
      }
    });
  },
};

/**
 * Page clamping - auto-corrects out-of-range page numbers.
 * When the URL contains a page number that exceeds the total pages,
 * TableView automatically clamps to the last valid page.
 *
 * This is tested at the TableView level so ALL tables get this behavior
 * without needing to implement it individually.
 */
export const PageClampingOutOfRange: StoryObj<typeof OutOfRangePageTable> = {
  render: () => <OutOfRangePageTable />,
  parameters: {
    // Use MemoryRouter with out-of-range page URL
    routerInitialEntries: ['/test?page=1000&perPage=10'],
    docs: {
      description: {
        story: `
## Page Clamping Behavior

When a user navigates to a URL with an out-of-range page number (e.g., \`?page=1000\` when there are only 50 items),
TableView automatically detects this and clamps to the last valid page.

This behavior is centralized in TableView so:
- All tables using TableView get this behavior automatically
- No need to implement in individual components
- Consistent UX across all tables
- Single place to fix bugs or improve behavior

### How it works:
1. TableView receives \`page\`, \`perPage\`, \`totalCount\`, and \`onPageChange\`
2. When data loads, it checks if \`page > Math.ceil(totalCount / perPage)\`
3. If so, it calls \`onPageChange(maxPage)\` to correct the page
4. This triggers a new data fetch with the valid offset
        `,
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify', async () => {
      const canvas = within(canvasElement);

      // Wait for data to load and TableView to clamp to last valid page
      // With 50 items and perPage=10, max page is 5
      // Note: Clamping happens after data loads (when totalCount is known)
      // Sorted by name (role_1, role_10, ...): page 5 = role_46..role_49, role_5, role_50, role_6..role_9
      // Display names on page 5: Manager 5, Analyst 5, Support 5, Tester 5, Developer 1, Designer 5, Manager 1, Analyst 1, Support 1, Tester 1
      await waitFor(
        () => {
          expect(canvas.queryByText('Tester 5')).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      // URL should be updated to the clamped page
      await waitFor(() => {
        const urlDisplay = canvas.queryByTestId('url-params');
        expect(urlDisplay).toBeInTheDocument();
        expect(urlDisplay!.textContent).toContain('page=5');
      });

      // Verify we don't see items from page 1
      expect(canvas.queryByText('Administrator 1')).not.toBeInTheDocument();
    });
  },
};

/**
 * Interactive pagination - navigate between pages.
 */
export const Pagination: Story = {
  args: {},
  play: async ({ canvasElement, step }) => {
    await step('Verify', async () => {
      const canvas = within(canvasElement);

      await waitFor(() => {
        expect(canvas.queryByText('Administrator 1')).toBeInTheDocument();
      });

      apiCallSpy.mockClear();

      // Navigate to next page
      const nextButtons = canvas.getAllByRole('button', { name: /next/i });
      if (nextButtons.length > 0) {
        await userEvent.click(nextButtons[0]);

        // Verify API was called with offset for page 2 (offset = 10)
        await waitFor(() => {
          const { calls } = apiCallSpy.mock;
          expect(calls.some((c) => c[0].offset === 10)).toBe(true);
        });
      }
    });
  },
};

// =============================================================================
// SORTING STORIES
// =============================================================================

/**
 * Interactive sorting - click column headers to sort.
 * Tests: clicking sort triggers data reload and updates UI.
 */
export const Sorting: Story = {
  args: {},
  play: async ({ canvasElement, step }) => {
    await step('Verify', async () => {
      const canvas = within(canvasElement);

      // Wait for initial data load
      await waitFor(() => {
        expect(canvas.queryByText('Administrator 1')).toBeInTheDocument();
      });

      // Find and click the Name column header to sort
      const columnHeaders = canvas.getAllByRole('columnheader');
      const nameHeader = columnHeaders.find((h) => h.textContent?.includes('Name'));
      expect(nameHeader).toBeTruthy();

      const sortButton = within(nameHeader!).getByRole('button');

      // Initial state is sorted by name ascending (A-Z)
      // First click toggles to descending (Z-A)
      apiCallSpy.mockClear();
      await userEvent.click(sortButton);

      // Check that the spy captured a descending sort
      await waitFor(
        () => {
          const { calls } = apiCallSpy.mock;
          const hasDescSort = calls.some((c) => c[0].orderBy === '-name' || (c[0].sort?.column === 'name' && c[0].sort?.direction === 'desc'));
          expect(hasDescSort).toBe(true);
        },
        { timeout: 5000 },
      );
    });
  },
};

// =============================================================================
// EXPANSION STORIES
// =============================================================================

/**
 * Interactive compound expansion - click permission counts to expand.
 * Renders a nested table inside the expanded area (real use case).
 */
export const CompoundExpansion: Story = {
  args: {
    enableExpansion: true,
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify', async () => {
      const canvas = within(canvasElement);

      await waitFor(() => {
        expect(canvas.queryByText('Administrator 1')).toBeInTheDocument();
      });

      // Find the expandable cells (they have compoundExpand buttons)
      const rows = canvas.getAllByRole('row');
      const dataRow = rows[1]; // First data row after header

      // Find the expand button in the permissions cell
      const expandButtons = within(dataRow).getAllByRole('button');
      const expandButton = expandButtons.find((btn) => {
        const cell = btn.closest('td');
        return cell?.getAttribute('data-label') === 'Permissions';
      });

      expect(expandButton).toBeTruthy();
      await userEvent.click(expandButton!);

      // Wait for expansion content - verify nested table is rendered
      await waitFor(() => {
        const expandedContent = queryByDataTestId(canvasElement, 'expanded-permissions-role-1');
        expect(expandedContent).toBeInTheDocument();

        // Verify nested table exists with permission data
        const nestedTable = expandedContent?.querySelector('table');
        expect(nestedTable).toBeInTheDocument();

        // Scope assertions to the expanded content area
        const expandedArea = within(expandedContent as HTMLElement);

        // Verify nested table has headers
        expect(expandedArea.queryByText('Permission')).toBeInTheDocument();
        expect(expandedArea.queryByText('Description')).toBeInTheDocument();

        // Verify actual permission data from mockPermissions['role-1']
        expect(expandedArea.queryByText('rbac:role:read')).toBeInTheDocument();
        expect(expandedArea.queryByText('Read roles')).toBeInTheDocument();
        expect(expandedArea.queryByText('rbac:role:write')).toBeInTheDocument();
        expect(expandedArea.queryByText('Write roles')).toBeInTheDocument();
      });

      // Click again to collapse
      await userEvent.click(expandButton!);

      // Verify expanded content is hidden
      await waitFor(() => {
        // The element might still be in DOM but row should be collapsed
        const expandedRow = queryExpandedRow(canvasElement);
        expect(expandedRow).toBeNull();
      });
    });
  },
};

/**
 * Table without expansion - permissions column is NOT expandable.
 */
export const NoExpansion: Story = {
  args: {
    enableExpansion: false,
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify', async () => {
      const canvas = within(canvasElement);

      await waitFor(() => {
        expect(canvas.queryByText('Administrator 1')).toBeInTheDocument();
      });

      // Permissions cells should NOT have expand buttons
      const rows = canvas.getAllByRole('row');
      const dataRow = rows[1];
      const cells = within(dataRow).getAllByRole('cell');

      // Find permissions cell
      const permissionsCell = cells.find((c) => c.getAttribute('data-label') === 'Permissions');
      if (permissionsCell) {
        // Should NOT have a compound expand button (only plain content)
        const expandButton = within(permissionsCell).queryByRole('button');
        expect(expandButton).toBeNull();
      }
    });
  },
};

/**
 * Conditional expansion - only some rows can expand based on data.
 * Uses isCellExpandable to determine which rows have expand buttons.
 * In this example, only roles with permissions defined (role-1, role-2, role-3) can expand.
 */
export const ConditionalExpansion: Story = {
  args: {
    enableExpansion: true,
    conditionalExpansion: true,
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify', async () => {
      const canvas = within(canvasElement);

      await waitFor(() => {
        expect(canvas.queryByText('Administrator 1')).toBeInTheDocument();
      });

      const rows = canvas.getAllByRole('row');

      // Row 1 (Administrator 1 - role-1) should have an expand button (has permissions)
      const row1 = rows[1];
      const row1PermissionsCell = within(row1)
        .getAllByRole('cell')
        .find((c) => c.getAttribute('data-label') === 'Permissions');
      expect(row1PermissionsCell).toBeDefined();
      const row1ExpandButton = within(row1PermissionsCell!).queryByRole('button');
      expect(row1ExpandButton).toBeInTheDocument();

      // Row 4 (Auditor 1 - role-4) should NOT have an expand button (no permissions)
      const row4 = rows[4];
      const row4PermissionsCell = within(row4)
        .getAllByRole('cell')
        .find((c) => c.getAttribute('data-label') === 'Permissions');
      expect(row4PermissionsCell).toBeDefined();
      const row4ExpandButton = within(row4PermissionsCell!).queryByRole('button');
      expect(row4ExpandButton).toBeNull();

      // Click the expand button on row 1 to expand it
      await userEvent.click(row1ExpandButton!);

      // Verify expanded content appears
      await waitFor(() => {
        expect(canvas.queryByTestId('expanded-permissions-role-1')).toBeInTheDocument();
      });

      // Verify the nested table shows the permissions
      const expandedContent = canvas.getByTestId('expanded-permissions-role-1');
      expect(within(expandedContent).getByText('rbac:role:read')).toBeInTheDocument();
      expect(within(expandedContent).getByText('rbac:role:write')).toBeInTheDocument();
    });
  },
};

// =============================================================================
// URL SYNC STORIES
// =============================================================================

/**
 * URL synchronization test - verifies query params are set/cleared.
 * This is the reference story for E2E test patterns.
 */
export const UrlSyncWithQueryParams: StoryObj<typeof UrlSyncTable> = {
  render: () => <UrlSyncTable />,
  play: async ({ canvasElement, step }) => {
    await step('Verify', async () => {
      const canvas = within(canvasElement);

      await waitFor(
        () => {
          expect(canvas.queryByText('Administrator 1')).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      // Check URL params display element exists
      const urlDisplay = canvas.getByTestId('url-params');
      expect(urlDisplay).toBeInTheDocument();

      apiCallSpy.mockClear();

      // Apply a filter
      const filterInput = canvas.getByPlaceholderText(/filter by name/i);
      await userEvent.type(filterInput, 'Admin');

      // Wait for API to be called with filter and URL to update
      await waitFor(
        () => {
          const { calls } = apiCallSpy.mock;
          const filterCall = calls.find((c) => c[0].nameFilter?.includes('Admin'));
          expect(filterCall).toBeDefined();
        },
        { timeout: 5000 },
      );

      // Check URL params display shows the filter
      await waitFor(
        () => {
          expect(urlDisplay.textContent).toContain('name=');
        },
        { timeout: 5000 },
      );

      // Sort by a column
      const columnHeaders = canvas.getAllByRole('columnheader');
      const nameHeader = columnHeaders.find((h) => h.textContent?.includes('Name'));
      const sortButton = nameHeader?.querySelector('button');
      if (sortButton) {
        await userEvent.click(sortButton);

        // URL should have sort params
        await waitFor(
          () => {
            expect(urlDisplay.textContent).toContain('sortBy=');
            expect(urlDisplay.textContent).toContain('sortDir=');
          },
          { timeout: 5000 },
        );
      }

      // Clear filters
      await userEvent.clear(filterInput);

      // API should be called with empty filter
      await waitFor(
        () => {
          const { calls } = apiCallSpy.mock;
          // Find a call with empty nameFilter (after clearing)
          const clearCall = calls.find((c) => c[0].nameFilter === '');
          expect(clearCall).toBeDefined();
        },
        { timeout: 5000 },
      );
    });
  },
};

// =============================================================================
// API TESTING REFERENCE STORY
// =============================================================================

/**
 * API Testing Reference Story
 *
 * This story demonstrates how to test API integration with spies.
 * Use this as a reference for E2E tests to verify:
 * - Correct API parameters are passed
 * - Pagination offset/limit calculation
 * - Sort order_by formatting
 * - Filter parameter serialization
 */
export const ApiTestingReference: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: `
## API Testing Reference

This story demonstrates how to test API calls with the in-memory simulation spy.
The \`apiCallSpy\` is called from the \`handleStaleData\` callback with the actual
API parameters received by the simulation function.

### What's tested:
- Page/perPage -> offset/limit calculation
- Sort column/direction -> orderBy format (\`name\` or \`-name\`)
- Filters -> nameFilter, typeFilter params

### How to use in E2E tests:
\`\`\`typescript
// After user interaction
await waitFor(() => {
  const lastCall = apiCallSpy.mock.calls[apiCallSpy.mock.calls.length - 1][0];
  expect(lastCall.offset).toBe(10);      // Page 2 with limit 10
  expect(lastCall.limit).toBe(10);
  expect(lastCall.orderBy).toBe('-name'); // Descending sort
  expect(lastCall.nameFilter).toBe('Admin');
});
\`\`\`
        `,
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify', async () => {
      const canvas = within(canvasElement);

      await waitFor(() => {
        expect(canvas.queryByText('Administrator 1')).toBeInTheDocument();
      });

      apiCallSpy.mockClear();

      // 1. Test pagination API params
      const nextButtons = canvas.getAllByRole('button', { name: /next/i });
      if (nextButtons.length > 0) {
        await userEvent.click(nextButtons[0]);

        await waitFor(() => {
          const { calls } = apiCallSpy.mock;
          // Find call with offset = 10 (page 2 with limit 10)
          const pageCall = calls.find((c) => c[0].offset === 10);
          expect(pageCall).toBeDefined();
          expect(pageCall![0].limit).toBe(10);
        });
      }

      // 2. Test sort API params
      const columnHeaders = canvas.getAllByRole('columnheader');
      const nameHeader = columnHeaders.find((h) => h.textContent?.includes('Name'));
      const sortButton = nameHeader?.querySelector('button');
      if (sortButton) {
        await userEvent.click(sortButton);

        await waitFor(() => {
          const { calls } = apiCallSpy.mock;
          // Find call with descending sort (orderBy = '-name')
          const sortCall = calls.find((c) => c[0].orderBy === '-name');
          expect(sortCall).toBeDefined();
        });
      }

      // 3. Test filter API params
      const filterInput = canvas.getByPlaceholderText(/filter by name/i);
      await userEvent.type(filterInput, 'Admin');

      await waitFor(() => {
        const { calls } = apiCallSpy.mock;
        // Find call with nameFilter containing 'Admin'
        const filterCall = calls.find((c) => c[0].nameFilter?.includes('Admin'));
        expect(filterCall).toBeDefined();
        // Page should reset to 1 (offset = 0)
        expect(filterCall![0].offset).toBe(0);
      });
    });
  },
};

/**
 * Test story for initialSelectedRows functionality.
 *
 * Verifies that:
 * - Rows passed to initialSelectedRows are selected on mount
 * - Selection count displays correctly
 * - Clear selection works
 */
export const InitialSelectionTest: StoryObj<typeof InitialSelectionTable> = {
  render: (args) => <InitialSelectionTable {...args} />,
  args: {},
  parameters: {
    docs: {
      description: {
        story: `
## Initial Selection

Use \`initialSelectedRows\` in \`useTableState\` to pre-select rows on mount.
Useful for edit forms where existing selections need to be restored.

\`\`\`typescript
const tableState = useTableState({
  columns,
  getRowId: (row) => row.id,
  initialSelectedRows: existingSelections,
  onStaleData: handleStaleData,
});
\`\`\`
        `,
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify', async () => {
      const canvas = within(canvasElement);

      // Wait for data to load
      await waitFor(() => {
        expect(canvas.queryByText('Administrator 1')).toBeInTheDocument();
      });

      // Verify initial selection - 2 rows should be selected
      const clearButton = canvas.getByRole('button', { name: /clear selection \(2\)/i });
      expect(clearButton).toBeInTheDocument();

      // Verify checkboxes are checked for initial rows
      const checkboxes = canvas.getAllByRole('checkbox');
      // First row (Administrator 1) should be checked
      expect(checkboxes[1]).toBeChecked(); // [0] is bulk select

      // Clear selection
      await userEvent.click(clearButton);

      // Verify selection is cleared
      await waitFor(() => {
        expect(canvas.queryByRole('button', { name: /clear selection/i })).not.toBeInTheDocument();
      });
    });
  },
};

// =============================================================================
// CURSOR PAGINATION STORIES
// =============================================================================

/**
 * Cursor Pagination - Indeterminate mode.
 *
 * Demonstrates TableView with cursor-based pagination (paginationMode: 'cursor').
 * - The API returns `meta.limit` (no count/offset) and `links.next`/`links.previous`
 * - PF Pagination renders in indeterminate mode: "1 - 10 of many"
 * - Only next/previous navigation is available (no page input, no first/last)
 * - Page resets to 1 when filters or sort change
 */
export const CursorPagination: StoryObj<typeof CursorPaginatedTable> = {
  render: (args) => <CursorPaginatedTable {...args} />,
  parameters: {
    docs: {
      description: {
        story: `
## Cursor-Based Pagination

For APIs that use cursor pagination (no total count), set \`paginationMode: 'cursor'\` on \`useTableState\`.
Omit \`totalCount\` from \`TableView\` to activate PF's indeterminate pagination display.

### API Response Shape:
\`\`\`json
{
  "data": [...],
  "meta": { "limit": 10 },
  "links": {
    "next": "/api/v2/roles/?limit=10&cursor=abc123",
    "previous": null
  }
}
\`\`\`

### Usage:
\`\`\`tsx
const tableState = useTableState({
  columns,
  getRowId: (r) => r.id,
  paginationMode: 'cursor',
});

// After fetching data:
tableState.cursorMeta?.setCursorLinks(response.links);

<TableView {...tableState} data={data} />
// Note: no totalCount prop = indeterminate mode
\`\`\`
        `,
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify', async () => {
      const canvas = within(canvasElement);

      // Wait for initial data to load
      await waitFor(() => {
        expect(canvas.queryByText('Administrator 1')).toBeInTheDocument();
      });

      // Verify pagination renders in indeterminate mode
      // PF renders "1 - 10 of many" when itemCount is omitted
      await waitFor(() => {
        const paginationText = queryPagination(canvasElement);
        expect(paginationText).toBeInTheDocument();
      });

      // Verify "next" button exists
      const nextButtons = canvas.getAllByRole('button', { name: /next/i });
      expect(nextButtons.length).toBeGreaterThan(0);
    });
  },
};

/**
 * Cursor Pagination - Forward/Backward Navigation.
 *
 * Tests that navigating forward and backward works correctly:
 * - Forward: cursor from links.next is sent to API
 * - Backward: returns to previous cursor from stack
 * - Data updates on each navigation
 */
export const CursorPaginationNavigation: StoryObj<typeof CursorPaginatedTable> = {
  render: (args) => <CursorPaginatedTable {...args} enableFilters={false} />,
  beforeEach: () => {
    cursorApiCallSpy.mockClear();
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify', async () => {
      const canvas = within(canvasElement);

      // Wait for initial data
      await waitFor(() => {
        expect(canvas.queryByText('Administrator 1')).toBeInTheDocument();
      });

      // Verify first page data (should show first 10 items sorted by name)
      expect(canvas.getByText('Administrator 1')).toBeInTheDocument();

      cursorApiCallSpy.mockClear();

      // Navigate to page 2
      const nextButtons = canvas.getAllByRole('button', { name: /next/i });
      await userEvent.click(nextButtons[0]);

      // Wait for page 2 to load
      await waitFor(() => {
        const { calls } = cursorApiCallSpy.mock;
        // Should have been called with a cursor (non-null)
        const cursorCall = calls.find((c) => c[0].cursor !== null);
        expect(cursorCall).toBeDefined();
      });

      // Wait for page 2 data to render (different items)
      await waitFor(() => {
        // Page 2 should not show page 1's first item
        expect(canvas.queryByText('Administrator 1')).not.toBeInTheDocument();
      });

      cursorApiCallSpy.mockClear();

      // Navigate back to page 1
      const prevButtons = canvas.getAllByRole('button', { name: /previous/i });
      await userEvent.click(prevButtons[0]);

      // Wait for page 1 to load again
      await waitFor(() => {
        const { calls } = cursorApiCallSpy.mock;
        // Should have been called with null cursor (page 1)
        const firstPageCall = calls.find((c) => c[0].cursor === null);
        expect(firstPageCall).toBeDefined();
      });

      // Page 1 data should be back
      await waitFor(() => {
        expect(canvas.queryByText('Administrator 1')).toBeInTheDocument();
      });
    });
  },
};

/**
 * Cursor Pagination - Filter resets page.
 *
 * Tests that applying a filter resets cursor pagination to page 1.
 */
export const CursorPaginationFilterReset: StoryObj<typeof CursorPaginatedTable> = {
  render: (args) => <CursorPaginatedTable {...args} />,
  beforeEach: () => {
    cursorApiCallSpy.mockClear();
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify', async () => {
      const canvas = within(canvasElement);

      // Wait for initial data
      await waitFor(() => {
        expect(canvas.queryByText('Administrator 1')).toBeInTheDocument();
      });

      cursorApiCallSpy.mockClear();

      // Navigate to page 2
      const nextButtons = canvas.getAllByRole('button', { name: /next/i });
      await userEvent.click(nextButtons[0]);

      // Wait for page 2 data
      await waitFor(() => {
        expect(canvas.queryByText('Administrator 1')).not.toBeInTheDocument();
      });

      cursorApiCallSpy.mockClear();

      // Apply a name filter
      const filterInput = canvas.getByPlaceholderText(/filter by name/i);
      await userEvent.type(filterInput, 'Admin');

      // Wait for API to be called - should be back to first page (no cursor)
      await waitFor(() => {
        const { calls } = cursorApiCallSpy.mock;
        const lastCall = calls[calls.length - 1]?.[0];
        // Filter call should have no cursor (page 1)
        expect(lastCall?.cursor).toBeNull();
        expect(lastCall?.nameFilter).toContain('Admin');
      });

      // Filtered results should appear
      await waitFor(() => {
        expect(canvas.queryByText('Administrator 1')).toBeInTheDocument();
      });
    });
  },
};
