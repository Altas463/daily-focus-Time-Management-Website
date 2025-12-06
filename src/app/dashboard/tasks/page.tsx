"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import BackToDashboardLink from "@/components/BackToDashboardLink";
import TimeBlockingBoard, {
  buildBlockAssignments,
  findTimeBlockById,
  type TimeBlockDefinition,
} from "@/components/tasks/TimeBlockingBoard";
import type { Task } from "@/types";
import {
  createEmptyTask,
  summarizeTasks,
  isTaskDueSoon,
  isTaskOverdue,
} from "@/utils/tasks";
import { Plus } from "lucide-react";

// Redesign Components
import TaskHeader from "@/components/tasks/redesign/TaskHeader";
import TaskToolbar from "@/components/tasks/redesign/TaskToolbar";
import TaskStats from "@/components/tasks/redesign/TaskStats";
import TaskCard from "@/components/tasks/redesign/TaskCard";

type ColumnKey = "incomplete" | "completed";
type NewTaskState = ReturnType<typeof createEmptyTask>;

const MINUTE_IN_MS = 60_000;

const getTodayInputValue = () => {
  const now = new Date();
  const offsetMinutes = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offsetMinutes * MINUTE_IN_MS);
  return local.toISOString().slice(0, 10);
};

const createDateTimeFromInput = (date: string, hour: number, minute: number) => {
  const [year, month, day] = date.split("-").map(Number);
  const result = new Date();
  result.setFullYear(year, month - 1, day);
  result.setHours(hour, minute, 0, 0);
  return result;
};

const quickTemplates = [
  { title: "Daily planning", description: "List of 3 important priorities" },
  { title: "Daily standup", description: "Progress update + blockers" },
  { title: "End of day recap", description: "Reflection + plan for tomorrow" },
] as const;

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<"board" | "planner">("board");
  
  // Form State
  const [newTaskMap, setNewTaskMap] = useState<Record<ColumnKey, NewTaskState>>({
    incomplete: createEmptyTask(),
    completed: createEmptyTask(),
  });
  const [formVisible, setFormVisible] = useState<Record<ColumnKey, boolean>>({
    incomplete: false,
    completed: false,
  });
  
  // Filters & Search
  const [filter, setFilter] = useState<"all" | "dueSoon" | "overdue">("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Time Blocking State
  const [timeBlockDate, setTimeBlockDate] = useState<string>(() => getTodayInputValue());
  const [timeBlockPending, setTimeBlockPending] = useState<string | null>(null);
  const [timeBlockStatus, setTimeBlockStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    void fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data: Task[] = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const taskSummary = useMemo(() => summarizeTasks(tasks), [tasks]);
  const timeBlockAssignments = useMemo(
    () => buildBlockAssignments(tasks, timeBlockDate),
    [tasks, timeBlockDate]
  );

  // --- Actions ---

  const handleCreateTask = async (column: ColumnKey) => {
     const formState = newTaskMap[column];
     const trimmedTitle = formState.title.trim();
     if (!trimmedTitle) return; // Simple validation

     const payload: Partial<Task> = {
       title: trimmedTitle,
       description: formState.description.trim() || undefined,
       startDate: formState.startDate || undefined,
       endDate: formState.endDate || undefined,
       completed: column === "completed",
     };

     try {
       const res = await fetch("/api/tasks", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(payload),
       });

       if (!res.ok) throw new Error("Failed to create task");
       const created: Task = await res.json();
       setTasks((prev) => [created, ...prev]);
       setNewTaskMap((prev) => ({ ...prev, [column]: createEmptyTask() }));
       setFormVisible((prev) => ({ ...prev, [column]: false }));
     } catch (error) {
       console.error("Failed to create task:", error);
     }
  };

  const updateTask = async (id: string, data: Partial<Task>) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update task");
      const updated: Task = await res.json();
      setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  // --- Drag & Drop Logic ---

  const scheduleTaskInBlock = async (taskId: string, block: TimeBlockDefinition) => {
    if (!timeBlockDate) {
      setTimeBlockStatus({ type: "error", text: "Select a date first." });
      return;
    }
    const occupant = timeBlockAssignments[block.id];
    // Clearing previous block logic if needed...
    
    setTimeBlockStatus(null);
    setTimeBlockPending(block.id);

    try {
      if (occupant && occupant.id !== taskId) {
        await updateTask(occupant.id, { startDate: null, endDate: null });
      }

      const start = createDateTimeFromInput(timeBlockDate, block.startHour, block.startMinute);
      const end = new Date(start.getTime() + block.duration * MINUTE_IN_MS);

      await updateTask(taskId, {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      });
      setTimeBlockStatus({ type: "success", text: "Scheduled successfully." });
    } catch (error) {
      console.error("Failed to schedule:", error);
      setTimeBlockStatus({ type: "error", text: "Schedule failed." });
    } finally {
      setTimeBlockPending(null);
    }
  };
  
  const handleClearAssignment = async (taskId: string) => {
     // ... (Existing logic to clear)
     try {
         await updateTask(taskId, { startDate: null, endDate: null });
         setTimeBlockStatus({ type: "success", text: "Cleared block." });
     } catch (e) {
         console.error(e);
     }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    if (destination.droppableId.startsWith("timeblock:")) {
      const blockId = destination.droppableId.replace("timeblock:", "");
      const block = findTimeBlockById(blockId);
      if (!block) return;
      await scheduleTaskInBlock(draggableId, block);
      return;
    }

    if (destination.droppableId !== "incomplete" && destination.droppableId !== "completed") return;

    const movedToCompleted = destination.droppableId === "completed";
    const task = tasks.find((item) => item.id === draggableId);
    if (!task || task.completed === movedToCompleted) return;

    setTasks((prev) =>
      prev.map((item) =>
        item.id === draggableId ? { ...item, completed: movedToCompleted } : item,
      )
    );

    try {
      await updateTask(draggableId, { completed: movedToCompleted });
    } catch (error) {
      console.error("Failed to move task:", error);
    }
  };

  // --- Filtering ---
  const filteredTasks = useMemo(() => {
    let result = tasks;
    const term = searchTerm.trim().toLowerCase();
    
    if (term) {
       result = result.filter((task) => 
          (task.title + " " + (task.description || "")).toLowerCase().includes(term)
       );
    }
    
    return result;
  }, [tasks, searchTerm]);

  const columns = useMemo(() => {
    const base = {
      incomplete: filteredTasks.filter((task) => !task.completed),
      completed: filteredTasks.filter((task) => task.completed),
    };

    if (filter === "dueSoon") {
      base.incomplete = base.incomplete.filter((task) => isTaskDueSoon(task.endDate));
    } else if (filter === "overdue") {
      base.incomplete = base.incomplete.filter((task) => isTaskOverdue(task.endDate));
    }
    return base;
  }, [filteredTasks, filter]);

  const applyTemplate = (index: number) => {
    const template = quickTemplates[index];
    if (!template) return;
    setNewTaskMap(prev => ({
        ...prev,
        incomplete: {
            ...prev.incomplete,
            title: template.title,
            description: template.description
        }
    }));
    setFormVisible(prev => ({...prev, incomplete: true}));
  };
  
  // --- Render Helpers ---

  const renderColumn = (columnType: ColumnKey, title: string) => {
      const items = columns[columnType];
      const isFormOpen = formVisible[columnType];
      
      return (
        <Droppable droppableId={columnType} key={columnType}>
            {(provided, snapshot) => (
                <div 
                    ref={provided.innerRef} 
                    {...provided.droppableProps}
                    className={`flex flex-col bg-surface-panel/30 border border-border-subtle rounded-sm h-full max-h-[calc(100vh-250px)] overflow-hidden transition-colors ${snapshot.isDraggingOver ? 'bg-surface-panel' : ''}`}
                >
                    {/* Column Header */}
                    <div className="p-4 border-b border-border-subtle bg-surface-base flex justify-between items-center sticky top-0 z-10">
                        <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${columnType === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                             <h3 className="text-sm font-bold font-display uppercase tracking-wider">{title}</h3>
                        </div>
                        <span className="text-xs font-mono text-slate-400 font-bold bg-surface-panel px-2 py-0.5 rounded-sm">{items.length}</span>
                    </div>

                    {/* Task List */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                        {items.length === 0 && !isFormOpen && (
                            <div className="py-8 text-center border-2 border-dashed border-border-subtle rounded-sm">
                                <span className="text-xs font-mono text-slate-400 uppercase">No tasks</span>
                            </div>
                        )}
                        
                        {items.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={provided.draggableProps.style}
                                        className={snapshot.isDragging ? "opacity-90 rotate-2 scale-105 z-50" : ""}
                                    >
                                        <TaskCard task={task} onUpdate={updateTask} onDelete={deleteTask} />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}

                        {/* Inline Create Form */}
                        {isFormOpen ? (
                           <div className="bg-white border border-border-default p-3 rounded-sm shadow-sm animate-in fade-in slide-in-from-bottom-2">
                               <input
                                   autoFocus
                                   className="w-full text-sm font-medium border-b border-border-default pb-1 mb-2 outline-none"
                                   placeholder="What needs to be done?"
                                   value={newTaskMap[columnType].title}
                                   onChange={e => setNewTaskMap(prev => ({...prev, [columnType]: {...prev[columnType], title: e.target.value}}))}
                                   onKeyDown={e => {
                                       if(e.key === 'Enter') handleCreateTask(columnType);
                                       if(e.key === 'Escape') setFormVisible(prev => ({...prev, [columnType]: false}));
                                   }}
                               />
                               <div className="flex justify-end gap-2">
                                   <button 
                                     onClick={() => setFormVisible(prev => ({...prev, [columnType]: false}))}
                                     className="text-xs font-mono text-slate-500 hover:text-slate-700 px-2 py-1"
                                   >
                                     CANCEL
                                   </button>
                                   <button 
                                     onClick={() => handleCreateTask(columnType)}
                                     className="bg-slate-900 text-white text-xs font-mono font-bold px-3 py-1 rounded-sm hover:bg-slate-700"
                                   >
                                     ADD
                                   </button>
                               </div>
                           </div>
                        ) : (
                           <button 
                             onClick={() => setFormVisible(prev => ({...prev, [columnType]: true}))}
                             className="w-full py-2 mb-2 flex items-center justify-center gap-2 text-xs font-mono text-slate-400 hover:text-primary hover:bg-surface-panel rounded-sm border border-transparent hover:border-border-default transition-all"
                           >
                              <Plus className="w-3 h-3" />
                              Add Task
                           </button>
                        )}
                    </div>
                </div>
            )}
        </Droppable>
      );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
        <div className="flex items-center gap-4 mb-4">
             <BackToDashboardLink />
             <div className="h-4 w-px bg-border-default"></div>
             <span className="text-sm font-mono text-slate-500 uppercase tracking-wider">Workspace</span>
        </div>

        <TaskHeader 
            onNewTask={() => setFormVisible(prev => ({...prev, incomplete: true}))} 
            tab={activeTab}
            setTab={setActiveTab}
        />

        <div className="space-y-6">
            {/* Stats & Tools Row */}
            <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between">
                 <TaskStats 
                    total={taskSummary.incomplete + taskSummary.completed} 
                    active={taskSummary.incomplete}
                    completed={taskSummary.completed}
                 />
                 
                 <div className="w-full xl:w-auto">
                    <TaskToolbar 
                        searchTerm={searchTerm} 
                        setSearchTerm={setSearchTerm} 
                        filter={filter} 
                        setFilter={setFilter} 
                        onApplyTemplate={applyTemplate}
                    />
                 </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                {activeTab === 'board' ? (
                    <div className="grid md:grid-cols-2 gap-6 h-full">
                        {renderColumn("incomplete", "In Progress")}
                        {renderColumn("completed", "Completed")}
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left: Time Planner */}
                         <div className="lg:col-span-2">
                            <TimeBlockingBoard
                                selectedDate={timeBlockDate}
                                onSelectedDateChange={(val) => {
                                    setTimeBlockDate(val); 
                                    setTimeBlockStatus(null);
                                }}
                                assignments={timeBlockAssignments}
                                onClearAssignment={handleClearAssignment}
                                pendingBlockId={timeBlockPending}
                                statusMessage={timeBlockStatus}
                                onDismissStatus={() => setTimeBlockStatus(null)}
                            />
                         </div>

                         {/* Right: Backlog (Reusing the 'incomplete' column render logic but styled differently?) */}
                         {/* Actually, let's just render the 'incomplete' column here as a sidebar */}
                         <div className="h-full">
                            <div className="sticky top-6">
                                <h3 className="text-sm font-bold font-display uppercase tracking-wider mb-2 text-slate-500">Task Backlog</h3>
                                <div className="h-[calc(100vh-200px)]">
                                     {renderColumn("incomplete", "Unscheduled Tasks")}
                                </div>
                            </div>
                         </div>
                    </div>
                )}
            </DragDropContext>
        </div>
    </div>
  );
}
