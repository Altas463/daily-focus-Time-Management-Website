import BackToDashboardLink from '@/components/BackToDashboardLink';
import PomodoroTimer from '@/components/pomodoro/PomodoroTimer';

export default function PomodoroPage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Back to dashboard button */}
      <div className="absolute top-6 left-6 z-10">
        <div className="group">
          <BackToDashboardLink />
        </div>
      </div>

      {/* Focus mode indicator */}
      <div className="absolute top-6 right-6 z-10">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-200">Focus Mode</span>
        </div>
      </div>

      {/* Main timer container */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl px-6 py-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
              <span className="text-white text-sm">⏳</span>
            </div>
            <span className="text-lg font-semibold text-gray-200">Pomodoro Focus Session</span>
          </div>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Tập trung hoàn toàn vào công việc. Hãy để mọi thứ khác sang một bên và chỉ tập trung vào nhiệm vụ hiện tại.
          </p>
        </div>

        {/* Timer component with enhanced styling */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <PomodoroTimer focusMode />
        </div>

        {/* Focus tips */}
        <div className="mt-8 text-center">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-3 flex items-center justify-center gap-2">
              <span>💡</span>
              Mẹo tập trung
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                <span>Tắt thông báo điện thoại</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span>Chuẩn bị nước uống</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                <span>Thở sâu và bắt đầu</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ambient light effects */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </div>
  );
}