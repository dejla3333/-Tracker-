import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/Button';
import { GoalCard } from '../components/GoalCard';
import { Modal } from '../components/Modal';
import { GoalForm } from '../components/GoalForm';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableGoalCard = ({ goal, onComplete, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: goal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <GoalCard
        goal={goal}
        onComplete={onComplete}
        onEdit={onEdit}
        onDelete={onDelete}
        draggable={true}
      />
    </div>
  );
};

export const Goals = () => {
  const { goals, addGoal, updateGoal, deleteGoal, completeGoal, reorderGoals, isLoading } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activeGoals = goals.filter((g) => g.status === 'active');

  const handleAddGoal = () => {
    setEditingGoal(null);
    setIsModalOpen(true);
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleSubmit = (formData) => {
    if (editingGoal) {
      updateGoal(editingGoal.id, formData);
    } else {
      addGoal(formData);
    }
    setIsModalOpen(false);
    setEditingGoal(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(id);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = activeGoals.findIndex((g) => g.id === active.id);
      const newIndex = activeGoals.findIndex((g) => g.id === over.id);
      const reorderedActive = arrayMove(activeGoals, oldIndex, newIndex);
      const completedGoals = goals.filter((g) => g.status === 'completed');
      reorderGoals([...reorderedActive, ...completedGoals]);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Goals</h2>
          <p className="text-gray-600">Manage your active goals</p>
        </div>
        <Button variant="primary" onClick={handleAddGoal}>
          + Add Goal
        </Button>
      </div>

      {activeGoals.length === 0 ? (
        <EmptyState
          title="No Active Goals"
          description="Start by creating your first goal to begin tracking your progress and earning XP"
          action={
            <Button variant="primary" onClick={handleAddGoal}>
              Create Your First Goal
            </Button>
          }
        />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={activeGoals.map((g) => g.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeGoals.map((goal) => (
                <SortableGoalCard
                  key={goal.id}
                  goal={goal}
                  onComplete={completeGoal}
                  onEdit={handleEditGoal}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingGoal(null);
        }}
        title={editingGoal ? 'Edit Goal' : 'Create New Goal'}
      >
        <GoalForm
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingGoal(null);
          }}
          initialData={editingGoal}
        />
      </Modal>
    </div>
  );
};
