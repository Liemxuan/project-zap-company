'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ZapListTable } from '../../../template/ZapListTable';
import { useMenus } from '../hooks/use-menus';
import { menuColumns } from '../constants/menu.columns';
import { useTranslation } from '../../../hooks/use-translation';
import { FilterGroup } from 'zap-design/src/genesis/molecules/data-filter';

interface Props {
  merchant?: string;
  lang?: string;
}

export default function MenuPage({ merchant, lang }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFullscreen = searchParams.get('fullscreen') === 'true';

  const { t, loading: tLoading } = useTranslation('menu');
  const {
    menus,
    loading,
    pageIndex,
    totalRecords,
    totalPages,
    pageSize,
    filter,
    handleSearch,
    handleFilterByStatus,
    handlePageChange,
    handlePageSizeChange,
  } = useMenus();

  const [showInspector, setShowInspector] = useState(false);

  // Define Filter Groups for the Inspector
  const filterGroups: FilterGroup[] = useMemo(() => [
    {
      id: 'status',
      title: t('filter_status', 'Trạng thái'),
      options: [
        { id: 'active', label: t('status_active', 'Đang hoạt động'), selected: filter.status === 'active' },
        { id: 'inactive', label: t('status_inactive', 'Ngừng hoạt động'), selected: filter.status === 'inactive' },
      ],
    },
  ], [t, filter.status]);

  if (tLoading) return null;

  const handleToggleFilter = (groupId: string, optionId: string) => {
    if (groupId === 'status') {
      const currentActive = filter.status === optionId;
      handleFilterByStatus(currentActive ? undefined : (optionId as 'active' | 'inactive'));
    }
  };

  const handleExitFullscreen = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('fullscreen');
    router.push(`?${params.toString()}`);
  };

  const activeFilterCount = (filter.status ? 1 : 0);

  return (
    <ZapListTable
      data={menus}
      loading={loading}
      header={{
        title: t('menu_title', 'Quản lý thực đơn'),
        breadcrumb: `zap inc / inventory / ${t('menu_breadcrumb', 'menus')}`,
        badge: t('badge_verified', 'verified'),
      }}
      canvas={{
        title: t('menu_canvas_title', 'Danh sách thực đơn'),
      }}
      filters={{
        title: t('filter_title', 'BỘ LỌC'),
        groups: filterGroups,
        onToggle: handleToggleFilter,
        isExpanded: showInspector,
        onToggleExpand: () => setShowInspector(!showInspector),
        activeCount: activeFilterCount,
      }}
      toolbar={{
        search: {
          value: filter.searchQuery || '',
          onChange: handleSearch,
          placeholder: t('search_menu_placeholder', 'Tìm kiếm thực đơn...'),
        },
        action: {
          label: t('btn_add_menu', 'Thêm thực đơn'),
          onClick: () => console.log('Add Menu Clicked'),
        },
        statsText: (
          <span className="text-sm font-medium text-muted-foreground font-body">
            {menus.length} {t('of', 'of')} {totalRecords} {t('records_matched', 'bản ghi khớp.')}
          </span>
        ),
      }}
      table={{
        columns: menuColumns(t),
        onRowClick: (item) => console.log('Clicked:', item),
      }}
      pagination={{
        currentPage: pageIndex,
        totalPages: totalPages,
        pageSize: pageSize,
        totalRecords: totalRecords,
        onPageChange: handlePageChange,
        onPageSizeChange: handlePageSizeChange,
      }}
      isFullscreen={isFullscreen}
      fullScreenHref="?fullscreen=true"
      onExitFullscreen={handleExitFullscreen}
      t={t}
    />
  );
}
