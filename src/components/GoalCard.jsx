import { Card } from './Card';
import { Button } from './Button';
import { formatDate, getDaysUntilDeadline, isOverdue } from '../utils/helpers';

export const GoalCard = ({ goal, onComplete, onEdit, onDelete, draggable = false }) => {
  const daysUntil = getDaysUntilDeadline(goal.deadline);
  const overdue = isOverdue(goal.deadline);

  return (
    <Card className="relative">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{goal.title}</h3>
          {goal.description && (
            <p className="text-gray-600 text-sm mb-2">{goal.description}</p>
          )}
        </div>
        {draggable && (
          <div className="cursor-move text-gray-400 hover:text-gray-600 px-2">
            ⋮⋮
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700">
          {goal.xpReward || 0} XP
        </span>
        {goal.deadline && (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
              overdue
                ? 'bg-red-100 text-red-700'
                : daysUntil <= 3
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {overdue ? 'Overdue' : daysUntil === 0 ? 'Today' : `${daysUntil} days`}
          </span>
        )}
        {goal.status === 'completed' && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
            Completed {goal.completedAt && `on ${formatDate(goal.completedAt)}`}
          </span>
        )}
      </div>

      {goal.deadline && (
        <p className="text-xs text-gray-500 mb-3">Deadline: {formatDate(goal.deadline)}</p>
      )}

      {goal.status === 'active' && (
        <div className="flex space-x-2">
          <Button variant="success" onClick={() => onComplete(goal.id)} className="flex-1">
            Complete
          </Button>
          <Button variant="secondary" onClick={() => onEdit(goal)}>
            Edit
          </Button>
          <Button variant="danger" onClick={() => onDelete(goal.id)}>
            Delete
          </Button>
        </div>
      )}
    </Card>
  );
};
