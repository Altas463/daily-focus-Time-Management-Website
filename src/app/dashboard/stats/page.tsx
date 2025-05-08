import BackToDashboardLink from '@/components/BackToDashboardLink';
export default function StatsPage() {
    return (
        <div className="space-y-4">
              <BackToDashboardLink />
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">📊 Thống kê năng suất</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-white">Task hoàn thành theo tuần</h3>
            <div className="mt-4 text-gray-500 dark:text-gray-400">[Biểu đồ sẽ được thêm sau]</div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-white">Tổng thời gian làm việc</h3>
            <p className="mt-2 text-2xl text-green-500 font-bold">15 giờ</p>
          </div>
        </div>
      </div>
      </div>
    );
  }
  