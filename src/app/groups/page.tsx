"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "../../components/layout/NavBar";
import Loader from "@/components/ui/Loader";
import { useAlert, AlertSnackbar } from "@/components/ui/AlertSnackbar";
import { Plus } from "lucide-react";
import { useGroups } from "@/hooks/useGroups";
import GroupGrid from "@/components/groups/GroupGrid";
import GroupForm from "@/components/groups/GroupForm";
import TaskForm from "@/components/tasks/TaskForm";
import TaskGrid from "@/components/groups/TaskGrid";
import type { TaskCreateDto } from "@/lib/dto/TaskDto";
import type { GroupCreateDto } from "@/lib/dto/GroupDto";
import DeleteModal from "@/components/ui/DeleteModal";
import styles from "@/components/groups/groups.module.css";

export default function GroupsPage() {
  const [activeTab, setActiveTab] = useState<"groups" | "tasks">("groups");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreateTaskForm, setShowCreateTask] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    active: boolean;
    groupId?: number;
    taskId?: number;
    type?: "group" | "task";
  }>({ active: false });
  const [formLoading, setFormLoading] = useState(false);
  const [taskLoading, setTaskLoading] = useState(false);
  
  const {
    groups,
    loading,
    fetchGroups,
    fetchTasks,
    createGroup,
    createTask,
    deleteGroup,
    deleteTask,
    tasks,
    tasksLoading,
  } = useGroups();

  const { alertState, showAlert, handleCloseAlert } = useAlert();
  const router = useRouter();

  useEffect(() => {
    void fetchGroups();
    void fetchTasks();
  }, [fetchGroups, fetchTasks]);

  const handleCreateGroup = async (formData: GroupCreateDto) => {
    setFormLoading(true);
    try {
      await createGroup(formData);
      setShowCreateForm(false);
      showAlert(
        "El grupo ha sido creado exitosamente.",
        "success",
        "Grupo Creado"
      );
    } catch (err) {
      showAlert(
        "Error al crear el grupo",
        "error",
        "Error"
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleCreateTask = async(formData: TaskCreateDto) => {
    setTaskLoading(true);
    try {
      await createTask(formData);
      setShowCreateTask(false);
      showAlert(
        "La tarea se creo con exito",
        "success",
        "Tarea Creada"
      )
    } catch (err) {
      showAlert(
        "Error al crear la tarea",
        "error",
        "Error"
      )
    } finally {
      setTaskLoading(false);
    }
  };

  const handleDeleteGroup = (id: number) => {
    setDeleteModal({
      active: true,
      groupId: id,
      type: "group",
    });
  };

  const handleDeleteTask = (id: number) => {
    setDeleteModal({
      active: true,
      taskId: id,
      type: "task",
    });
  };

  const confirmDelete = async () => {
    try {
      if (deleteModal.type === "group" && deleteModal.groupId) {
        await deleteGroup(String(deleteModal.groupId));
        showAlert(
          "El grupo ha sido eliminado.",
          "success",
          "Grupo Eliminado"
        );
      } else if (deleteModal.type === "task" && deleteModal.taskId) {
        await deleteTask(String(deleteModal.taskId));
        showAlert(
          "La tarea ha sido eliminada.",
          "success",
          "Tarea Eliminada"
        );
      }
    } catch (err) {
      showAlert(
        "Error al eliminar",
        "error",
        "Error"
      );
      console.error("Error deleting:", err);
    } finally {
      setDeleteModal({ active: false });
    }
  };

  const getDeleteItemName = () => {
    if (deleteModal.type === "group") {
      const group = groups.find(g => g.id === deleteModal.groupId);
      return group?.name || "Grupo";
    }
    const task = tasks.find(t => t.id === deleteModal.taskId);
    return task?.name || "Tarea";
  };

  if (loading || tasksLoading) {
    return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
          <Loader loading={loading || tasksLoading} width={50} height={50} />
        </div>
      );
  }

  return (
    <main className={styles.mainContent}>
      <NavBar>
        <div className={styles.headerActions}>
          <h1 className="text-3xl font-bold mt-6 text-darkest">{activeTab === "groups" ? "Grupos" : "Tareas"}</h1>
          <button
            className={styles.createButton}
            onClick={activeTab === "groups" ? () => setShowCreateForm(true) : () => setShowCreateTask(true)}
          >
            <Plus size={20} />
            {activeTab === "groups" ? "Crear Grupo" : "Crear Tarea"}
          </button>
        </div>
      </NavBar>
      
      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tab} ${activeTab === "groups" ? styles.active : ""}`}
          onClick={() => setActiveTab("groups")}
        >
          Grupos
        </button>
        <button
          className={`${styles.tab} ${activeTab === "tasks" ? styles.active : ""}`}
          onClick={() => setActiveTab("tasks")}
        >
          Tareas
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === "groups" && (
          <GroupGrid
            groups={groups}
            onDelete={handleDeleteGroup}
          />
        )}
        {activeTab === "tasks" && (
          <TaskGrid
            tasks={tasks}
            onDelete={handleDeleteTask}
          />
        )}
      </div>

      {showCreateForm && (
        <GroupForm
          onSubmit={handleCreateGroup}
          onCancel={() => setShowCreateForm(false)}
          isLoading={formLoading}
        />
      )}

      {showCreateTaskForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setShowCreateTask(false)}
          isLoading={taskLoading}
        />
      )}

      {deleteModal.active && (
        <DeleteModal
          itemName={getDeleteItemName()}
          itemType={deleteModal.type === "group" ? "Grupos" : "Tareas"}
          deleteFunction={confirmDelete}
          setActive={() => setDeleteModal({ active: false })}
        />
      )}

      <AlertSnackbar alertState={alertState} handleCloseAlert={handleCloseAlert} />
    </main>
  );
}
