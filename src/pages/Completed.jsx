import { useApp } from '../contexts/AppContext';
import { GoalCard } from '../components/GoalCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const Completed = () => {
  const { goals, isLoading } = useApp();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const completedGoals = goals.filter((g) => g.status === 'completed');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Completed Goals</h2>
        <p className="text-gray-600">View all your achievements</p>
      </div>

      {completedGoals.length === 0 ? (
        <EmptyState
          title="No Completed Goals Yet"
          description="Complete your first goal to see it appear here and earn XP"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {completedGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onComplete={() => {}}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ))}
        </div>
      )}

      {completedGoals.length > 0 && (
        <div className="text-center text-gray-500 pt-4">
          Total: {completedGoals.length} completed {completedGoals.length === 1 ? 'goal' : 'goals'}
        </div>
      )}
    </div>
  );
};
