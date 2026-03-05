import { useApp } from '../contexts/AppContext';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { getProgressPercentage } from '../utils/helpers';

export const Dashboard = () => {
  const { goals, userProgress, isLoading } = useApp();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const activeGoals = goals.filter((g) => g.status === 'active');
  const completedGoals = goals.filter((g) => g.status === 'completed');
  const totalGoals = goals.length;
  const completionPercentage = getProgressPercentage(completedGoals.length, totalGoals);

  const stats = [
    {
      label: 'Total XP',
      value: userProgress.xpTotal,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Current Streak',
      value: `${userProgress.streak} days`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Completed Goals',
      value: userProgress.completedCount,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Active Goals',
      value: activeGoals.length,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Track your progress and stay motivated</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className={`${stat.bgColor} border-2 border-transparent hover:border-gray-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className="text-4xl">{stat.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {totalGoals > 0 && (
        <Card>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Overall Progress</h3>
          <ProgressBar
            percentage={completionPercentage}
            color="success"
            label="Goals Completed"
            showLabel={true}
          />
          <p className="text-sm text-gray-600 mt-2">
            {completedGoals.length} of {totalGoals} goals completed
          </p>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">XP Progress</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Current XP</span>
              <span className="text-2xl font-bold text-primary-600">{userProgress.xpTotal}</span>
            </div>
            <ProgressBar
              percentage={Math.min((userProgress.xpTotal / 1000) * 100, 100)}
              color="primary"
              showLabel={false}
            />
            <p className="text-sm text-gray-500">
              Keep completing goals to earn more XP and level up
            </p>
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Streak Counter</h3>
          <div className="text-center py-4">
            <div className="text-6xl mb-2">🔥</div>
            <p className="text-4xl font-bold text-orange-600 mb-2">{userProgress.streak}</p>
            <p className="text-gray-600">day streak</p>
            <p className="text-sm text-gray-500 mt-4">
              Complete a goal every day to maintain your streak
            </p>
          </div>
        </Card>
      </div>

      {activeGoals.length > 0 && (
        <Card>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Active Goals</h3>
          <div className="space-y-3">
            {activeGoals.slice(0, 3).map((goal) => (
              <div
                key={goal.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{goal.title}</p>
                  {goal.description && (
                    <p className="text-sm text-gray-600 truncate">{goal.description}</p>
                  )}
                </div>
                <span className="text-primary-600 font-semibold ml-4">{goal.xpReward} XP</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
