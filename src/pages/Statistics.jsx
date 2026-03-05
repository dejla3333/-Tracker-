import { useApp } from '../contexts/AppContext';
import { Card } from '../components/Card';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const Statistics = () => {
  const { statistics, userProgress, isLoading } = useApp();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const hasData = statistics.weeklyCompletions.length > 0 || statistics.xpHistory.length > 0;

  if (!hasData) {
    return (
      <EmptyState
        title="No Statistics Yet"
        description="Complete some goals to see your progress statistics and charts"
      />
    );
  }

  const weeklyData = statistics.weeklyCompletions
    .slice(-8)
    .map((item) => ({
      week: item.week,
      goals: item.count,
    }));

  const xpData = statistics.xpHistory
    .slice(-10)
    .map((item) => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      xp: item.xp,
    }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Statistics</h2>
        <p className="text-gray-600">Visualize your progress over time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary-50 to-primary-100">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-2">Total XP Earned</p>
            <p className="text-4xl font-bold text-primary-600">{userProgress.xpTotal}</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-2">Current Streak</p>
            <p className="text-4xl font-bold text-orange-600">{userProgress.streak} days</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-2">Goals Completed</p>
            <p className="text-4xl font-bold text-green-600">{userProgress.completedCount}</p>
          </div>
        </Card>
      </div>

      {weeklyData.length > 0 && (
        <Card>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Goals Completed Per Week</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="goals" fill="#0284c7" name="Goals Completed" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {xpData.length > 0 && (
        <Card>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">XP Progress Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={xpData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="xp"
                stroke="#0284c7"
                strokeWidth={2}
                name="Total XP"
                dot={{ fill: '#0284c7', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      <Card>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Achievement Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Average XP per Goal</span>
            <span className="font-semibold text-primary-600">
              {userProgress.completedCount > 0
                ? Math.round(userProgress.xpTotal / userProgress.completedCount)
                : 0}{' '}
              XP
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Best Streak</span>
            <span className="font-semibold text-orange-600">{userProgress.streak} days</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Total Completions</span>
            <span className="font-semibold text-green-600">{userProgress.completedCount}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
