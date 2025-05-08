'use client';

import TaskCard from '@/components/TaskCard';
import BackToDashboardLink from '@/components/BackToDashboardLink';

const mockTasks = [
  {
    id: '1',
    title: 'Thiết kế giao diện đăng nhập',
    description: 'Tạo form đăng nhập đẹp và responsive',
    deadline: '2025-05-09',
    completed: false,
  },
  {
    id: '2',
    title: 'Thêm chức năng đăng ký',
    completed: true,
  },
];

export default function TasksPage() {
  const toggleComplete = (id: string) => {
    console.log('Toggle task:', id);
  };

  const deleteTask = (id: string) => {
    console.log('Delete task:', id);
  };

  return (
    <div className="space-y-4">
      <BackToDashboardLink />

      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">📋 Danh sách Task</h2>

      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        ➕ Thêm Task mới
      </button>

      <div className="space-y-2">
        {mockTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggleComplete={toggleComplete}
            onDelete={deleteTask}
          />
        ))}
      </div>
    </div>
  );
}
